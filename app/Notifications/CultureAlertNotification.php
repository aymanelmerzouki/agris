<?php

namespace App\Notifications;

use App\Models\SuiviPlante;
use Illuminate\Notifications\Notification;

class CultureAlertNotification extends Notification
{
    public function __construct(
        private SuiviPlante $culture,
        private string $messageAlerte
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'culture_id' => $this->culture->id,
            'message'    => $this->messageAlerte,
            'type'       => 'warning',
        ];
    }
}
