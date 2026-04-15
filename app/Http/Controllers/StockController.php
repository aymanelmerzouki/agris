<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->stocks()->with('plante:id,nom')->paginate(15);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'plante_id'      => 'nullable|exists:plantes,id',
            'produit'        => 'required|string',
            'quantite'       => 'required|numeric|min:0',
            'unite'          => 'required|in:kg,tonne,caisse,litre,unite',
            'seuilAlerte'    => 'nullable|numeric|min:0',
            'localisation'   => 'nullable|string',
            'dateEntree'     => 'required|date',
            'dateExpiration' => 'nullable|date',
            'notes'          => 'nullable|string',
        ]);

        $stock = $request->user()->stocks()->create($data);
        return response()->json($stock, 201);
    }

    public function show(Stock $stock)
    {
        return $stock->load('plante:id,nom');
    }

    public function update(Request $request, Stock $stock)
    {
        $stock->update($request->validate([
            'quantite'    => 'sometimes|numeric|min:0',
            'seuilAlerte' => 'nullable|numeric|min:0',
            'notes'       => 'nullable|string',
        ]));
        return response()->json($stock);
    }

    public function destroy(Stock $stock)
    {
        $stock->delete();
        return response()->noContent();
    }
}
