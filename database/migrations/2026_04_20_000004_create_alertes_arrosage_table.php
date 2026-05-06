<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alertes_arrosage', function (Blueprint $table) {
            $table->id();
            $table->foreignId('suivi_plante_id')->constrained()->cascadeOnDelete();
            $table->date('datePrevue');
            $table->float('quantiteLitres');
            $table->boolean('envoyee')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('alertes_arrosage'); }
};
