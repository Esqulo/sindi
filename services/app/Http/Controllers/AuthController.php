<?php

namespace App\Http\Controllers;
use App\Http\Controllers\MailSender;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Auth as AuthModel;
use App\Models\EmailToken as TokenModel;
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

    public function getCurrentUserId(Request $request){
        $token = $request->header('Authorization');
        if(!$token) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);

        $user_id = $this->retrieveId($token);
        if(!$user_id) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);

        return $user_id;
    }

    public function forgotPassword(Request $request){
        try{
            
            if(!$request->email) throw new Exception("email inválido", 400);
            
            $user = User::where('email', $request->email)->first();

            //send decoy confirmation instead of sending email
            if(!$user) return response()->json([
                'success' => true,
                'message' => 'email enviado com sucesso'
            ], 200);

            //disable old tokens
            TokenModel::where('user_id', $user->id)->update([
                'expired_by_another' => 1
            ]);

            $token = $this->generateToken();
            $expires = date("Y-m-d H:i:s", strtotime('+5 Minutes'));

            TokenModel::create([
                'user_id' => $user->id,
                'code' => $token,
                'expires_at' => $expires
            ]);
            
            $mailSender = new MailSender;
            $mailSender->sendRecoverPasswordEmail($request->email, $token);
            
            return response()->json([
                'success' => true,
                'message' => 'email enviado com sucesso'
            ], 200);

        }catch(Exception $e){
            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?? 'unkown error.'
            ], $e->getCode() ?: 500);
        }
    }

    public function updatePassword(Request $request){
        try{

            $token = $request->header('Authorization');
            if (preg_match('/Bearer\s(\S+)/', $token, $matches)) $token = $matches[1];
            if(!$token) throw new Exception("token inválido", 403);

            $tokenData = TokenModel::where('code', $token)->first();
            if(!$tokenData) throw new Exception("token inválido", 403);

            if($tokenData->already_used == 1 || $tokenData->expired_by_another ||  $tokenData->expires_at <= now()) throw new Exception("token expirado", 403);

            $validatedData = $request->validate([
                "newPassword" => "required|string|min:8|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/|regex:/[@$!%*#?&.;?,'\":{}\-\+\=`_^]/",
            ]);
            
            $newPasswordHash = password_hash($validatedData['newPassword'], PASSWORD_BCRYPT);

            $user = User::find($tokenData->user_id);

            $user->update([
                'password' => $newPasswordHash
            ]);

            $tokenData->already_used = 1;
            $tokenData->save();

            AuthModel::where('user_id', $tokenData->user_id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'senha redefinida com sucesso'
            ], 200);

        }catch(Exception $e){
            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?? 'unkown error.'
            ], $e->getCode() ?: 500);
        }

    }
}
