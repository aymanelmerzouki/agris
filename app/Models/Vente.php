<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vente extends Model
{
    protected $fillable = ['offre_id', 'acheteur_id', 'vendeur_id', 'plante_id', 'quantite', 'unite', 'prix_total'];

    public function offre()    { return $this->belongsTo(Offre::class); }
    public function acheteur() { return $this->belongsTo(User::class, 'acheteur_id'); }
    public function vendeur()  { return $this->belongsTo(User::class, 'vendeur_id'); }
    public function plante()   { return $this->belongsTo(Plante::class); }
}
