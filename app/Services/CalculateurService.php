<?php

namespace App\Services;

use App\Models\Plante;

class CalculateurService
{
    private const COEFFICIENTS_SOL = [
        'sableux'  => 1.2,
        'argileux' => 0.9,
        'limoneux' => 1.0,
        'calcaire' => 1.1,
        'humifere' => 0.8,
    ];

    private const PH_SOL = [
        'calcaire' => 7.5,
        'humifere' => 6.5,
        'argileux' => 7.0,
        'limoneux' => 6.5,
        'sableux'  => 6.0,
    ];

    private const BASE_EAU_HA = 1500; // L/ha par défaut

    public function calculerBesoins(int $planteId, string $typeSol, float $superficie): array
    {
        $plante = Plante::find($planteId);
        $baseEau = $plante?->besoin_eau_base ?? self::BASE_EAU_HA;

        $coefficient = self::COEFFICIENTS_SOL[$typeSol] ?? 1.0;
        $besoinEauCalcule = round($baseEau * $coefficient * $superficie);

        return [
            'besoin_eau_calcule' => max($besoinEauCalcule, 100),
            'ph_estime'          => self::PH_SOL[$typeSol] ?? 6.5,
        ];
    }
}
