<?php

namespace App\Services;

use App\Models\SuiviPlante;
use App\Notifications\CultureAlertNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class CalculateurService
{
    private const EFFICIENCE_IRRIGATION = [
        'goutte_a_goutte' => 0.9,
        'aspersion'       => 0.75,
        'submersion'      => 0.6,
        'pluviale'        => 1.0,
    ];

    private const COEF_SOL = [
        'sableux'  => 1.3,
        'limoneux' => 1.0,
        'calcaire' => 1.1,
        'argileux' => 0.8,
        'humifere' => 0.85,
    ];

    public function __construct(
        protected WeatherService $weatherService,
        protected GeolocationService $geolocationService
    ) {}

    public function getLiveData(SuiviPlante $culture): array
    {
        $ville = $this->villeCulture($culture);
        $meteo = $this->weatherService->getDailyWeather($ville);

        $joursEcoules = $this->joursEcoules($culture);
        $stade = $this->stadeCourant($culture, $joursEcoules);

        $calcul = $this->calculerBesoin($culture, $stade, $meteo);

        return [
            'meteo'             => $meteo,
            'besoin_eau_live'   => $calcul['net'],
            'besoin_brut'       => $calcul['brut'],
            'economie_eau'      => $calcul['economie'],
            'pluie_mm'          => $calcul['pluie_mm'],
            'stade_dynamique'   => $this->libelleStade($stade, $joursEcoules),
            'progression_jours' => $joursEcoules,
            'plan_etapes'       => $culture->plante->stades()
                ->orderBy('jour_debut')
                ->get(['nom_stade', 'jour_debut', 'jour_fin']),
        ];
    }

    public function genererRecommandation(SuiviPlante $culture): bool
    {
        try {
            $joursEcoules = $this->joursEcoules($culture);
            $stade = $this->stadeCourant($culture, $joursEcoules);

            if (!$stade) {
                return false;
            }

            if ($joursEcoules === (int) $stade->jour_debut) {
                $culture->user->notify(new CultureAlertNotification(
                    $culture,
                    "Votre parcelle de {$culture->plante->nom} entre en phase de {$stade->nom_stade}. Les besoins en eau sont réajustés."
                ));
            }

            $meteo = $this->weatherService->getDailyWeather($this->villeCulture($culture));
            $calcul = $this->calculerBesoin($culture, $stade, $meteo);

            if ($calcul['pluie_mm'] >= 2 && $calcul['net'] <= 0) {
                $message = "Arrosage non nécessaire pour votre {$culture->plante->nom} : {$calcul['pluie_mm']} mm de pluie prévus couvrent les besoins.";
            } else {
                $litres = $this->formaterVolume($calcul['net']);
                $message = "Stade {$stade->nom_stade} · {$meteo['temperature']}°C à {$meteo['ville']}. Apportez environ {$litres} à votre {$culture->plante->nom}.";
            }

            $culture->user->notify(new CultureAlertNotification($culture, $message));

            return true;
        } catch (\Throwable $e) {
            Log::error('Erreur Calculateur: ' . $e->getMessage());
            return false;
        }
    }

    private function calculerBesoin(SuiviPlante $culture, $stade, array $meteo): array
    {
        $surfaceM2 = $this->surfaceEnM2($culture);
        $multiplicateurStade = $stade ? (float) $stade->multiplicateur_eau : 1.0;

        $efficience = self::EFFICIENCE_IRRIGATION[$culture->plante->typeIrrigation ?? 'aspersion'] ?? 0.75;
        $coefSol = self::COEF_SOL[$culture->natureSol ?? ''] ?? 1.0;
        $coefTemperature = $this->coefTemperature($meteo['temperature'] ?? null);

        $besoinParM2 = (float) ($culture->plante->besoin_eau_l_m2 ?? 3.0);
        $brut = $besoinParM2 * $multiplicateurStade * $surfaceM2 * $coefTemperature;
        $besoinReel = $brut / $efficience;

        $pluieMm = max($meteo['pluie_mm'] ?? 0, $meteo['pluie_prevue_mm'] ?? 0);
        $apportPluie = $pluieMm * $surfaceM2 * $coefSol;

        $net = max(0, round($besoinReel - $apportPluie));
        $economie = (int) round(min($apportPluie, $besoinReel));

        return [
            'brut'     => (int) round($besoinReel),
            'net'      => (int) $net,
            'economie' => $economie,
            'pluie_mm' => $pluieMm,
        ];
    }

    private function coefTemperature(?float $temperature): float
    {
        if ($temperature === null) {
            return 1.0;
        }

        return match (true) {
            $temperature >= 38 => 1.4,
            $temperature >= 32 => 1.25,
            $temperature >= 26 => 1.1,
            $temperature >= 15 => 1.0,
            $temperature >= 5  => 0.85,
            default            => 0.7,
        };
    }

    private function surfaceEnM2(SuiviPlante $culture): float
    {
        return match ($culture->unite_superficie ?? 'ha') {
            'ha'    => ($culture->superficie ?? 1) * 10000,
            'm2'    => ($culture->superficie ?? 1),
            'unite' => ($culture->superficie ?? 1) * 0.25,
            default => ($culture->superficie ?? 1) * 10000,
        };
    }

    private function stadeCourant(SuiviPlante $culture, int $joursEcoules)
    {
        return $culture->plante->stades()
            ->where('jour_debut', '<=', $joursEcoules)
            ->where('jour_fin', '>=', $joursEcoules)
            ->first();
    }

    private function joursEcoules(SuiviPlante $culture): int
    {
        return (int) Carbon::parse($culture->dateDebut)->startOfDay()->diffInDays(now()->startOfDay(), false);
    }

    private function libelleStade($stade, int $joursEcoules): string
    {
        if ($joursEcoules < 0) {
            return 'À venir';
        }

        return $stade ? $stade->nom_stade : 'Fin de cycle';
    }

    private function villeCulture(SuiviPlante $culture): string
    {
        return $culture->ville ?: 'Rabat';
    }

    private function formaterVolume(float $litres): string
    {
        return $litres >= 1000
            ? round($litres / 1000, 2) . ' m³'
            : round($litres) . ' L';
    }
}
