<?php

namespace App\Http\Controllers;

use App\Models\MP_Customers;
use App\Models\UserSavedCard;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;


class MercadoPagoController extends Controller
{
//2290150372-NEUjY21lOSMadj test
    public function aaa(Request $request){
        return $this->signUp($request);
    }

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
            
            //Valores obtidos:
            //$user_mpid = "2290150372-NEUjY21lOSMadj"
            //$request['card_token'] = "66e43d8b5b3e37f2afbfc472f93c8e50"

            $response = Http::withToken(env('MERCADO_PAGO_ACCESS_TOKEN'))
            ->post("https://api.mercadopago.com/v1/customers/$user_mpid/cards",[
                'token' => $request['card_token'],
                'payment_method_id' => 'master'
            ]);

            $data = $response->json();

            return response()->json([
                "response" => $data
            ],200);

            UserSavedCard::create([
                "mp_card_id" => $data['id'],
                "last_four_digits" => $data['last_four_digits'],
                "type" => $data['payment_method']['payment_type_id'],
                "flag" => $data['payment_method']['id'],
                "user_id" => $userId
            ]);

            return response()->json([
                "response" => $response
            ],200);

        }catch(Exception $e){
            $status = 200;// method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
            return response()->json([
                "success" => false,
                "data" => $e,
                "message" => $e->getMessage()
            ],$status);
        }
    }

    public function signUp(Request $request){
        try{
        
            $token = $request->header('Authorization');
            $userId = $this->retrieveId($token);
            $userEmail = $this->getUserEmail($userId);

            $response = Http::withToken(env('MERCADO_PAGO_ACCESS_TOKEN'))
            ->post("https://api.mercadopago.com/preapproval",[
                'card_token_id' => "1b55bb0f4b1351b19544f678ac7b8614",
                'preapproval_plan_id' => "2c938084950cbacf01953fdb684f1897",
                'reason' => "Assinatura Sindi",
                'payer_email' => "zecazeca11@hotmail.com",
                'status' => "authorized"
            ]);

            $data = $response->json();

            return response()->json([
                "response" => $data
            ],200);


        }catch(Exception $e){
            $status = 200;
            return response()->json([
                "success" => false,
                "data" => $e,
                "message" => $e->getMessage()
            ],$status);
        }

    }
}
