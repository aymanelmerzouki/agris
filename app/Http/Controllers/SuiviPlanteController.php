<?php

namespace App\Http\Controllers;

use App\Models\Plante;
use App\Models\SuiviPlante;
use App\Services\SolCalculator;
use Illuminate\Http\Request;

class SuiviPlanteController extends Controller
{
    public function index(Request $request)
    {
        $query = SuiviPlante::with('plante:id,nom,espece', 'user:id,name,role')
            ->where('user_id', $request->user()->id);

        if ($request->filled('statut')) $query->where('statut', $request->statut);
        if ($request->filled('stade'))  $query->where('stadeVegetatif', $request->stade);

        return response()->json($query->latest()->paginate(15));
    }

    public function calculer(Request $request)
    {
        $data = $request->validate([
            'plante_id'    => 'required|exists:plantes,id',
            'natureSol'    => 'required|in:argileux,sableux,limoneux,calcaire,humifere',
            'superficieHa' => 'required|numeric|min:0.01',
        ]);

        $plante = Plante::find($data['plante_id']);
        $calcul = SolCalculator::calculer($data['natureSol'], $data['superficieHa'], $plante->typeIrrigation);

        return response()->json($calcul);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'plante_id'        => 'required|exists:plantes,id',
            'dateDebut'        => 'required|date',
            'natureSol'        => 'required|in:argileux,sableux,limoneux,calcaire,humifere',
            'superficieHa'     => 'required|numeric|min:0.01',
            'parcelle'         => 'nullable|string',
            'stadeVegetatif'   => 'nullable|in:germination,croissance,floraison,fructification,recolte',
            'notesAgriculteur' => 'nullable|string',
            'statut'           => 'in:en_cours,recolte,abandonne',
        ]);

        $plante = Plante::find($data['plante_id']);
        $calcul = SolCalculator::calculer($data['natureSol'], $data['superficieHa'], $plante->typeIrrigation);

        $suivi = SuiviPlante::create([
            ...$data,
            'user_id'    => $request->user()->id,
            'phSol'      => $calcul['phSol'],
            'BesoinsEau' => $calcul['BesoinsEau'],
        ]);

        return response()->json($suivi->load('plante'), 201);
    }

    public function show(SuiviPlante $suiviPlante)
    {
        return response()->json($suiviPlante->load('plante', 'user:id,name'));
    }

    public function update(Request $request, SuiviPlante $suiviPlante)
    {
        $suiviPlante->update($request->validate([
            'stadeVegetatif'   => 'nullable|in:germination,croissance,floraison,fructification,recolte',
            'notesAgriculteur' => 'nullable|string',
            'statut'           => 'in:en_cours,recolte,abandonne',
        ]));

        return response()->json($suiviPlante);
    }

    public function destroy(SuiviPlante $suiviPlante)
    {
        $suiviPlante->delete();
        return response()->json(null, 204);
    }
}
