<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plantes', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('espece');
            $table->string('famille')->nullable();                    // ex: Solanacées, Graminées
            $table->string('origine')->nullable();                    // pays/région d'origine
            $table->text('description')->nullable();
            $table->text('conditionsCulture')->nullable();
            $table->float('temperatureMin')->nullable();              // °C
            $table->float('temperatureMax')->nullable();              // °C
            $table->enum('saisonPlantation', ['printemps','été','automne','hiver'])->nullable();
            $table->integer('dureePousseeJours')->nullable();         // jours avant récolte
            $table->float('rendementMoyenKgHa')->nullable();         // kg/hectare
            $table->enum('typeIrrigation', ['goutte_a_goutte','aspersion','submersion','pluviale'])->nullable();
            $table->boolean('estBio')->default(false);
            $table->string('imageUrl')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('plantes'); }
};
