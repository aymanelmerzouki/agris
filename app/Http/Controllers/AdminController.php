<?php

namespace App\Http\Controllers;

use App\Models\Abonnement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    /**
     * Statistiques globales de la plateforme (dashboard admin).
     */
    public function stats(Request $request)
    {
        return response()->json([
            'total_utilisateurs' => User::count(),
            'repartition_roles'  => User::query()
                ->selectRaw('role, count(*) as total')
                ->groupBy('role')
                ->pluck('total', 'role'),
            'abonnements_actifs' => Abonnement::where('statut', 'actif')->count(),
            'revenu_total'       => round((float) Abonnement::where('statut', 'actif')->sum('prix'), 2),
        ]);
    }

    /**
     * Liste paginée des utilisateurs, avec recherche et filtre par rôle.
     */
    public function utilisateurs(Request $request)
    {
        $query = User::query()
            ->with('abonnement:id,user_id,plan,statut')
            ->withCount('suiviPlantes', 'offres');

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $terme = $request->search;
            $query->where(function ($q) use ($terme) {
                $q->where('name', 'like', "%{$terme}%")
                  ->orWhere('email', 'like', "%{$terme}%");
            });
        }

        return response()->json(
            $query->select('id', 'name', 'email', 'role', 'nomEntreprise', 'statut_emploi', 'created_at')
                ->latest()
                ->paginate(15)
        );
    }

    /**
     * Modifier le rôle d'un utilisateur.
     */
    public function changerRole(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Vous ne pouvez pas modifier votre propre rôle.'], 422);
        }

        $data = $request->validate([
            'role' => ['required', Rule::in(['agriculteur', 'manager', 'ouvrier', 'admin'])],
        ]);

        $user->update($data);

        return response()->json($user->only('id', 'name', 'email', 'role'));
    }

    /**
     * Supprimer un utilisateur.
     */
    public function supprimerUtilisateur(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte.'], 422);
        }

        $user->delete();

        return response()->json(null, 204);
    }

    /**
     * Liste paginée des abonnements.
     */
    public function abonnements(Request $request)
    {
        $query = Abonnement::with('user:id,name,email,role');

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }
        if ($request->filled('plan')) {
            $query->where('plan', $request->plan);
        }

        return response()->json($query->latest()->paginate(15));
    }

    /**
     * Mettre à jour un abonnement (plan / statut).
     */
    public function modifierAbonnement(Request $request, Abonnement $abonnement)
    {
        $data = $request->validate([
            'plan'   => ['sometimes', Rule::in(['gratuit', 'basic', 'pro', 'entreprise'])],
            'statut' => ['sometimes', Rule::in(['actif', 'expire', 'suspendu'])],
            'prix'   => 'sometimes|numeric|min:0',
        ]);

        $abonnement->update($data);

        return response()->json($abonnement->load('user:id,name,email'));
    }

    /**
     * Supprimer un abonnement.
     */
    public function supprimerAbonnement(Abonnement $abonnement)
    {
        $abonnement->delete();

        return response()->json(null, 204);
    }
}
