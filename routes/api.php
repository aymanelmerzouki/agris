<?php

use App\Http\Controllers\AbonnementController;
use App\Http\Controllers\AlerteArrosageController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BiblioController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\OffreController;
use App\Http\Controllers\PlanteFavoriController;
use App\Http\Controllers\PlanteController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\SuiviPlanteController;
use App\Http\Controllers\TacheController;
use App\Http\Controllers\TodoListController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\NewsController;

// Auth publique
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::get('/news',      [NewsController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
    Route::get('/ouvriers', fn() => response()->json(
        \App\Models\User::where('role', 'ouvrier')->select('id','name','poste')->get()
    ));

    // Accessible à tous les rôles
    Route::apiResource('plantes', PlanteController::class);
    Route::apiResource('biblios', BiblioController::class);
    Route::apiResource('offres',  OffreController::class);
    Route::post('offres/{offre}/accepter', [OffreController::class, 'accepter']);
    Route::apiResource('messages', MessageController::class)->except(['show']);
    Route::apiResource('abonnements', AbonnementController::class)->only(['index', 'store']);

    // Favoris
    Route::get('favoris',                        [PlanteFavoriController::class, 'index']);
    Route::post('plantes/{plante}/favori',        [PlanteFavoriController::class, 'toggle']);

    // Alertes arrosage
    Route::get('alertes',                        [AlerteArrosageController::class, 'index']);
    Route::post('alertes/marquer-lues',          [AlerteArrosageController::class, 'marquerLues']);

    // Agriculteur + Manager
    Route::middleware('role:agriculteur,manager')->group(function () {
        Route::post('suivi-plantes/calculer', [SuiviPlanteController::class, 'calculer']);
        Route::apiResource('suivi-plantes', SuiviPlanteController::class);
        Route::apiResource('stocks', StockController::class);
    });

    // Manager uniquement — créer/gérer les todo-lists
    Route::middleware('role:manager')->group(function () {
        Route::apiResource('todo-lists', TodoListController::class)->except(['index', 'show']);
    });

    // Manager + Ouvrier — voir les todo-lists et gérer les tâches
    Route::middleware('role:manager,ouvrier')->group(function () {
        Route::apiResource('todo-lists', TodoListController::class)->only(['index', 'show']);
        Route::get   ('todo-lists/{todoList}/taches',           [TacheController::class, 'index']);
        Route::post  ('todo-lists/{todoList}/taches',           [TacheController::class, 'store']);
        Route::put   ('todo-lists/{todoList}/taches/{tache}',   [TacheController::class, 'update']);
        Route::delete('todo-lists/{todoList}/taches/{tache}',   [TacheController::class, 'destroy']);
    });
});
