<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\Products;
use Illuminate\Http\Request;

use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Exceptions\MPApiException;

class PurchasesController extends Controller
{

    protected function authenticate(){
        $mpAccessToken = env('MERCADO_PAGO_ACCESS_TOKEN', '');
        MercadoPagoConfig::setAccessToken($mpAccessToken);
        MercadoPagoConfig::setRuntimeEnviroment(MercadoPagoConfig::LOCAL);
    }

    protected function createPreferenceRequest($items, $payer){
        $paymentMethods = [
            "excluded_payment_methods" => [],
            "installments" => 12,
            "default_installments" => 1
        ];

        $backUrls = [
            'success' => '127.0.0.1:80/sindi/success',
            'failure' => '127.0.0.1:80/sindi/fail'
        ];

        $request = [
            "items" => $items,
            "payer" => $payer,
            "payment_methods" => $paymentMethods,
            "back_urls" => $backUrls,
            "statement_descriptor" => "NAME_DISPLAYED_IN_USER_BILLING",
            "external_reference" => "1234567890",
            "expires" => false,
            "auto_return" => 'all',
        ];

        return $request;
    }

    public function createPaymentPreference(Request $request){

        $token = $request->header('Authorization');
        if(!$token) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);
        
        $userId = $this->retrieveId($token);
        if(!$userId) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);
        $user = $this->getUserInfo($userId);

        if(!$request['items']) return response()->json(['success' => false, 'message' => 'No product informed.'], 400);

        $this->authenticate();

        $items = $this->getProductsInfo($request['items']);

        $payer = array(
            "name" => $user->name,
            "email" => $user->email
        );

        $request = $this->createPreferenceRequest($items, $payer);
        
        $client = new PreferenceClient();

        try {
            $preference = $client->create($request);
            return response()->json($preference,201);
        } catch (MPApiException $error) {
            response()->json($error,500);
        }
    }

    private function getProductsInfo($products){

        $productsData = [];

        foreach ($products as $product) {
        
            $productInfo = Products::find($product['id']);

            if ($productInfo) {
                $productsData[] = [
                    "id" => $product['id'],
                    "title" => $productInfo->name,
                    "description" => $productInfo->description,
                    "currency_id" => "BRL",
                    "quantity" => $product['quantity'],
                    "unit_price" => $productInfo->price
                ];
            }
        }

        return $productsData;
        
    }

}
