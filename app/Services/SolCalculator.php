<?php
namespace App\Services;
class SolCalculator
{
    const PH_SOL = [
        'argileux'  => 7.2,
        'sableux'   => 6.0,
        'limoneux'  => 6.5,
        'calcaire'  => 8.0,
        'humifere'  => 5.5,
    ];
    const RETENTION_EAU = [
        'argileux'  => 0.7,
        'sableux'   => 1.4,
        'limoneux'  => 1.0,
        'calcaire'  => 1.1,
        'humifere'  => 0.8,
    ];
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
        $besoinsEau = round($baseHa * $superficieHa * $retention);
        return [
            'phSol'      => $ph,
            'BesoinsEau' => max($besoinsEau, 100),
        ];
    }
}
