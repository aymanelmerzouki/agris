<?php

namespace App\Http\Controllers;

use App\Models\Tache;
use App\Models\TodoList;
use App\Notifications\TaskAssignedNotification;
use App\Notifications\TaskCompletedNotification;
use Illuminate\Http\Request;

class TacheController extends Controller
{
    public function index(Request $request, TodoList $todoList)
    {
        $user = $request->user();
        if ($user->role === 'ouvrier' && $todoList->ouvrier_id !== $user->id) abort(403);
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
            'parcelle'        => 'nullable|string|max:255',
            'dateEcheance'    => 'nullable|date',
        ]);

        $tache = $todoList->taches()->create($data);
        $todoList->increment('nbreTaches');

        if ($todoList->ouvrier) {
            $todoList->ouvrier->notify(new TaskAssignedNotification($tache));
        }

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
            'parcelle'        => 'nullable|string|max:255',
            'dateEcheance'    => 'nullable|date',
        ]);

        if ($user->role === 'ouvrier') {
            $data = array_intersect_key($data, array_flip(['statut', 'estFaite']));
        }

        $wasNotDone = !$tache->estFaite;

        if (isset($data['statut'])) {
            $data['estFaite'] = $data['statut'] === 'termine';
            if ($data['estFaite'] && $wasNotDone) $data['completeeAt'] = now();
        } elseif (isset($data['estFaite']) && $data['estFaite'] && $wasNotDone) {
            $data['statut'] = 'termine';
            $data['completeeAt'] = now();
        }

        $tache->update($data);

        if ($user->role === 'ouvrier' && ($data['statut'] ?? null) === 'termine' && $wasNotDone) {
            $todoList->manager->notify(new TaskCompletedNotification($tache));
        }

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
