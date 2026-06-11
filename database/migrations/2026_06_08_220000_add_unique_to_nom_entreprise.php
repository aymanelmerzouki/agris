<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Rend le nom d'entreprise unique. Les valeurs NULL (agriculteurs/ouvriers
     * sans entreprise) ne sont pas concernées par la contrainte d'unicité,
     * ce qui est le comportement standard des index uniques SQL.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unique('nomEntreprise');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['nomEntreprise']);
        });
    }
};
