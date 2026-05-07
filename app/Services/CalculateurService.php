<?php

namespace App\Services;

use App\Models\SuiviPlante;
use App\Notifications\CultureAlertNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class CalculateurService
{
    public function __construct(protected WeatherService $weatherService) {}

    public function getLiveData(SuiviPlante $culture): array
    {
        $joursEcoules = \Carbon\Carbon::parse($culture->dateDebut)->diffInDays(now());
        $stade = $culture->plante->stades()
            ->where('jour_debut', '<=', $joursEcoules)
            ->where('jour_fin', '>=', $joursEcoules)
            ->first();

        $meteo = $this->weatherService->getDailyWeather('Rabat');
        $multiplicateur = $stade ? $stade->multiplicateur_eau : 1.0;

        // Surface en m²
        $surfaceM2 = match($culture->unite_superficie ?? 'ha') {
            'ha'    => ($culture->superficie ?? 1) * 10000,
            'm2'    => ($culture->superficie ?? 1),
            'unite' => ($culture->superficie ?? 1) * 0.25,
            default => ($culture->superficie ?? 1) * 10000,
        };

        // Efficience irrigation localisée (goutte-à-goutte)
        $efficienceIrrigation = 0.4;

        // Coefficient de rétention du sol
        $coefSol = match($culture->natureSol ?? '') {
            'sableux'           => 1.2,
            'calcaire', 'limoneux' => 1.0,
            'argileux', 'humifere' => 0.8,
            default             => 1.0,
        };

        // Algorithme de précision
        $besoinParM2 = ($culture->plante->besoin_eau_l_m2 ?? 3.0) * $multiplicateur;
        $besoinBrut     = $besoinParM2 * $surfaceM2;
        $besoinOptimise = $besoinBrut * $efficienceIrrigation * $coefSol;
        $pluieMm        = $meteo['pluie_mm'] ?? 0;
        $apportPluie    = $pluieMm * $surfaceM2;
        $besoinNet      = max(0, round($besoinOptimise - $apportPluie));

        return [
            'meteo'             => $meteo,
            'besoin_eau_live'   => $besoinNet,
            'besoin_brut'       => round($besoinBrut),
            'pluie_mm'          => $pluieMm,
            'stade_dynamique'   => $stade ? $stade->nom_stade : 'Fin de cycle',
            'progression_jours' => $joursEcoules,
            'plan_etapes'       => $culture->plante->stades()->orderBy('jour_debut')->get(['nom_stade', 'jour_debut', 'jour_fin']),
        ];
    }

    public function genererRecommandation(SuiviPlante $culture): bool
    {
        try {
            $joursEcoules = Carbon::parse($culture->dateDebut)->diffInDays(now());
            $stade = $culture->plante->stades()
                ->where('jour_debut', '<=', $joursEcoules)
                ->where('jour_fin', '>=', $joursEcoules)
                ->first();

            if (!$stade) return false;

            // Notification si premier jour d'un nouveau stade
            if ((int)$joursEcoules === (int)$stade->jour_debut) {
                $culture->user->notify(new CultureAlertNotification(
                    $culture,
                    "Votre parcelle de {$culture->plante->nom} vient d'entrer en phase de {$stade->nom_stade}. Les besoins en eau vont être ajustés."
                ));
            }

            $meteo = $this->weatherService->getDailyWeather($culture->parcelle ?? 'Casablanca');
            $base = match($culture->plante->typeIrrigation) {
                'goutte_a_goutte' => 2,
                'aspersion'       => 2.5,
                'submersion'      => 3,
                default           => 1.5,
            };
            $besoinTotal = round($base * $stade->multiplicateur_eau * ($culture->superficieHa ?? 1));
            $pluie = $meteo['pluie_mm'] ?? 0;

            if ($pluie > 2) {
                $message = "Arrosage suspendu — Pluie ({$pluie}mm) prévue. Inutile d'arroser votre {$culture->plante->nom}.";
            } else {
                $message = "Stade : {$stade->nom_stade}. Météo : {$meteo['temperature']}°C. Apportez ~{$besoinTotal}L à votre {$culture->plante->nom}.";
            }

            $culture->user->notify(new CultureAlertNotification($culture, $message));
            return true;

        } catch (\Exception $e) {
            Log::error('Erreur Calculateur: ' . $e->getMessage());
            return false;
        }
    }
}
