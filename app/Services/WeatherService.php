<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class WeatherService
{
    private string $apiKey;
    private string $weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
    private string $forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    public function __construct()
    {
        $this->apiKey = config('services.openweather.key', '');
    }

    public function getDailyWeather(string $city = 'Rabat'): array
    {
        return Cache::remember("weather_{$city}", 3600, function () use ($city) {
            if (!$this->cleValide()) {
                return $this->indisponible($city);
            }

            try {
                $actuel = Http::timeout(5)->get($this->weatherUrl, [
                    'q'     => $city . ',MA',
                    'appid' => $this->apiKey,
                    'units' => 'metric',
                    'lang'  => 'fr',
                ]);

                if (!$actuel->successful()) {
                    return $this->indisponible($city);
                }

                $data = $actuel->json();

                return [
                    'ville'           => $city,
                    'temperature'     => round($data['main']['temp'], 1),
                    'humidite'        => $data['main']['humidity'],
                    'pluie_mm'        => $data['rain']['1h'] ?? 0,
                    'pluie_prevue_mm' => $this->pluiePrevue24h($city),
                    'description'     => $data['weather'][0]['description'] ?? 'Dégagé',
                    'source'          => 'api',
                ];
            } catch (\Throwable $e) {
                return $this->indisponible($city);
            }
        });
    }

    private function pluiePrevue24h(string $city): float
    {
        try {
            $forecast = Http::timeout(5)->get($this->forecastUrl, [
                'q'     => $city . ',MA',
                'appid' => $this->apiKey,
                'units' => 'metric',
                'cnt'   => 8,
            ]);

            if (!$forecast->successful()) {
                return 0;
            }

            $total = 0;
            foreach ($forecast->json('list', []) as $creneau) {
                $total += $creneau['rain']['3h'] ?? 0;
            }

            return round($total, 1);
        } catch (\Throwable $e) {
            return 0;
        }
    }

    private function cleValide(): bool
    {
        return $this->apiKey && $this->apiKey !== 'ton_api_key_ici';
    }

    private function indisponible(string $city): array
    {
        return [
            'ville'           => $city,
            'temperature'     => null,
            'humidite'        => null,
            'pluie_mm'        => 0,
            'pluie_prevue_mm' => 0,
            'description'     => 'Données météo indisponibles',
            'source'          => 'unavailable',
        ];
    }
}
