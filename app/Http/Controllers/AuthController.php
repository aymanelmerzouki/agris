<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:users',
            'password'     => ['required', 'confirmed', Password::min(8)],
            'role'         => 'required|in:agriculteur,manager,ouvrier',
            'nomEntreprise'=> 'required_if:role,manager|nullable|string|max:255|unique:users,nomEntreprise',
            'poste'        => 'nullable|string|max:255',
        ], [
            'nomEntreprise.required_if' => 'Le nom de l\'entreprise est obligatoire pour un compte Entreprise.',
            'nomEntreprise.unique'      => 'Ce nom d\'entreprise est déjà utilisé.',
        ]);

        $user = User::create([...$data, 'password' => Hash::make($data['password'])]);
        $user->refresh(); // charge les valeurs par défaut (statut_emploi, etc.)
        $token = $user->createToken('api')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($data)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        $token = Auth::user()->createToken('api')->plainTextToken;
        return response()->json(['user' => Auth::user(), 'token' => $token]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
