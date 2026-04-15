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
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('biblios');
    }
};
