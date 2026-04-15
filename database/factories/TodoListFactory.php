<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TodoListFactory extends Factory
{
    public function definition(): array
    {
        return [
            'manager_id'    => User::factory(),
            'ouvrier_id'    => User::factory(),
            'titre'         => fake()->sentence(3),
            'description'   => fake()->optional()->sentence(),
            'nbreTaches'    => 0,
            'dateCreation'  => fake()->date(),
            'dateEcheance'  => fake()->optional()->date(),
            'statut'        => fake()->randomElement(['en_attente', 'en_cours', 'terminee', 'annulee']),
            'priorite'      => fake()->randomElement(['basse', 'normale', 'haute', 'urgente']),
            'parcelle'      => fake()->optional()->bothify('P-##'),
        ];
    }
}
