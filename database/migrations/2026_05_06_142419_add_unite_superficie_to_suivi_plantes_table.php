<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('suivi_plantes', function (Blueprint $table) {
            $table->renameColumn('superficieHa', 'superficie');
            $table->string('unite_superficie')->default('ha')->after('superficie');
        });
    }

    public function down(): void
    {
        Schema::table('suivi_plantes', function (Blueprint $table) {
            $table->renameColumn('superficie', 'superficieHa');
            $table->dropColumn('unite_superficie');
        });
    }
};
