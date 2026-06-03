<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('suivi_plantes', function (Blueprint $table) {
            $table->string('ville')->nullable()->after('parcelle');
        });
    }

    public function down(): void
    {
        Schema::table('suivi_plantes', function (Blueprint $table) {
            $table->dropColumn('ville');
        });
    }
};
