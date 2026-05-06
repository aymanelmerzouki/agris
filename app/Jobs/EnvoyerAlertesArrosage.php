<?php
namespace App\Jobs;
use App\Models\AlerteArrosage;
use App\Models\SuiviPlante;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
class EnvoyerAlertesArrosage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public function handle(): void
    {
        $today = now()->toDateString();
        SuiviPlante::with('user', 'plante')
            ->where('statut', 'en_cours')
            ->chunk(100, function ($suivis) use ($today) {
                foreach ($suivis as $suivi) {
                    $existe = AlerteArrosage::where('suivi_plante_id', $suivi->id)
                        ->where('datePrevue', $today)->exists();
                    if (!$existe) {
                        AlerteArrosage::create([
                            'suivi_plante_id' => $suivi->id,
                            'datePrevue'      => $today,
                            'quantiteLitres'  => $suivi->BesoinsEau,
                            'envoyee'         => true,
                        ]);
                        $suivi->user->notify(new \App\Notifications\AlerteArrosageNotification($suivi));
                    }
                }
            });
    }
}
