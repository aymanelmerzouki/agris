<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\OtpAbonnementNotification;
use Illuminate\Support\Facades\Cache;

class OtpService
{
    private const TTL_SECONDES = 600; // 10 minutes

    private function cle(int $userId): string
    {
        return "otp_abonnement_{$userId}";
    }

    /**
     * Génère un OTP à 6 chiffres, le stocke en cache et l'envoie par email.
     */
    public function envoyer(User $user): void
    {
        $code = (string) random_int(100000, 999999);

        Cache::put($this->cle($user->id), $code, self::TTL_SECONDES);

        $user->notify(new OtpAbonnementNotification($code));
    }

    /**
     * Vérifie le code saisi. Supprime l'OTP en cas de succès.
     */
    public function verifier(User $user, string $code): bool
    {
        $attendu = Cache::get($this->cle($user->id));

        if ($attendu !== null && hash_equals($attendu, $code)) {
            Cache::forget($this->cle($user->id));
            return true;
        }

        return false;
    }
}
