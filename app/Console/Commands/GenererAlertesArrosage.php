<?php

namespace App\Console\Commands;

use App\Models\SuiviPlante;
use App\Services\CalculateurService;
use Illuminate\Console\Command;

class GenererAlertesArrosage extends Command
{
    protected $signature = 'agris:generer-alertes';
    protected $description = 'Génère les recommandations d\'arrosage quotidiennes basées sur la météo et les stades végétatifs';

    public function handle(CalculateurService $calculateur): void
    {
        $cultures = SuiviPlante::where('statut', 'en_cours')->with(['plante.stades', 'user'])->get();
        $count = 0;

        foreach ($cultures as $culture) {
            if ($calculateur->genererRecommandation($culture)) $count++;
        }

        $this->info("Terminé. {$count} alertes générées.");
    }
}
