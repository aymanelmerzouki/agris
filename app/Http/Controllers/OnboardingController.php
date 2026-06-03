<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\AgronomicAlertNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OnboardingController extends Controller
{
    // Ouvrier soumet un code d'exploitation
    public function soumettreDemande(Request $request)
    {
        $request->validate(['code' => 'required|string']);

        $gerant = User::where('role', 'manager')
            ->where('code_exploitation', strtoupper($request->code))
            ->first();

        if (!$gerant) {
            return response()->json(['message' => 'Code invalide.'], 422);
        }

        $ouvrier = $request->user();

        if ($ouvrier->statut_emploi === 'actif') {
            return response()->json(['message' => 'Vous êtes déjà intégré à une exploitation.'], 422);
        }

        $ouvrier->update([
            'statut_emploi' => 'en_attente',
            'gerant_id'     => $gerant->id,
        ]);

        // Notifier le gérant
        $gerant->notify(new AgronomicAlertNotification(
            "Nouvelle demande d'intégration de {$ouvrier->name}. Acceptez ou refusez dans votre espace équipe.",
            'info',
            '/equipe'
        ));

        return response()->json(['message' => 'Demande envoyée.']);
    }

    // Gérant : liste des demandes en attente
    public function demandesEnAttente(Request $request)
    {
        return response()->json(
            $request->user()->ouvriers()->where('statut_emploi', 'en_attente')
                ->select('id', 'name', 'email', 'poste', 'created_at')->get()
        );
    }

    // Gérant : liste des ouvriers actifs (acceptés)
    public function membres(Request $request)
    {
        return response()->json(
            $request->user()->ouvriers()->where('statut_emploi', 'actif')
                ->select('id', 'name', 'email', 'poste')->get()
        );
    }

    // Gérant : accepter un ouvrier
    public function accepter(Request $request, User $ouvrier)
    {
        $this->verifierGerant($request, $ouvrier);
        $ouvrier->update(['statut_emploi' => 'actif']);
        return response()->json(['message' => 'Ouvrier accepté.']);
    }

    // Gérant : refuser un ouvrier
    public function refuser(Request $request, User $ouvrier)
    {
        $this->verifierGerant($request, $ouvrier);
        $ouvrier->update(['statut_emploi' => 'aucun', 'gerant_id' => null]);
        return response()->json(['message' => 'Demande refusée.']);
    }

    // Gérant : retirer un ouvrier de son équipe
    public function retirer(Request $request, User $ouvrier)
    {
        $this->verifierGerant($request, $ouvrier);
        $ouvrier->update(['statut_emploi' => 'aucun', 'gerant_id' => null]);
        return response()->json(['message' => 'Ouvrier retiré.']);
    }

    // Gérant : son code d'exploitation
    public function monCode(Request $request)
    {
        $user = $request->user();
        if (!$user->code_exploitation) {
            $user->update(['code_exploitation' => strtoupper(Str::random(6))]);
        }
        return response()->json(['code' => $user->code_exploitation]);
    }

    private function verifierGerant(Request $request, User $ouvrier): void
    {
        if ($ouvrier->gerant_id !== $request->user()->id) abort(403);
    }
}
