<?php

namespace Database\Seeders;

use App\Models\Biblio;
use App\Models\Offre;
use App\Models\Plante;
use App\Models\SuiviPlante;
use App\Models\Tache;
use App\Models\TodoList;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Utilisateur de test
        $admin = User::firstOrCreate(
            ['email' => 'test@example.com'],
            User::factory()->make(['name' => 'Test User', 'email' => 'test@example.com'])->toArray()
        );

        // 4 autres utilisateurs
        $users = User::factory(4)->create();
        $allUsers = $users->prepend($admin);

        // 10 plantes
        $plantes = Plante::factory(10)->create();

        // 10 ressources bibliographiques
        Biblio::factory(10)->create();

        // Suivis de plantes (2 par utilisateur)
        $allUsers->each(function ($user) use ($plantes) {
            SuiviPlante::factory(2)->create([
                'user_id'   => $user->id,
                'plante_id' => $plantes->random()->id,
            ]);
        });

        // Offres (3 par utilisateur)
        $allUsers->each(function ($user) use ($plantes) {
            Offre::factory(3)->create([
                'user_id'   => $user->id,
                'plante_id' => $plantes->random()->id,
            ]);
        });

        // TodoLists avec tâches
        $allUsers->each(function ($user) use ($allUsers) {
            $todoList = TodoList::factory()->create([
                'manager_id' => $user->id,
                'ouvrier_id' => $allUsers->where('id', '!=', $user->id)->random()->id,
            ]);

            Tache::factory(3)->create(['todo_list_id' => $todoList->id]);
            $todoList->update(['nbreTaches' => 3]);
        });
    }
}
