<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WeatherService
{
    private string $apiKey;
    private string $baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

    public function __construct()
    {
        $this->apiKey = config('services.openweather.key', '');
    }

    public function getDailyWeather(string $city = 'Rabat'): array
    {
        // Cache 1h par ville pour éviter les appels répétés
        return Cache::remember("weather_{$city}", 3600, function () use ($city) {
            if (!$this->apiKey || $this->apiKey === 'ton_api_key_ici') {
                Log::warning("Clé API OpenWeather manquante. Données météo indisponibles pour {$city}.");
                return $this->getUnavailableData($city);
            }

            try {
                $response = Http::timeout(5)->get($this->baseUrl, [
                    'q'     => $city . ',MA',
                    'appid' => $this->apiKey,
                    'units' => 'metric',
                    'lang'  => 'fr',
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    return [
                        'temperature' => round($data['main']['temp'], 1),
                        'humidite'    => $data['main']['humidity'],
                        'pluie_mm'    => $data['rain']['1h'] ?? 0,
                        'description' => $data['weather'][0]['description'] ?? 'Dégagé',
                        'source'      => 'api',
                    ];
                }

                Log::error('Erreur API Météo: ' . $response->body());
                return $this->getUnavailableData($city);

            } catch (\Exception $e) {
                Log::error('Exception API Météo: ' . $e->getMessage());
                return $this->getUnavailableData($city);
            }
        });
    }

    private function getUnavailableData(string $city): array
    {
        return [
            'temperature' => null,
            'humidite'    => null,
            'pluie_mm'    => 0,
            'description' => 'Données météo indisponibles',
            'source'      => 'unavailable',
        ];
    }
}
