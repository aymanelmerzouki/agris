<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TodoList extends Model
{
    use HasFactory;

    protected $fillable = [
        'manager_id', 'ouvrier_id', 'titre', 'description', 'nbreTaches',
        'dateCreation', 'dateEcheance', 'statut', 'priorite', 'parcelle',
    ];

    protected $casts = ['dateCreation' => 'date', 'dateEcheance' => 'date'];

    public function manager() { return $this->belongsTo(User::class, 'manager_id'); }
    public function ouvrier() { return $this->belongsTo(User::class, 'ouvrier_id'); }
    public function taches() { return $this->hasMany(Tache::class); }
}
