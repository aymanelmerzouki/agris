<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SuiviPlante extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'plante_id', 'dateDebut', 'DateAgriculte', 'BesoinsEau'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plante()
    {
        return $this->belongsTo(Plante::class);
    }
}
