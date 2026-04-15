<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plante extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'espece', 'description', 'conditionsCulture'];

    public function suiviPlantes()
    {
        return $this->hasMany(SuiviPlante::class);
    }

    public function biblios()
    {
        return $this->belongsToMany(Biblio::class, 'biblio_plante');
    }
}
