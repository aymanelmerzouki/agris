<?php

namespace Database\Factories;

use App\Models\Plante;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class StockFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'        => User::factory(),
            'plante_id'      => Plante::factory(),
            'produit'        => fake()->randomElement(['Tomates', 'Blé', 'Maïs', 'Engrais', 'Pesticide']),
            'quantite'       => fake()->randomFloat(1, 10, 1000),
            'unite'          => fake()->randomElement(['kg', 'tonne', 'caisse', 'litre', 'unite']),
            'seuilAlerte'    => fake()->randomFloat(1, 5, 50),
            'localisation'   => fake()->city(),
            'dateEntree'     => fake()->date(),
            'dateExpiration' => fake()->optional()->date(),
            'notes'          => fake()->optional()->sentence(),
        ];
    }
}
