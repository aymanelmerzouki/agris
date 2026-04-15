<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('suivi_plantes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('plante_id')->constrained()->cascadeOnDelete();
            $table->date('dateDebut');
            $table->date('DateAgriculte')->nullable();
            $table->float('BesoinsEau');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('suivi_plantes');
    }
};
