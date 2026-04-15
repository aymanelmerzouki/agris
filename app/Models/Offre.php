<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offre extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'plante_id', 'prix', 'quantite', 'unite', 'statut',
        'dateCreation', 'dateExpiration', 'localisation', 'description', 'livraison',
    ];

    protected $casts = ['livraison' => 'boolean', 'dateCreation' => 'date', 'dateExpiration' => 'date'];

    public function user() { return $this->belongsTo(User::class); }
    public function plante() { return $this->belongsTo(Plante::class); }
}
