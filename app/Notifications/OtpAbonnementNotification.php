<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OtpAbonnementNotification extends Notification
{
    use Queueable;

    public function __construct(private string $code) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Agris — Code de validation de votre abonnement')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Vous finalisez la souscription à l\'abonnement Entreprise d\'Agris.')
            ->line('Votre code de validation à usage unique est :')
            ->line('**' . $this->code . '**')
            ->line('Ce code est valable pendant 10 minutes.')
            ->line('Si vous n\'êtes pas à l\'origine de cette demande, ignorez ce message.')
            ->salutation('L\'équipe Agris');
    }
}
