<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('offres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('plante_id')->nullable()->constrained()->nullOnDelete();
            $table->float('prix');                                    // prix/unité
            $table->float('quantite');
            $table->enum('unite', ['kg','tonne','caisse','litre','unite'])->default('kg');
            $table->enum('statut', ['disponible','vendu','expire','en_negociation'])->default('disponible');
            $table->date('dateCreation');
            $table->date('dateExpiration')->nullable();
            $table->string('localisation')->nullable();               // ville/région
            $table->text('description')->nullable();
            $table->boolean('livraison')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('offres'); }
};
