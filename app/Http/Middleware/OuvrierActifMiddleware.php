<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class OuvrierActifMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if ($user && $user->role === 'ouvrier' && $user->statut_emploi !== 'actif') {
            return response()->json(['message' => 'Accès refusé. Votre compte est en attente de validation.'], 403);
        }
        return $next($request);
    }
}
