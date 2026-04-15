<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('biblio_plante', function (Blueprint $table) {
            $table->foreignId('biblio_id')->constrained()->cascadeOnDelete();
            $table->foreignId('plante_id')->constrained()->cascadeOnDelete();
            $table->primary(['biblio_id', 'plante_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('biblio_plante');
    }
};
