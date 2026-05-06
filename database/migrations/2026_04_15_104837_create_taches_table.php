<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('taches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('todo_list_id')->constrained()->cascadeOnDelete();
            $table->string('nomTache');
            $table->text('description')->nullable();
            $table->enum('priorite', ['basse','normale','haute','urgente'])->default('normale');
            $table->enum('categorie', ['irrigation','recolte','traitement','semis','entretien','autre'])->default('autre');
            $table->boolean('estFaite')->default(false);
            $table->dateTime('completeeAt')->nullable();              // horodatage complétion
            $table->integer('dureeEstimeeMin')->nullable();           // durée estimée en minutes
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('taches'); }
};
