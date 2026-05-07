<?php

namespace App\Notifications;

use App\Models\Tache;
use Illuminate\Notifications\Notification;

class TaskCompletedNotification extends Notification
{
    public function __construct(private Tache $tache) {}

    public function via(object $notifiable): array { return ['database']; }

    public function toArray(object $notifiable): array
    {
        return [
            'type'       => 'operational',
            'icon'       => 'check',
            'message'    => "Tâche terminée : {$this->tache->nomTache}",
            'action_url' => '/todo-lists',
        ];
    }
}
