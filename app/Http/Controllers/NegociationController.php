<?php

namespace App\Http\Controllers;

use App\Models\Negociation;
use App\Models\Offre;
use Illuminate\Http\Request;

class NegociationController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'offre_id'          => 'required|exists:offres,id',
            'prix_propose'      => 'required|numeric|min:0',
            'quantite_proposee' => 'required|numeric|min:0.01',
            'message'           => 'nullable|string|max:500',
        ]);

        $negociation = Negociation::create([
            ...$data,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($negociation->load('offre.plante'), 201);
    }

    public function destroy(Request $request, \App\Models\Negociation $negociation)
    {
        if ($negociation->user_id !== $request->user()->id) abort(403);
        $negociation->delete();
        return response()->json(null, 204);
    }
    {
        $negociations = Negociation::where('user_id', $request->user()->id)
            ->with(['offre.plante', 'offre.user'])
            ->latest()
            ->get();

        return response()->json($negociations);
    }
}
