<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ventes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('offre_id')->constrained()->cascadeOnDelete();
            $table->foreignId('acheteur_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('vendeur_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('plante_id')->nullable()->constrained()->nullOnDelete();
            $table->float('quantite');
            $table->string('unite');
            $table->float('prix_total');
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('ventes'); }
};
