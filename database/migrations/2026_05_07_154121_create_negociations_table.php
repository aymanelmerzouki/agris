<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('negociations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('offre_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('prix_propose', 10, 2);
            $table->decimal('quantite_proposee', 10, 2);
            $table->text('message')->nullable();
            $table->enum('statut', ['en_attente', 'acceptee', 'refusee'])->default('en_attente');
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('negociations'); }
};
