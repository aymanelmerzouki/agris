<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class BiblioFactory extends Factory
{
    public function definition(): array
    {
        return [
            'titre'           => fake()->sentence(4),
            'auteur'          => fake()->name(),
            'source'          => fake()->url(),
            'type'            => fake()->randomElement(['article', 'guide', 'video', 'fiche_technique']),
            'resume'          => fake()->paragraph(),
            'langue'          => 'fr',
            'datePublication' => fake()->date(),
            'estValide'       => true,
        ];
    }
}
