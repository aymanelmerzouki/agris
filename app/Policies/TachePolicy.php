<?php

namespace App\Policies;

use App\Models\Tache;
use App\Models\User;

class TachePolicy
{
    public function before(User $user): ?bool
    {
        if ($user->role === 'manager') return true;
        return null;
    }

    public function view(User $user, Tache $tache): bool
    {
        return $tache->todoList->ouvrier_id === $user->id;
    }

    public function update(User $user, Tache $tache): bool
    {
        return $tache->todoList->ouvrier_id === $user->id;
    }

    public function delete(User $user, Tache $tache): bool
    {
        return false;
    }
}
