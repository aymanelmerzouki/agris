<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanteFavori extends Model
{
    protected $fillable = ['user_id', 'plante_id'];

    public function user()   { return $this->belongsTo(User::class); }
    public function plante() { return $this->belongsTo(Plante::class); }
}
