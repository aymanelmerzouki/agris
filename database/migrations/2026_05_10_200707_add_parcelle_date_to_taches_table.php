<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('taches', function (Blueprint $table) {
            $table->string('parcelle')->nullable()->after('dureeEstimeeMin');
            $table->date('dateEcheance')->nullable()->after('parcelle');
        });
    }

    public function down(): void
    {
        Schema::table('taches', function (Blueprint $table) {
            $table->dropColumn(['parcelle', 'dateEcheance']);
        });
    }
};
