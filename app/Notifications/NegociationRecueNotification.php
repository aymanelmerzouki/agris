<?php

namespace App\Notifications;

use App\Models\Negociation;
use Illuminate\Notifications\Notification;

class NegociationRecueNotification extends Notification
{
    public function __construct(private Negociation $negociation) {}

    public function via(object $notifiable): array { return ['database']; }

    public function toArray(object $notifiable): array
    {
        $offre = $this->negociation->offre;
        return [
            'type'       => 'operational',
            'icon'       => 'info',
            'message'    => "Nouvelle négociation reçue pour votre offre de {$offre->plante->nom} : {$this->negociation->prix_propose} DH / {$this->negociation->quantite_proposee} {$offre->unite}.",
            'action_url' => '/offres',
        ];
    }
}
