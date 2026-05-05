<?php

namespace App\Services;

use App\Models\SuiviPlante;
use App\Notifications\CultureAlertNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class CalculateurService
{
    public function __construct(protected WeatherService $weatherService) {}

    public function genererRecommandation(SuiviPlante $culture): bool
    {
        try {
            $joursEcoules = Carbon::parse($culture->dateDebut)->diffInDays(now());
            $stade = $culture->plante->stades()
                ->where('jour_debut', '<=', $joursEcoules)
                ->where('jour_fin', '>=', $joursEcoules)
                ->first();

            if (!$stade) return false;

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
