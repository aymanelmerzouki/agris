<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PlanteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nom'               => fake()->randomElement(['Tomate', 'Blé', 'Maïs', 'Pomme de terre', 'Oignon', 'Carotte', 'Laitue', 'Poivron']),
            'espece'            => fake()->word(),
            'famille'           => fake()->randomElement(['Solanacées', 'Graminées', 'Cucurbitacées', 'Légumineuses']),
            'origine'           => fake()->country(),
            'description'       => fake()->sentence(),
            'conditionsCulture' => fake()->sentence(),
            'temperatureMin'    => fake()->randomFloat(1, -5, 10),
            'temperatureMax'    => fake()->randomFloat(1, 20, 40),
            'saisonPlantation'  => fake()->randomElement(['printemps', 'été', 'automne', 'hiver']),
            'dureePousseeJours' => fake()->numberBetween(30, 180),
            'rendementMoyenKgHa'=> fake()->randomFloat(2, 500, 50000),
            'typeIrrigation'    => fake()->randomElement(['goutte_a_goutte', 'aspersion', 'submersion', 'pluviale']),
            'estBio'            => fake()->boolean(),
            'imageUrl'          => null,
        ];
    }
}
