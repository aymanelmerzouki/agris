<?php

namespace App\Http\Controllers;

use App\Models\Plante;
use Illuminate\Http\Request;

class PlanteController extends Controller
{
    public function index(Request $request)
    {
        $query = Plante::query();

        if ($request->filled('espece'))   $query->where('espece', $request->espece);
        if ($request->filled('saison'))   $query->where('saisonPlantation', $request->saison);
        if ($request->boolean('bio'))     $query->where('estBio', true);
        if ($request->filled('search'))   $query->where('nom', 'like', "%{$request->search}%");

        return response()->json($query->withCount('suiviPlantes')->paginate(15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom'                => 'required|string|max:255',
            'espece'             => 'required|string|max:255',
            'famille'            => 'nullable|string',
            'origine'            => 'nullable|string',
            'description'        => 'nullable|string',
            'conditionsCulture'  => 'nullable|string',
            'temperatureMin'     => 'nullable|numeric',
            'temperatureMax'     => 'nullable|numeric',
            'saisonPlantation'   => 'nullable|in:printemps,été,automne,hiver',
            'dureePousseeJours'  => 'nullable|integer',
            'rendementMoyenKgHa' => 'nullable|numeric',
            'typeIrrigation'     => 'nullable|in:goutte_a_goutte,aspersion,submersion,pluviale',
            'estBio'             => 'boolean',
            'imageUrl'           => 'nullable|url',
        ]);

        return response()->json(Plante::create($data), 201);
    }

    public function show(Plante $plante)
    {
        return response()->json($plante->load('biblios', 'suiviPlantes.user', 'offres'));
    }

    public function update(Request $request, Plante $plante)
    {
        $plante->update($request->validate([
            'nom'                => 'sometimes|string|max:255',
            'espece'             => 'sometimes|string',
            'famille'            => 'nullable|string',
            'origine'            => 'nullable|string',
            'description'        => 'nullable|string',
            'conditionsCulture'  => 'nullable|string',
            'temperatureMin'     => 'nullable|numeric',
            'temperatureMax'     => 'nullable|numeric',
            'saisonPlantation'   => 'nullable|in:printemps,été,automne,hiver',
            'dureePousseeJours'  => 'nullable|integer',
            'rendementMoyenKgHa' => 'nullable|numeric',
            'typeIrrigation'     => 'nullable|in:goutte_a_goutte,aspersion,submersion,pluviale',
            'estBio'             => 'boolean',
            'imageUrl'           => 'nullable|url',
        ]));

        return response()->json($plante);
    }

    public function destroy(Plante $plante)
    {
        $plante->delete();
        return response()->json(null, 204);
    }
}
