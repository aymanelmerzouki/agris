<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AlerteArrosageController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->notifications()->where('type', 'App\Notifications\AlerteArrosageNotification')
                ->latest()->paginate(20)
        );
    }

    public function marquerLues(Request $request)
    {
        $request->user()->unreadNotifications
            ->where('type', 'App\Notifications\AlerteArrosageNotification')
            ->markAsRead();

        return response()->json(['message' => 'Alertes marquées comme lues.']);
    }
}
