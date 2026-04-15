<?php

namespace App\Http\Controllers;

use App\Models\Abonnement;
use Illuminate\Http\Request;

class AbonnementController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->abonnement;
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'plan'       => 'required|in:gratuit,basic,pro,entreprise',
            'dateDebut'  => 'required|date',
            'dateFin'    => 'nullable|date|after:dateDebut',
            'prix'       => 'required|numeric|min:0',
        ]);

        $abonnement = Abonnement::updateOrCreate(
            ['user_id' => $request->user()->id],
            [...$data, 'statut' => 'actif']
        );

        return response()->json($abonnement, 201);
    }
}
