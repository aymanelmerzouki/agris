<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GeolocationService
{
    private string $defaultCity = 'Rabat';

    public function resoudreVille(?string $ip): string
    {
        if (!$ip || $this->estIpLocale($ip)) {
            return $this->defaultCity;
        }

        return Cache::remember("geo_ville_{$ip}", 86400, function () use ($ip) {
            try {
                $reponse = Http::timeout(4)->get("http://ip-api.com/json/{$ip}", [
                    'fields' => 'status,city,country',
                    'lang'   => 'fr',
                ]);

                if ($reponse->successful() && ($reponse->json('status') === 'success')) {
                    return $reponse->json('city') ?: $this->defaultCity;
                }
            } catch (\Throwable $e) {
            }

            return $this->defaultCity;
        });
    }

    private function estIpLocale(string $ip): bool
    {
        return $ip === '127.0.0.1'
            || $ip === '::1'
            || str_starts_with($ip, '192.168.')
            || str_starts_with($ip, '10.')
            || str_starts_with($ip, '172.16.');
    }
}
