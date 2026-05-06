<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanteStade extends Model
{
    protected $fillable = ['plante_id', 'nom_stade', 'jour_debut', 'jour_fin', 'multiplicateur_eau'];
}
