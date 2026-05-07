<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Plante;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('plantes', function (Blueprint $table) {
            $table->float('besoin_eau_l_m2')->default(3.0)->after('rendementMoyenKgHa');
        });

        $besoins = [
            'Tomate'                   => 5.0,
            'Blé dur'                  => 3.0,
            'Olivier'                  => 2.0,
            'Arganier'                 => 1.5,
            'Clémentine'               => 4.0,
            'Pomme de terre'           => 4.5,
            'Menthe poivrée'           => 4.0,
            'Cactus figuier de Barbarie' => 1.0,
            'Oignon'                   => 3.5,
            'Safran'                   => 2.5,
            'Pastèque'                 => 5.0,
            'Dattier'                  => 3.0,
        ];

        foreach ($besoins as $nom => $valeur) {
            Plante::where('nom', $nom)->update(['besoin_eau_l_m2' => $valeur]);
        }
    }

    public function down(): void
    {
        Schema::table('plantes', function (Blueprint $table) {
            $table->dropColumn('besoin_eau_l_m2');
        });
    }
};
