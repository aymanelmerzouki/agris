<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'nomEntreprise', 'poste',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function suiviPlantes()
    {
        return $this->hasMany(SuiviPlante::class);
    }

    public function offres()
    {
        return $this->hasMany(Offre::class);
    }

    public function todoListsManagees()
    {
        return $this->hasMany(TodoList::class, 'manager_id');
    }

    public function todoListsAssignees()
    {
        return $this->hasMany(TodoList::class, 'ouvrier_id');
    }

    public function messagesEnvoyes()  { return $this->hasMany(Message::class, 'expediteur_id'); }
    public function messagesRecus()    { return $this->hasMany(Message::class, 'destinataire_id'); }
    public function stocks()           { return $this->hasMany(Stock::class); }
    public function abonnement()       { return $this->hasOne(Abonnement::class); }
}
