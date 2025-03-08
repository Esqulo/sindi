<?php

namespace App\Http\Controllers;

use App\Models\MP_Customers;
use App\Models\UserSavedCard;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;


class MercadoPagoController extends Controller
{

    public function createMercadoPagoUser($userData){
         try{
            $mp_user = $this->getMercadoPagoUser($userData['id']);
            if($mp_user['mp_usertoken']) throw new Exception('MP User already exists');

            $response = Http::withToken(env('MERCADO_PAGO_ACCESS_TOKEN', ''))
            ->post('https://api.mercadopago.com/v1/customers',[
                'email' => $userData['email']
            ])->json();

            MP_Customers::Create([
                "user_id" => $userData['id'],
                "mp_usertoken" => $response['id']
            ]);
        }catch(Exception $e){
            return response()->json([
                'mp_usertoken' => false,
                'message' => 'Falha ao processar requisição'
            ],409);
        }
    }

    public function getMercadoPagoUser($userId){
        try{
            $mp_user = MP_Customers::where('user_id',$userId)->first();
            if($mp_user) return $mp_user;
            throw new Exception('User does not exist');
        }catch(Exception $e){
            return [
                'mp_usertoken' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function registerCard(Request $request){
        try{
        
            $token = $request->header('Authorization');
            $userId = $this->retrieveId($token);
            $user_mpid = MP_Customers::where('user_id',$userId)->first()['mp_usertoken'];
            
            $response = Http::withToken(env('MERCADO_PAGO_ACCESS_TOKEN'))
            ->post("https://api.mercadopago.com/v1/customers/$user_mpid/cards",[
                'token' => $request['card_token']
            ]);

            $data = $response->json();

            UserSavedCard::create([
                "mp_card_id" => $data['id'],
                "last_four_digits" => $data['last_four_digits'],
                "type" => $data['payment_method']['payment_type_id'],
                "flag" => $data['payment_method']['id'],
                "user_id" => $userId
            ]);

            return response()->json([
                "success" => true
            ],201);

        }catch(Exception $e){
            $status = $e instanceof \Symfony\Component\HttpKernel\Exception\HttpException ? $e->getStatusCode() : 500;
            $message = $e instanceof \Symfony\Component\HttpKernel\Exception\HttpException ? $e->getMessage() : "Algo deu errado ao registrar o cartão";
            return response()->json([
                "success" => false,
                "data" => $e,
                "message" => $message
            ],$status);
        }
    }

    public function getUserCards(Request $request){
        try{

            $token = $request->header('Authorization');

            $userId = $this->retrieveId($token);

            $userCards = UserSavedCard::where('user_id',$userId)->get();

            return response()->json($userCards,200);

        }catch(Exception $e){
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ],400);
        }
    }

}
