<?php

namespace App\Http\Controllers;

use App\Models\Offre;
use Illuminate\Http\Request;

class OffreController extends Controller
{
    public function index(Request $request)
    {
        $query = Offre::with('user:id,name', 'plante:id,nom,espece');

        if ($request->filled('statut'))       $query->where('statut', $request->statut);
        if ($request->filled('localisation')) $query->where('localisation', 'like', "%{$request->localisation}%");
        if ($request->filled('plante_id'))    $query->where('plante_id', $request->plante_id);
        if ($request->boolean('livraison'))   $query->where('livraison', true);

        return response()->json($query->latest()->paginate(15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'plante_id'      => 'nullable|exists:plantes,id',
            'prix'           => 'required|numeric|min:0',
            'quantite'       => 'required|numeric|min:0',
            'unite'          => 'in:kg,tonne,caisse,litre,unite',
            'statut'         => 'in:disponible,vendu,expire,en_negociation',
            'dateCreation'   => 'required|date',
            'dateExpiration' => 'nullable|date|after:dateCreation',
            'localisation'   => 'nullable|string',
            'description'    => 'nullable|string',
            'livraison'      => 'boolean',
        ]);

        return response()->json(
            Offre::create([...$data, 'user_id' => $request->user()->id])->load('plante'),
            201
        );
    }

    public function show(Offre $offre)
    {
        return response()->json($offre->load('user:id,name,nomEntreprise', 'plante'));
    }

    public function update(Request $request, Offre $offre)
    {
        $offre->update($request->validate([
            'prix'           => 'sometimes|numeric|min:0',
            'quantite'       => 'sometimes|numeric|min:0',
            'unite'          => 'in:kg,tonne,caisse,litre,unite',
            'statut'         => 'in:disponible,vendu,expire,en_negociation',
            'dateExpiration' => 'nullable|date',
            'localisation'   => 'nullable|string',
            'description'    => 'nullable|string',
            'livraison'      => 'boolean',
        ]));

        return response()->json($offre);
    }

    public function destroy(Offre $offre)
    {
        $offre->delete();
        return response()->json(null, 204);
    }
}
