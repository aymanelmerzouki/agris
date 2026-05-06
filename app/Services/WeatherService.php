<?php

namespace App\Services;

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

    public function getDailyWeather(string $city = 'Casablanca'): array
    {
        if (!$this->apiKey || $this->apiKey === 'ton_api_key_ici') {
            Log::warning("Clé API OpenWeather manquante. Météo simulée pour {$city}.");
            return $this->getMockedData();
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
                    'temperature' => $data['main']['temp'],
                    'humidite'    => $data['main']['humidity'],
                    'pluie_mm'    => $data['rain']['1h'] ?? 0,
                    'description' => $data['weather'][0]['description'] ?? 'Dégagé',
                ];
            }

            Log::error('Erreur API Météo: ' . $response->body());
            return $this->getMockedData();

        } catch (\Exception $e) {
            Log::error('Exception API Météo: ' . $e->getMessage());
            return $this->getMockedData();
        }
    }

    private function getMockedData(): array
    {
        return [
            'temperature' => rand(20, 35),
            'humidite'    => rand(40, 80),
            'pluie_mm'    => rand(0, 5),
            'description' => 'Météo simulée (Dev)',
        ];
    }
}
