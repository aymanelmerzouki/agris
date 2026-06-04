<?php

namespace App\Notifications;

use App\Models\Tache;
use App\Models\User;
use Illuminate\Notifications\Notification;

class TaskStatusChangedNotification extends Notification
{
    private const LABELS = ['en_attente' => 'En attente', 'en_cours' => 'En cours', 'termine' => 'Terminé'];

    public function __construct(private Tache $tache, private User $ouvrier, private string $statut) {}

    public function via(object $notifiable): array { return ['database']; }

    public function toArray(object $notifiable): array
    {
        $etat = self::LABELS[$this->statut] ?? $this->statut;
        return [
            'type'       => 'operational',
            'icon'       => $this->statut === 'termine' ? 'check' : 'info',
            'message'    => "{$this->ouvrier->name} a changé l'état de « {$this->tache->nomTache} » en « {$etat} ».",
            'action_url' => '/todo-lists',
        ];
    }
}
