<?php
namespace App\Jobs;
use App\Models\SuiviPlante;
use App\Services\CalculateurService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
class EnvoyerAlertesArrosage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public function handle(CalculateurService $calculateur): void
    {
        SuiviPlante::with('user', 'plante.stades')
            ->where('statut', 'en_cours')
            ->chunk(100, function ($suivis) use ($calculateur) {
                foreach ($suivis as $suivi) {
                    $calculateur->genererRecommandation($suivi);
                }
            });
    }
}
