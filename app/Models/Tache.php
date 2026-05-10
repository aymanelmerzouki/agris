<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tache extends Model
{
    use HasFactory;

    protected $fillable = [
        'todo_list_id', 'nomTache', 'description', 'priorite',
        'categorie', 'statut', 'estFaite', 'completeeAt', 'dureeEstimeeMin',
        'parcelle', 'dateEcheance',
    ];

    protected $casts = ['estFaite' => 'boolean', 'completeeAt' => 'datetime'];

    public function todoList() { return $this->belongsTo(TodoList::class); }
}
