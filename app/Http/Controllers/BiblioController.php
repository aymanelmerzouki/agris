<?php

namespace App\Http\Controllers;

use App\Models\Biblio;
use Illuminate\Http\Request;

class BiblioController extends Controller
{
    public function index(Request $request)
    {
        $query = Biblio::query();
        if ($request->filled('type'))   $query->where('type', $request->type);
        if ($request->filled('langue')) $query->where('langue', $request->langue);
        if ($request->boolean('valide')) $query->where('estValide', true);

        return response()->json($query->with('plantes:id,nom,espece')->paginate(15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre'           => 'required|string|max:255',
            'auteur'          => 'nullable|string',
            'source'          => 'nullable|string',
            'type'            => 'in:article,guide,video,fiche_technique',
            'resume'          => 'nullable|string',
            'langue'          => 'string|max:5',
            'datePublication' => 'nullable|date',
            'estValide'       => 'boolean',
            'plantes'         => 'nullable|array',
            'plantes.*'       => 'exists:plantes,id',
        ]);

        $biblio = Biblio::create($data);
        if (!empty($data['plantes'])) $biblio->plantes()->sync($data['plantes']);

        return response()->json($biblio->load('plantes'), 201);
    }

    public function show(Biblio $biblio)
    {
        return response()->json($biblio->load('plantes'));
    }

    public function update(Request $request, Biblio $biblio)
    {
        $data = $request->validate([
            'titre'           => 'sometimes|string|max:255',
            'auteur'          => 'nullable|string',
            'source'          => 'nullable|string',
            'type'            => 'in:article,guide,video,fiche_technique',
            'resume'          => 'nullable|string',
            'langue'          => 'string|max:5',
            'datePublication' => 'nullable|date',
            'estValide'       => 'boolean',
            'plantes'         => 'nullable|array',
            'plantes.*'       => 'exists:plantes,id',
        ]);

        $biblio->update($data);
        if (isset($data['plantes'])) $biblio->plantes()->sync($data['plantes']);

        return response()->json($biblio->load('plantes'));
    }

    public function destroy(Biblio $biblio)
    {
        $biblio->delete();
        return response()->json(null, 204);
    }
}
