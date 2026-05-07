<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;

class AgronomicAlertNotification extends Notification
{
    public function __construct(
        private string $message,
        private string $icon = 'warning',
        private string $actionUrl = '/suivi'
    ) {}

    public function via(object $notifiable): array { return ['database']; }

    public function toArray(object $notifiable): array
    {
        return [
            'type'       => 'agronomic',
            'icon'       => $this->icon,
            'message'    => $this->message,
            'action_url' => $this->actionUrl,
        ];
    }
}
