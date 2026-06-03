<?php
namespace Database\Seeders;
use App\Models\Abonnement;
use App\Models\Biblio;
use App\Models\Message;
use App\Models\Offre;
use App\Models\Plante;
use App\Models\SuiviPlante;
use App\Models\Tache;
use App\Models\TodoList;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(['email' => 'admin@agris.com'], [
            'name' => 'Admin', 'password' => Hash::make('password'), 'role' => 'admin',
        ]);
        $manager = User::firstOrCreate(['email' => 'manager@agris.com'], [
            'name' => 'Manager Test', 'password' => Hash::make('password'), 'role' => 'manager', 'nomEntreprise' => 'AgriCorp',
        ]);
        $agriculteur = User::firstOrCreate(['email' => 'test@example.com'], [
            'name' => 'Test User', 'password' => Hash::make('password'), 'role' => 'agriculteur',
        ]);
        $ouvrier = User::firstOrCreate(['email' => 'ouvrier@agris.com'], [
            'name' => 'Ouvrier Test', 'password' => Hash::make('password'), 'role' => 'ouvrier',
        ]);
        $this->call(PlanteSeeder::class);
        $plantes = Plante::all();
        Biblio::factory(10)->create();
        SuiviPlante::factory(3)->create(['user_id' => $agriculteur->id, 'plante_id' => $plantes->random()->id]);
        Offre::factory(3)->create(['user_id' => $agriculteur->id, 'plante_id' => $plantes->random()->id]);
        $todoList = TodoList::factory()->create([
            'manager_id' => $manager->id,
            'ouvrier_id' => $ouvrier->id,
        ]);
        Tache::factory(4)->create(['todo_list_id' => $todoList->id]);
        $todoList->update(['nbreTaches' => 4]);
        Message::factory(5)->create(['expediteur_id' => $manager->id, 'destinataire_id' => $ouvrier->id]);
        Message::factory(3)->create(['expediteur_id' => $ouvrier->id, 'destinataire_id' => $manager->id]);
        Abonnement::firstOrCreate(['user_id' => $manager->id], ['plan' => 'pro', 'statut' => 'actif', 'dateDebut' => now(), 'prix' => 299]);
        Abonnement::firstOrCreate(['user_id' => $agriculteur->id], ['plan' => 'basic', 'statut' => 'actif', 'dateDebut' => now(), 'prix' => 99]);
    }
}
