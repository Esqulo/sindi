<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

use App\Http\Controllers\UserController;
use App\Models\UserSavedCard;

class CheckCards
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $controller = new UserController();
        $userId = $controller->retrieveId($request->header('Authorization'));

        if (!$userId) return response()->json([
            'success' => false,
            'action' => 'redirectToLogin',
            'message' => 'Não autenticado'
        ], 401);

        $userData = $controller->getUserData($userId);
        
        $hasCards = UserSavedCard::where('user_id',$userId)->first();

        if (!$hasCards && $userData->user_type != 0) return response()->json([
            'success' => false,
            'action' => 'redirectToCards',
            'message' => 'Nenhum cartão foi encontrado'
        ], 403);

        return $next($request);

    }
}
