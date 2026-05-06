<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('abonnements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('plan', ['gratuit', 'basic', 'pro', 'entreprise'])->default('gratuit');
            $table->enum('statut', ['actif', 'expire', 'suspendu'])->default('actif');
            $table->date('dateDebut');
            $table->date('dateFin')->nullable();
            $table->float('prix')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('abonnements'); }
};
