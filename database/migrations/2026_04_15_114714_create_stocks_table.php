<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('plante_id')->nullable()->constrained()->nullOnDelete();
            $table->string('produit');
            $table->float('quantite');
            $table->enum('unite', ['kg', 'tonne', 'caisse', 'litre', 'unite'])->default('kg');
            $table->float('seuilAlerte')->nullable();   // quantité minimale avant alerte
            $table->string('localisation')->nullable(); // entrepôt/parcelle
            $table->date('dateEntree');
            $table->date('dateExpiration')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('stocks'); }
};
