<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Abonnement extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'plan', 'statut', 'dateDebut', 'dateFin', 'prix'];

    public function user() { return $this->belongsTo(User::class); }
}
