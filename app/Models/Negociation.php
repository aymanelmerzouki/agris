<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Negociation extends Model
{
    protected $fillable = ['offre_id', 'user_id', 'prix_propose', 'quantite_proposee', 'message', 'statut'];

    public function offre() { return $this->belongsTo(Offre::class); }
    public function user() { return $this->belongsTo(User::class); }
}
