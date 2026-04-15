<?php

namespace App\Http\Controllers;

use App\Models\TodoList;
use Illuminate\Http\Request;

class TodoListController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = TodoList::with('ouvrier:id,name', 'manager:id,name');

        // Manager voit ses listes créées, ouvrier voit ses listes assignées
        if ($user->role === 'manager') {
            $query->where('manager_id', $user->id);
        } elseif ($user->role === 'ouvrier') {
            $query->where('ouvrier_id', $user->id);
        }

        if ($request->filled('statut'))   $query->where('statut', $request->statut);
        if ($request->filled('priorite')) $query->where('priorite', $request->priorite);

        return response()->json($query->withCount('taches')->latest()->paginate(15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'ouvrier_id'   => 'required|exists:users,id',
            'titre'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'dateCreation' => 'required|date',
            'dateEcheance' => 'nullable|date|after:dateCreation',
            'statut'       => 'in:en_attente,en_cours,terminee,annulee',
            'priorite'     => 'in:basse,normale,haute,urgente',
            'parcelle'     => 'nullable|string',
        ]);

        return response()->json(
            TodoList::create([...$data, 'manager_id' => $request->user()->id]),
            201
        );
    }

    public function show(TodoList $todoList)
    {
        return response()->json($todoList->load('taches', 'manager:id,name', 'ouvrier:id,name'));
    }

    public function update(Request $request, TodoList $todoList)
    {
        $todoList->update($request->validate([
            'titre'        => 'sometimes|string|max:255',
            'description'  => 'nullable|string',
            'dateEcheance' => 'nullable|date',
            'statut'       => 'in:en_attente,en_cours,terminee,annulee',
            'priorite'     => 'in:basse,normale,haute,urgente',
            'parcelle'     => 'nullable|string',
            'nbreTaches'   => 'integer|min:0',
        ]));

        return response()->json($todoList);
    }

    public function destroy(TodoList $todoList)
    {
        $todoList->delete();
        return response()->json(null, 204);
    }
}
