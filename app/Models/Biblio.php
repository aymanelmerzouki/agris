<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Biblio extends Model
{
    use HasFactory;

    protected $fillable = ['titre', 'auteur', 'source', 'type', 'resume', 'langue', 'datePublication', 'estValide'];

    protected $casts = ['estValide' => 'boolean', 'datePublication' => 'date'];

    public function plantes() { return $this->belongsToMany(Plante::class, 'biblio_plante'); }
}
