<?php

namespace App\Http\Controllers;

use App\Models\Plante;
use App\Models\PlanteFavori;
use Illuminate\Http\Request;

class PlanteFavoriController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->plantesFavoris()->with('biblios')->paginate(15)
        );
    }

    public function toggle(Request $request, Plante $plante)
    {
        $user = $request->user();
        $existing = PlanteFavori::where('user_id', $user->id)
            ->where('plante_id', $plante->id)->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['favori' => false]);
        }

        PlanteFavori::create(['user_id' => $user->id, 'plante_id' => $plante->id]);
        return response()->json(['favori' => true], 201);
    }
}
