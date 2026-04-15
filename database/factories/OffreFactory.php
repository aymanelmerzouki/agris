<?php

namespace Database\Factories;

use App\Models\Plante;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OffreFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'        => User::factory(),
            'plante_id'      => Plante::factory(),
            'prix'           => fake()->randomFloat(2, 1, 500),
            'quantite'       => fake()->randomFloat(1, 10, 1000),
            'unite'          => fake()->randomElement(['kg', 'tonne', 'caisse', 'litre', 'unite']),
            'statut'         => fake()->randomElement(['disponible', 'vendu', 'expire', 'en_negociation']),
            'dateCreation'   => fake()->date(),
            'dateExpiration' => fake()->optional()->date(),
            'localisation'   => fake()->city(),
            'description'    => fake()->optional()->sentence(),
            'livraison'      => fake()->boolean(),
        ];
    }
}
