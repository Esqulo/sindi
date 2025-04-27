<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;
use App\Models\User;
use Exception;

class NearbyController extends Controller
{
    public function trustee(Request $request){
        try{
            $userId = $this->retrieveId($request->header('Authorization'));
            if(!$userId) throw new Exception("Not allowed.", 403);

            $user = User::find($userId);
            
            if(!$user->cep) throw new Exception("Localização inválida.", 500);

            DB::statement("SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))");
            $nearbyUsers = User::select(
                'users.*',
                DB::raw('COALESCE(ROUND(AVG(avaliations.stars), 2), 0) as stars'),
                DB::raw('GREATEST(TIMESTAMPDIFF(YEAR, users.work_since, NOW()), 1) as experience_time')
            )
            ->leftJoin('avaliations', 'avaliations.to', '=', 'users.id')
            ->where('users.active', true)
            ->where('users.id', '!=', $userId)
            ->where('users.user_type', '=', 1)
            ->groupBy('users.id')
            ->orderByRaw("CASE 
                            WHEN users.cep LIKE '" . substr($user->cep, 0, 4) . "%' THEN 1
                            WHEN users.cep LIKE '" . substr($user->cep, 0, 3) . "%' THEN 2
                            WHEN users.cep LIKE '" . substr($user->cep, 0, 2) . "%' THEN 3
                            WHEN users.cep LIKE '" . substr($user->cep, 0, 1) . "%' THEN 4
                            ELSE 5
                          END")
            ->paginate(10);
            
            return response()->json($nearbyUsers);
        }catch(Exception $e){
            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?? 'unkown error.'
            ], $e->getCode() ?: 500);
        }
    }
}
