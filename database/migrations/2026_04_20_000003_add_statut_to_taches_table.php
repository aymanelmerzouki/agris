<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('taches', function (Blueprint $table) {
            $table->enum('statut', ['en_attente', 'en_cours', 'termine'])->default('en_attente')->after('estFaite');
        });
    }

    public function down(): void
    {
        Schema::table('taches', function (Blueprint $table) {
            $table->dropColumn('statut');
        });
    }
};
