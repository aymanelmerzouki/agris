<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plante extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom', 'espece', 'famille', 'origine', 'description', 'conditionsCulture',
        'temperatureMin', 'temperatureMax', 'saisonPlantation', 'dureePousseeJours',
        'rendementMoyenKgHa', 'typeIrrigation', 'estBio', 'imageUrl',
    ];

    protected $casts = ['estBio' => 'boolean'];

    public function suiviPlantes() { return $this->hasMany(SuiviPlante::class); }
    public function biblios() { return $this->belongsToMany(Biblio::class, 'biblio_plante'); }
    public function offres() { return $this->hasMany(Offre::class); }
    public function favorisParUsers() { return $this->belongsToMany(User::class, 'plante_favoris'); }
}
