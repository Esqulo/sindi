<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Exception;

class NearbyController extends Controller
{
    public function users($id, Request $request){

        $token = $request->header('Authorization');
        if(!$token) return response()->json(['message' => 'Credentials are required'], 401);
        
        $hasAccess = $this->checkPermission($token,$id);
        if(!$hasAccess) return response()->json(['message' => 'not allowed'], 403);

        $requester = User::where('active', true)->where('id',$id)->first();
        
        $cep = $requester->cep;

        $nearbyUsers = User::where('active', true)
        ->where('id', '!=', $id)
        ->orderByRaw("CASE 
                        WHEN cep LIKE '" . substr($cep, 0, 4) . "%' THEN 1
                        WHEN cep LIKE '" . substr($cep, 0, 3) . "%' THEN 2
                        WHEN cep LIKE '" . substr($cep, 0, 2) . "%' THEN 3
                        WHEN cep LIKE '" . substr($cep, 0, 1) . "%' THEN 4
                        ELSE 5
                      END")
        ->paginate(10);
        
        return response()->json($nearbyUsers);
    }

    private function checkPermission($token,$item){
        if (preg_match('/Bearer\s(\S+)/', $token, $matches)) $token = $matches[1];
        if(!$this->userIsAdmin($token) && $this->retrieveId($token) != $item) return false;
        return true;
    }
}
