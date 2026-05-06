<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'plante_id', 'produit', 'quantite', 'unite',
        'seuilAlerte', 'localisation', 'dateEntree', 'dateExpiration', 'notes',
    ];

    public function user()   { return $this->belongsTo(User::class); }
    public function plante() { return $this->belongsTo(Plante::class); }
}
