<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('todo_lists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manager_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('ouvrier_id')->constrained('users')->cascadeOnDelete();
            $table->string('titre');
            $table->text('description')->nullable();
            $table->integer('nbreTaches')->default(0);
            $table->date('dateCreation');
            $table->date('dateEcheance')->nullable();
            $table->enum('statut', ['en_attente','en_cours','terminee','annulee'])->default('en_attente');
            $table->enum('priorite', ['basse','normale','haute','urgente'])->default('normale');
            $table->string('parcelle')->nullable();                   // parcelle concernée
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('todo_lists'); }
};
