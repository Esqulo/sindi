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
            $user_mpid = $this->getMercadoPagoUser($userId)->mp_usertoken;
            
            $response = Http::withToken(env('MERCADO_PAGO_ACCESS_TOKEN'))
            ->post("https://api.mercadopago.com/v1/customers/$user_mpid/cards",[
                'token' => $request['card_token']
            ]);

            if($response->status() != 201) throw new Exception('Erro ao registrar cartão',500);
            
            $data = $response->json();

            $cardAlreadyExists = UserSavedCard::where('mp_card_id', $data['id'])->first();
            if ($cardAlreadyExists) throw new Exception("O cartão já está registrado para este usuário.", 409);

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
            $status = $e->getCode() ?: 400;
            $message = $e->getMessage() ?: "Algo deu errado ao registrar o cartão";
            return response()->json([
                "success" => false,
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

    private function allowedToDeleteCard($userId,$cardId){
        //to do: checar se existe assinatura no cartão, funcionalidade de assinatura ainda não existe
        
        $totalCards = UserSavedCard::where('user_id', $userId)->take(2)->count();
        if ($totalCards <= 1) return [
            'reason' => 'Não é possível deletar todos os cartões'
        ];

        return true;
    }

    public function deleteCard(Request $request){
        try{

            $token = $request->header('Authorization');
            $userId = $this->retrieveId($token);
            
            $card = UserSavedCard::where('id',$request->card_id)->first();

            if (!$card) throw new Exception('Cartão não encontrado', 404);
            
            if($card->user_id != $userId) throw new Exception('Access Denied',403);
            
            $isAllowed = $this->allowedToDeleteCard($userId,$card['id']);

            if($isAllowed !== true) throw new Exception($isAllowed['reason']);

            $mpUserId = $this->getMercadoPagoUser($userId)->mp_usertoken;
            $mpcardId = $card->mp_card_id;

            $mp_response = Http::withToken(env('MERCADO_PAGO_ACCESS_TOKEN'))
            ->delete("https://api.mercadopago.com/v1/customers/$mpUserId/cards/$mpcardId");

            if($mp_response->status() != 200) throw new Exception('Erro ao deletar cartão',500);

            $card->delete();

            return response()->json(true,200);

        }catch(Exception $e){
            $status = $e->getCode() ?: 400;
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ],$status);
        }
    }

    public function getPlans(){

        $response = [];

        try{

            $plansFromMp = Http::withToken(env('MERCADO_PAGO_ACCESS_TOKEN'))
            ->get("https://api.mercadopago.com/preapproval_plan/search?status=active");

            foreach ($plansFromMp->json()['results'] as $plan) {
                $response[] = [
                    'title' => $plan['reason'],
                    'price' => $plan['auto_recurring']['transaction_amount'],
                ];
            }

            return response()->json($response,200);

        }catch(Exception $e){
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ],400);
        }
    }

}
