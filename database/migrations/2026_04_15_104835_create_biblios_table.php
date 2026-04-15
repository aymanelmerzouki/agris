<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('biblios', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->string('auteur')->nullable();
            $table->string('source')->nullable();                     // URL ou référence
            $table->enum('type', ['article','guide','video','fiche_technique'])->default('article');
            $table->text('resume')->nullable();
            $table->string('langue')->default('fr');
            $table->date('datePublication')->nullable();
            $table->boolean('estValide')->default(true);              // validé par un expert
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('biblios'); }
};
