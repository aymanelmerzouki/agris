<?php

namespace App\Http\Controllers;

use App\Models\Abonnement;
use App\Services\OtpService;
use Illuminate\Http\Request;

class AbonnementController extends Controller
{
    // Tarif mensuel de l'abonnement Entreprise (premier mois offert).
    private const PRIX_ENTREPRISE = 299;

    public function index(Request $request)
    {
        return $request->user()->abonnement;
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'plan'       => 'required|in:gratuit,basic,pro,entreprise',
            'dateDebut'  => 'required|date',
            'dateFin'    => 'nullable|date|after:dateDebut',
            'prix'       => 'required|numeric|min:0',
        ]);

        $abonnement = Abonnement::updateOrCreate(
            ['user_id' => $request->user()->id],
            [...$data, 'statut' => 'actif']
        );

        return response()->json($abonnement, 201);
    }

    /**
     * Étape 1 : le manager saisit une carte bancaire (SIMULÉE — aucun paiement réel).
     * On valide uniquement le format, puis on envoie un OTP par email.
     */
    public function initierPaiement(Request $request, OtpService $otp)
    {
        $user = $request->user();

        if ($user->role !== 'manager') {
            return response()->json(['message' => 'Seuls les comptes Entreprise souscrivent à un abonnement.'], 422);
        }

        // Validation de FORMAT uniquement — données de carte jamais stockées.
        $request->validate([
            'numero_carte' => ['required', 'regex:/^\d{16}$/'],
            'expiration'   => ['required', 'regex:/^(0[1-9]|1[0-2])\/\d{2}$/'],
            'cvv'          => ['required', 'regex:/^\d{3}$/'],
            'titulaire'    => ['required', 'string', 'max:255'],
        ], [
            'numero_carte.regex' => 'Le numéro de carte doit comporter 16 chiffres.',
            'expiration.regex'   => 'La date d\'expiration doit être au format MM/AA.',
            'cvv.regex'          => 'Le CVV doit comporter 3 chiffres.',
        ]);

        $otp->envoyer($user);

        return response()->json([
            'message'        => 'Un code de validation a été envoyé à votre adresse email.',
            'prix'           => self::PRIX_ENTREPRISE,
            'premier_mois'   => 'offert',
        ]);
    }

    /**
     * Étape 2 : le manager saisit l'OTP reçu par email.
     * En cas de succès, l'abonnement Entreprise est activé (premier mois offert).
     */
    public function verifierOtp(Request $request, OtpService $otp)
    {
        $user = $request->user();

        $request->validate(['code' => ['required', 'string']]);

        if ($user->role !== 'manager') {
            return response()->json(['message' => 'Action non autorisée.'], 422);
        }

        if (! $otp->verifier($user, $request->code)) {
            return response()->json(['message' => 'Code invalide ou expiré.'], 422);
        }

        $abonnement = Abonnement::updateOrCreate(
            ['user_id' => $user->id],
            [
                'plan'      => 'entreprise',
                'statut'    => 'actif',
                'dateDebut' => now()->toDateString(),
                'dateFin'   => now()->addMonth()->toDateString(),
                'prix'      => self::PRIX_ENTREPRISE,
            ]
        );

        // Marque l'email comme vérifié : l'OTP reçu prouve que l'adresse fonctionne.
        if (is_null($user->email_verified_at)) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }

        return response()->json([
            'message'     => 'Abonnement Entreprise activé. Premier mois offert.',
            'abonnement'  => $abonnement,
        ]);
    }
}
