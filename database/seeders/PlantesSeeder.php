<?php

namespace Database\Seeders;

use App\Models\Plante;
use Illuminate\Database\Seeder;

class PlantesSeeder extends Seeder
{
    public function run(): void
    {
        $tomate = Plante::where('nom', 'Tomate')->first();
        if ($tomate) {
            $tomate->stades()->createMany([
                ['nom_stade' => 'Semis et Levée',               'jour_debut' => 1,  'jour_fin' => 15,  'multiplicateur_eau' => 0.8],
                ['nom_stade' => 'Croissance végétative',        'jour_debut' => 16, 'jour_fin' => 50,  'multiplicateur_eau' => 1.2],
                ['nom_stade' => 'Floraison et Fructification',  'jour_debut' => 51, 'jour_fin' => 120, 'multiplicateur_eau' => 1.8],
            ]);
        }

        $oignon = Plante::where('nom', 'Oignon')->first();
        if ($oignon) {
            $oignon->stades()->createMany([
                ['nom_stade' => 'Semis',               'jour_debut' => 1,  'jour_fin' => 20, 'multiplicateur_eau' => 1.0],
                ['nom_stade' => 'Formation du bulbe',  'jour_debut' => 21, 'jour_fin' => 70, 'multiplicateur_eau' => 1.5],
                ['nom_stade' => 'Maturation',          'jour_debut' => 71, 'jour_fin' => 90, 'multiplicateur_eau' => 0.2],
            ]);
        }
    }
}
