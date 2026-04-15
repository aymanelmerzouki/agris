<?php

namespace Database\Factories;

use App\Models\TodoList;
use Illuminate\Database\Eloquent\Factories\Factory;

class TacheFactory extends Factory
{
    public function definition(): array
    {
        return [
            'todo_list_id'      => TodoList::factory(),
            'nomTache'          => fake()->sentence(3),
            'description'       => fake()->optional()->sentence(),
            'priorite'          => fake()->randomElement(['basse', 'normale', 'haute', 'urgente']),
            'categorie'         => fake()->randomElement(['irrigation', 'recolte', 'traitement', 'semis', 'entretien', 'autre']),
            'estFaite'          => false,
            'completeeAt'       => null,
            'dureeEstimeeMin'   => fake()->optional()->numberBetween(15, 480),
        ];
    }
}
