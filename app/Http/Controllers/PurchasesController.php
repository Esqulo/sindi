<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\User;
use App\Models\Products;
use App\Models\Order;
use Illuminate\Http\Request;

use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Exceptions\MPApiException;

use Exception;

class PurchasesController extends Controller
{
    public function newPurchase(Request $request){

        $token = $request->header('Authorization');
        if(!$token) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);
        
        $userId = $this->retrieveId($token);
        if(!$userId) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);
        $user = User::find($userId);

        if(!$request['items']) return response()->json(['success' => false, 'message' => 'No product informed.'], 400);

        $items = $this->getProductsInfo($request['items']);

        try{
            $purchase = Purchase::create([
                'user_id' => $user->id,
                'payment_platform' => 'mercado_pago'
            ]);

            foreach($items as $item){
                Order::create([
                    'product_id' => $item['id'],
                    'purchase_id' => $purchase->id
                ]);
            }

            $preference = $this->createPaymentPreference($user,$items,$purchase->id);

            $purchase->update([
                'transaction_id' => $preference->id
            ]);

            return response()->json($preference,201);

        }catch(Exception $e){
            return response()->json(['success' => false, 'message' => 'Something unexpected happened, please try again.'],500);
        }

    }

    protected function authenticate(){
        $mpAccessToken = env('MERCADO_PAGO_ACCESS_TOKEN', '');
        MercadoPagoConfig::setAccessToken($mpAccessToken);
        MercadoPagoConfig::setRuntimeEnviroment(MercadoPagoConfig::LOCAL);
    }

    protected function createPreferenceRequest($items, $payer, $purchase_id){
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
            "statement_descriptor" => "Compra em Sindi",
            "external_reference" => $purchase_id,
            "expires" => false,
            "auto_return" => 'all',
        ];

        return $request;
    }

    public function createPaymentPreference($user,$items,$purchase_id){

        $this->authenticate();

        $payer = array(
            "name" => $user->name,
            "email" => $user->email
        );

        $request = $this->createPreferenceRequest($items, $payer, $purchase_id);
        
        $client = new PreferenceClient();

        try {
            $preference = $client->create($request);
            return $preference;
        } catch (MPApiException $error) {
            return response()->json($error,500);
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
