<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;

abstract class Controller
{
    public function userIsAdmin(string $token){   
        $user_id = DB::table('auth')
        ->where('token', $token)
        ->where('expires_at', '>', now())
        ->value('user_id');

        if(!$user_id) return false;
        
        $userData = DB::table('users')->find($user_id);
        
        if(!$userData->is_admin) return false;

        return true;
    }

    public function retrieveId(string $token){
        $user_id = DB::table('auth')
        ->where('token', $token)
        ->where('expires_at', '>', now())
        ->value('user_id');

        if(!$user_id) return false;
        
        $userData = DB::table('users')->find($user_id);
        
        if(!$userData) return false;

        return $userData->id;
    }

}
