<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plante_favoris', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('plante_id')->constrained()->cascadeOnDelete();
            $table->unique(['user_id', 'plante_id']);
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('plante_favoris'); }
};
