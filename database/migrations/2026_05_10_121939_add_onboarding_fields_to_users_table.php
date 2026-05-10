<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('code_exploitation', 10)->nullable()->unique()->after('role');
            $table->enum('statut_emploi', ['aucun', 'en_attente', 'actif'])->default('aucun')->after('code_exploitation');
            $table->foreignId('gerant_id')->nullable()->constrained('users')->nullOnDelete()->after('statut_emploi');
        });

        // Générer un code unique pour chaque manager existant
        User::where('role', 'manager')->each(function (User $u) {
            $u->update(['code_exploitation' => strtoupper(Str::random(6))]);
        });

        // Les ouvriers existants passent directement en actif
        User::where('role', 'ouvrier')->update(['statut_emploi' => 'actif']);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['gerant_id']);
            $table->dropColumn(['code_exploitation', 'statut_emploi', 'gerant_id']);
        });
    }
};
