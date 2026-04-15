<?php

use App\Http\Controllers\AbonnementController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BiblioController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\OffreController;
use App\Http\Controllers\PlanteController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\SuiviPlanteController;
use App\Http\Controllers\TacheController;
use App\Http\Controllers\TodoListController;
use Illuminate\Support\Facades\Route;

// Auth publique
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    Route::apiResource('plantes',      PlanteController::class);
    Route::apiResource('biblios',      BiblioController::class);
    Route::apiResource('suivi-plantes', SuiviPlanteController::class);
    Route::apiResource('offres',       OffreController::class);
    Route::apiResource('todo-lists',   TodoListController::class);

    // Tâches imbriquées sous todo-lists
    Route::get   ('todo-lists/{todoList}/taches',           [TacheController::class, 'index']);
    Route::post  ('todo-lists/{todoList}/taches',           [TacheController::class, 'store']);
    Route::put   ('todo-lists/{todoList}/taches/{tache}',   [TacheController::class, 'update']);
    Route::delete('todo-lists/{todoList}/taches/{tache}',   [TacheController::class, 'destroy']);

    Route::apiResource('messages',     MessageController::class)->except(['show']);
    Route::apiResource('stocks',       StockController::class);
    Route::apiResource('abonnements',  AbonnementController::class)->only(['index', 'store']);
});
