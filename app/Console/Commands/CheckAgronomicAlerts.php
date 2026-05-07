<?php

namespace App\Console\Commands;

use App\Models\SuiviPlante;
use App\Notifications\AgronomicAlertNotification;
use App\Services\WeatherService;
use Illuminate\Console\Command;

class CheckAgronomicAlerts extends Command
{
    protected $signature = 'agris:check-agronomic-alerts';
    protected $description = 'Vérifie les alertes agronomiques (météo, irrigation) pour les cultures actives';

    public function handle(WeatherService $weather): void
    {
        $cultures = SuiviPlante::where('statut', 'en_cours')
            ->with(['user', 'plante'])
            ->whereHas('user', fn($q) => $q->whereIn('role', ['agriculteur', 'manager']))
            ->get();

        $meteo = $weather->getDailyWeather('Rabat');
        $temp  = $meteo['temperature'] ?? null;
        $pluie = $meteo['pluie_mm'] ?? 0;
        $count = 0;

        foreach ($cultures as $culture) {
            if ($temp !== null && $temp < 2) {
                $culture->user->notify(new AgronomicAlertNotification(
                    "Alerte gel : {$temp}°C prévu. Protégez votre {$culture->plante->nom}.",
                    'warning'
                ));
                $count++;
            }

            if ($pluie > 20) {
                $culture->user->notify(new AgronomicAlertNotification(
                    "Pluies intenses ({$pluie}mm) prévues. Vérifiez le drainage de votre {$culture->plante->nom}.",
                    'warning'
                ));
                $count++;
            } elseif ($pluie > 0) {
                $culture->user->notify(new AgronomicAlertNotification(
                    "Pluie prévue ({$pluie}mm) : économie d'eau possible sur votre {$culture->plante->nom}.",
                    'info'
                ));
                $count++;
            }
        }

        $this->info("Terminé. {$count} alertes agronomiques générées.");
    }
}
