<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AlerteArrosage extends Model
{
    protected $fillable = ['suivi_plante_id', 'datePrevue', 'quantiteLitres', 'envoyee'];

    protected $casts = ['datePrevue' => 'date', 'envoyee' => 'boolean'];

    public function suiviPlante() { return $this->belongsTo(SuiviPlante::class); }
}
