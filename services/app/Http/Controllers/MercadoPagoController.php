<?php

namespace App\Http\Controllers;

use App\Models\MP_Customers;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;


class MercadoPagoController extends Controller
{
    public function createMercadoPagoUser($userData){
        try{
            $response = Http::withToken(env('MERCADO_PAGO_ACCESS_TOKEN', ''))
            ->post('https://api.mercadopago.com/v1/customers',[
                'email' => $userData->email
            ]);

            MP_Customers::Create([
                "user_id" => $userData->id,
                "mp_usertoken" => $response['id']
            ]);
        }catch(Exception $e){
            //
        }

    }
}
