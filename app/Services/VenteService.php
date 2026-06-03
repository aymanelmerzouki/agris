<?php

namespace App\Services;

use App\Models\Offre;
use App\Models\Vente;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class VenteService
{
    public function annulerAchat(Vente $vente): void
    {
        DB::transaction(function () use ($vente) {
            $offre = $vente->offre;
            $offre->update([
                'quantite' => $offre->quantite + $vente->quantite,
                'statut'   => 'disponible',
            ]);
            $vente->delete();
        });
    }

    public function traiterAchat(Offre $offre, float $quantiteDemandee, int $acheteurId): Vente
    {
        if ($offre->statut !== 'disponible') {
            throw ValidationException::withMessages(['offre' => 'Cette offre n\'est plus disponible.']);
        }

        if ($offre->quantite < $quantiteDemandee) {
            throw ValidationException::withMessages([
                'quantite' => "Quantité insuffisante. Disponible : {$offre->quantite} {$offre->unite}."
            ]);
        }

        return DB::transaction(function () use ($offre, $quantiteDemandee, $acheteurId) {
            $nouvelleQuantite = $offre->quantite - $quantiteDemandee;

            $offre->update([
                'quantite'    => $nouvelleQuantite,
                'statut'      => $nouvelleQuantite <= 0 ? 'vendu' : 'disponible',
                'acheteur_id' => $nouvelleQuantite <= 0 ? $acheteurId : $offre->acheteur_id,
            ]);

            return Vente::create([
                'offre_id'    => $offre->id,
                'acheteur_id' => $acheteurId,
                'vendeur_id'  => $offre->user_id,
                'plante_id'   => $offre->plante_id,
                'quantite'    => $quantiteDemandee,
                'unite'       => $offre->unite,
                'prix_total'  => $offre->prix * $quantiteDemandee,
            ]);
        });
    }
}
