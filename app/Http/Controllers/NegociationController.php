<?php

namespace App\Http\Controllers;

use App\Models\Negociation;
use App\Notifications\NegociationRecueNotification;
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

        $negociation = Negociation::create([...$data, 'user_id' => $request->user()->id]);

        // Notifier le vendeur de l'offre
        $negociation->load('offre.plante');
        $negociation->offre->user->notify(new NegociationRecueNotification($negociation));

        return response()->json($negociation->load('offre.plante'), 201);
    }

    public function mesNegociations(Request $request)
    {
        return response()->json(
            Negociation::where('user_id', $request->user()->id)
                ->with(['offre.plante', 'offre.user'])
                ->latest()
                ->get()
        );
    }

    public function destroy(Request $request, Negociation $negociation)
    {
        if ($negociation->user_id !== $request->user()->id) abort(403);
        $negociation->delete();
        return response()->json(null, 204);
    }
}
