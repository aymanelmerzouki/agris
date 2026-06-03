<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SuiviPlante extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'plante_id', 'dateDebut', 'DateAgriculte', 'BesoinsEau',
        'superficie', 'unite_superficie', 'parcelle', 'ville', 'stadeVegetatif', 'tauxHumidite',
        'phSol', 'notesAgriculteur', 'statut', 'natureSol',
        'besoin_eau_calcule', 'ph_estime',
    ];

    protected $casts = ['dateDebut' => 'date', 'DateAgriculte' => 'date'];

    public function user() { return $this->belongsTo(User::class); }
    public function plante() { return $this->belongsTo(Plante::class); }
    public function alertes() { return $this->hasMany(AlerteArrosage::class); }
}
