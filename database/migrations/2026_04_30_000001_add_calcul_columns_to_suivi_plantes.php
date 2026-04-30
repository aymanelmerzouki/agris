<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('suivi_plantes', function (Blueprint $table) {
            $table->float('besoin_eau_calcule')->nullable()->after('BesoinsEau');
            $table->float('ph_estime')->nullable()->after('phSol');
        });
    }

    public function down(): void
    {
        Schema::table('suivi_plantes', function (Blueprint $table) {
            $table->dropColumn(['besoin_eau_calcule', 'ph_estime']);
        });
    }
};
