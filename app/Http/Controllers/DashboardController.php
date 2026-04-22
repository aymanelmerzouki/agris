<?php

namespace App\Http\Controllers;

use App\Models\Offre;
use App\Models\Plante;
use App\Models\SuiviPlante;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Stat cards
        $stats = [
            'cultures_actives'  => SuiviPlante::where('user_id', $user->id)->where('statut', 'en_cours')->count(),
            'offres_disponibles'=> Offre::where('statut', 'disponible')->count(),
            'total_plantes'     => Plante::count(),
        ];

        // Répartition des sols (camembert)
        $repartitionSols = SuiviPlante::where('user_id', $user->id)
            ->whereNotNull('natureSol')
            ->select('natureSol', DB::raw('count(*) as total'))
            ->groupBy('natureSol')
            ->pluck('total', 'natureSol');

        // Évolution cultures par mois sur 6 mois (courbe)
        $evolutionCultures = collect(range(5, 0))->map(function ($i) use ($user) {
            $date = now()->subMonths($i);
            return [
                'mois'  => $date->translatedFormat('M Y'),
                'total' => SuiviPlante::where('user_id', $user->id)
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
            ];
        });

        return response()->json([
            'stats'              => $stats,
            'repartition_sols'   => $repartitionSols,
            'evolution_cultures' => $evolutionCultures,
        ]);
    }
}
