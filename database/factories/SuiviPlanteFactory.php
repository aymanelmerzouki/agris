<?php

namespace Database\Factories;

use App\Models\Plante;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SuiviPlanteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'          => User::factory(),
            'plante_id'        => Plante::factory(),
            'dateDebut'        => fake()->date(),
            'DateAgriculte'    => fake()->optional()->date(),
            'BesoinsEau'       => fake()->randomFloat(1, 1, 20),
            'superficieHa'     => fake()->randomFloat(2, 0.1, 50),
            'parcelle'         => 'P-' . fake()->numberBetween(1, 100),
            'stadeVegetatif'   => fake()->randomElement(['germination', 'croissance', 'floraison', 'fructification', 'recolte']),
            'tauxHumidite'     => fake()->randomFloat(1, 20, 80),
            'phSol'            => fake()->randomFloat(1, 5, 8),
            'notesAgriculteur' => fake()->optional()->sentence(),
            'statut'           => fake()->randomElement(['en_cours', 'recolte', 'abandonne']),
        ];
    }
}
