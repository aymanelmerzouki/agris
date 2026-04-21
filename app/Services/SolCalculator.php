<?php

namespace App\Services;

class SolCalculator
{
    // pH approximatif par nature de sol
    const PH_SOL = [
        'argileux'  => 7.2,
        'sableux'   => 6.0,
        'limoneux'  => 6.5,
        'calcaire'  => 8.0,
        'humifere'  => 5.5,
    ];

    // Facteur de rétention d'eau (plus élevé = sol retient mieux = moins d'arrosage)
    const RETENTION_EAU = [
        'argileux'  => 0.7,  // retient bien → moins d'eau nécessaire
        'sableux'   => 1.4,  // draine vite → plus d'eau nécessaire
        'limoneux'  => 1.0,  // référence
        'calcaire'  => 1.1,
        'humifere'  => 0.8,
    ];

    // Besoins de base en L/jour/ha selon type d'irrigation
    const BASE_EAU_HA = [
        'goutte_a_goutte' => 3000,
        'aspersion'       => 5000,
        'submersion'      => 8000,
        'pluviale'        => 1000,
    ];

    public static function calculer(string $natureSol, float $superficieHa, ?string $typeIrrigation): array
    {
        $ph = self::PH_SOL[$natureSol] ?? 6.5;
        $retention = self::RETENTION_EAU[$natureSol] ?? 1.0;
        $baseHa = self::BASE_EAU_HA[$typeIrrigation ?? 'aspersion'];

        // Besoins eau = base * superficie * facteur rétention sol
        $besoinsEau = round($baseHa * $superficieHa * $retention);

        return [
            'phSol'      => $ph,
            'BesoinsEau' => max($besoinsEau, 100), // minimum 100L/jour
        ];
    }
}
