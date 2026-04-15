<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        return Message::where('expediteur_id', $user->id)
            ->orWhere('destinataire_id', $user->id)
            ->with(['expediteur:id,name', 'destinataire:id,name'])
            ->latest()
            ->paginate(20);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'destinataire_id' => 'required|exists:users,id',
            'contenu'         => 'required|string',
        ]);

        $message = Message::create([
            ...$data,
            'expediteur_id' => $request->user()->id,
        ]);

        return response()->json($message->load(['expediteur:id,name', 'destinataire:id,name']), 201);
    }

    public function update(Request $request, Message $message)
    {
        // Marquer comme lu
        $message->update(['lu' => true, 'luAt' => now()]);
        return response()->json($message);
    }

    public function destroy(Message $message)
    {
        $message->delete();
        return response()->noContent();
    }
}
