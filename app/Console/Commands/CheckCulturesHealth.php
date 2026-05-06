<?php

namespace App\Console\Commands;

use App\Models\SuiviPlante;
use App\Notifications\CultureAlertNotification;
use Illuminate\Console\Command;

class CheckCulturesHealth extends Command
{
    protected $signature = 'app:check-cultures';
    protected $description = 'Audit quotidien des cultures actives et envoi d\'alertes si paramètres critiques';

    public function handle(): void
    {
        SuiviPlante::where('statut', 'en_cours')
            ->with('user')
            ->get()
            ->each(function (SuiviPlante $culture) {
                if ($culture->besoin_eau_calcule > 10000 || ($culture->ph_estime !== null && ($culture->ph_estime < 4.5 || $culture->ph_estime > 9.0))) {
                    $culture->user->notify(new CultureAlertNotification($culture, 'Attention: paramètre critique détecté.'));
                }
            });

        $this->info('Audit des cultures terminé.');
    }
}
