<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('offres', function (Blueprint $table) {
            $table->foreignId('acheteur_id')->nullable()->after('user_id')
                  ->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('offres', function (Blueprint $table) {
            $table->dropForeign(['acheteur_id']);
            $table->dropColumn('acheteur_id');
        });
    }
};
