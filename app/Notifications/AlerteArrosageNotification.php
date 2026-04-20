<?php

namespace App\Notifications;

use App\Models\SuiviPlante;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AlerteArrosageNotification extends Notification
{
    use Queueable;

    public function __construct(public SuiviPlante $suivi) {}

    public function via(): array
    {
        return ['database'];
    }

    public function toArray(): array
    {
        return [
            'type'           => 'alerte_arrosage',
            'plante'         => $this->suivi->plante->nom,
            'quantiteLitres' => $this->suivi->BesoinsEau,
            'parcelle'       => $this->suivi->parcelle,
            'message'        => "Arrosez {$this->suivi->plante->nom} avec {$this->suivi->BesoinsEau}L aujourd'hui.",
        ];
    }
}
