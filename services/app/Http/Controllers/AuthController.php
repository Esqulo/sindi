<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Auth as AuthModel;
use Exception;

class AuthController extends Controller
{

    public function generateToken(){
        $now = date("Y-m-d H:i:s");
        $token = md5($now.rand(0,99999).rand(0,99999));
        return $token;
    }

    public function login(Request $request){
        try{
            $user = User::where('email', $request->username)->first();       
            if(!$user) throw new Exception();
            
            $passwordMatch = password_verify($request->password, $user->password);
            if(!$passwordMatch) throw new Exception();

            $token = $this->generateToken();
            
            $data = [
                'user_id' => $user->id,
                'token' => $token
            ];

            AuthModel::create($data);
            
            return response()->json(['success' => true, 'token' => $token]);
        }catch(Exception $e){
            return response()->json(['message' => 'User or password incorrect'], 404);
        }
    }

    public function logout(Request $request){
        try{
            $token = $request->header('Authorization');
            if (preg_match('/Bearer\s(\S+)/', $token, $matches)) $token = $matches[1];

            $auth = AuthModel::where('token',$token);
            if(!$auth) throw new Exception();

            $auth->delete();
            return response()->json(['success' => true]);
        }catch(Exception $e){
            return response()->json(['message' => 'token not found'], 404);
        }
    }

    public function logoutFromAll(Request $request){
        try{
            $token = $request->header('Authorization');
            if (preg_match('/Bearer\s(\S+)/', $token, $matches)) $token = $matches[1];
            
            $auth = AuthModel::where('token',$token)->first();
            if(!$auth) throw new Exception();

            AuthModel::where('user_id', $auth->user_id)->delete();
            return response()->json(['success' => true]);
        }catch(Exception $e){
            return response()->json(['message' => 'token not found'], 404);
        }
    }
}
