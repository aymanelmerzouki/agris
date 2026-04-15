<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AbonnementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'   => User::factory(),
            'plan'      => fake()->randomElement(['gratuit', 'basic', 'pro', 'entreprise']),
            'statut'    => 'actif',
            'dateDebut' => fake()->date(),
            'dateFin'   => fake()->optional()->date(),
            'prix'      => fake()->randomElement([0, 99, 299, 599]),
        ];
    }
}
