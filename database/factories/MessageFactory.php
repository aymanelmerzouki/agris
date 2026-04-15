<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class MessageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'expediteur_id'   => User::factory(),
            'destinataire_id' => User::factory(),
            'contenu'         => fake()->sentence(),
            'lu'              => fake()->boolean(),
            'luAt'            => null,
        ];
    }
}
