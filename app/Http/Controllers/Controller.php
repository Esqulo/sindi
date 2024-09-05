<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Support\Facades\Http;
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

}
