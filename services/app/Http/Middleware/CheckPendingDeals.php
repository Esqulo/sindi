<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

use App\Http\Controllers\DealsController;
class CheckPendingDeals
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $controller = new DealsController();
        $userId = $controller->retrieveId($request->header('Authorization'));

        // if not logged, let user move on (login, public routes etc)
        if (!$userId) return $next($request);
        
        $hasPending = $controller->checkIfUserHasPendingDeals($userId);

        if ($hasPending) return response()->json([
            'success' => false,
            'message' => 'Você possui acordos pendentes e não pode continuar.'
        ], 403);

        return $next($request);

    }
}
