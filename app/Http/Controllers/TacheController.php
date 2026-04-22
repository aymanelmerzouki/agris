<?php

namespace App\Http\Controllers;

use App\Models\Tache;
use App\Models\TodoList;
use Illuminate\Http\Request;

class TacheController extends Controller
{
    public function index(Request $request, TodoList $todoList)
    {
        $user = $request->user();
        if ($user->role === 'ouvrier' && $todoList->ouvrier_id !== $user->id) {
            abort(403);
        }
        return response()->json($todoList->taches()->orderBy('priorite')->get());
    }

    public function store(Request $request, TodoList $todoList)
    {
        $data = $request->validate([
            'nomTache'        => 'required|string|max:255',
            'description'     => 'nullable|string',
            'priorite'        => 'in:basse,normale,haute,urgente',
            'categorie'       => 'in:irrigation,recolte,traitement,semis,entretien,autre',
            'dureeEstimeeMin' => 'nullable|integer|min:1',
        ]);

        $tache = $todoList->taches()->create($data);
        $todoList->increment('nbreTaches');

        return response()->json($tache, 201);
    }

    public function update(Request $request, TodoList $todoList, Tache $tache)
    {
        $this->authorize('update', $tache);

        $user = $request->user();
        $data = $request->validate([
            'nomTache'        => 'sometimes|string|max:255',
            'description'     => 'nullable|string',
            'priorite'        => 'in:basse,normale,haute,urgente',
            'categorie'       => 'in:irrigation,recolte,traitement,semis,entretien,autre',
            'statut'          => 'in:en_attente,en_cours,termine',
            'estFaite'        => 'boolean',
            'dureeEstimeeMin' => 'nullable|integer|min:1',
        ]);

        if ($user->role === 'ouvrier') {
            $data = array_intersect_key($data, array_flip(['statut', 'estFaite']));
        }

        if (isset($data['statut'])) {
            $data['estFaite'] = $data['statut'] === 'termine';
            if ($data['estFaite'] && !$tache->estFaite) {
                $data['completeeAt'] = now();
            }
        } elseif (isset($data['estFaite']) && $data['estFaite'] && !$tache->estFaite) {
            $data['statut'] = 'termine';
            $data['completeeAt'] = now();
        }

        $tache->update($data);
        return response()->json($tache);
    }

    public function destroy(TodoList $todoList, Tache $tache)
    {
        $this->authorize('delete', $tache);
        $tache->delete();
        $todoList->decrement('nbreTaches');
        return response()->json(null, 204);
    }
}
