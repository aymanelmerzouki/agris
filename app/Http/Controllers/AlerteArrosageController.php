<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AlerteArrosageController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->notifications()->latest()->paginate(20)
        );
    }

    public function marquerLues(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'Alertes marquées comme lues.']);
    }
}
