<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

abstract class Controller
{
    public function userIsAdmin(string $token){   

        $userId = $this->retrieveId($token);

        $userData = DB::table('users')->find($userId);

        if(!$userData->is_admin) return false;

        return true;

    }

    public function retrieveId($token = ""){

        if(!$token) return false;

        if (preg_match('/Bearer\s(\S+)/', $token, $matches)) $token = $matches[1];

        $user_id = DB::table('auth')
        ->where('token', $token)
        ->where('expires_at', '>', now())
        ->value('user_id');

        if(!$user_id) return false;
        
        $userData = DB::table('users')->find($user_id);
        
        if(!$userData) return false;

        return $userData->id;

    }

    public function validateUser($request){

        $token = $request->header('Authorization');
        if(!$token) throw new Exception('Credentials are required');
        
        $user_id = $this->retrieveId($token);
        if(!$user_id) throw new Exception('Invalid credentials');

        return $user_id;
    }

    public function getAddressFromCep($cep){

        $cep = preg_replace('/[^0-9]/', '', $cep);
        if (strlen($cep) !== 8) return ['error' => 'CEP inválido.'];

        try{
            $response = Http::get("https://viacep.com.br/ws/{$cep}/json/");

            if ($response->failed()) throw new Exception('Erro ao consultar o CEP');

            $data = $response->json();

            if (isset($data['erro'])) throw new Exception('CEP não encontrado');

            $fullAddress = "{$data['logradouro']}, {$data['bairro']}, {$data['localidade']}, {$data['uf']}";

            return $fullAddress;
        }catch(Exception $e){
            return [
                'error' => true,
                'message' => $e->getMessage()
            ];
        }

    }

    public function getUserEmail($user_id){
        return DB::table('users')
        ->where('id', $user_id)
        ->value('email');
    }

    public function getUserFullName($user_id){
        return DB::table('users')
        ->where('id', $user_id)
        ->value('name');
    }

}
