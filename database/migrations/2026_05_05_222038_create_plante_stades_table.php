<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plante_stades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plante_id')->constrained('plantes')->cascadeOnDelete();
            $table->string('nom_stade');
            $table->integer('jour_debut');
            $table->integer('jour_fin');
            $table->float('multiplicateur_eau')->default(1.0);
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('plante_stades'); }
};
