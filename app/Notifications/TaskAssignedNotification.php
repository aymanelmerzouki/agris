<?php

namespace App\Notifications;

use App\Models\Tache;
use Illuminate\Notifications\Notification;

class TaskAssignedNotification extends Notification
{
    public function __construct(private Tache $tache) {}

    public function via(object $notifiable): array { return ['database']; }

    public function toArray(object $notifiable): array
    {
        return [
            'type'       => 'operational',
            'icon'       => 'info',
            'message'    => "Nouvelle tâche assignée : {$this->tache->nomTache}",
            'action_url' => '/todo-lists',
        ];
    }
}
