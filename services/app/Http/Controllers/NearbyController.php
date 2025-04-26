<?php

namespace App\Http\Controllers;

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

            $nearbyUsers = User::where('active', true)
            ->where('id', '!=', $userId)
            ->where('user_type', '=', 1)
            ->orderByRaw("CASE 
                            WHEN cep LIKE '" . substr($user->cep, 0, 4) . "%' THEN 1
                            WHEN cep LIKE '" . substr($user->cep, 0, 3) . "%' THEN 2
                            WHEN cep LIKE '" . substr($user->cep, 0, 2) . "%' THEN 3
                            WHEN cep LIKE '" . substr($user->cep, 0, 1) . "%' THEN 4
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
