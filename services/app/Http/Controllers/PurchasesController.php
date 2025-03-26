<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Purchase;
use App\Models\Products;
use App\Models\Payment;
use App\Models\Order;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Exceptions\MPApiException;

use Exception;
use DateTime;

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
                'user_id' => $user->id
            ]);

            foreach($items as $item){
                Order::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $item['id'],
                    'amount' => $item['quantity'],
                    'current_unit_price' => $item['unit_price'],
                    'current_fee_percentage' => $item['fee_percentage']
                ]);
            }

            $fee = $this->calculateFee($items);

            $preference = $this->createPaymentPreference($user,$items,$purchase->id,$fee);

            return response()->json($preference,201);

        }catch(Exception $e){
            return $items;
            return response()->json(['success' => false, 'message' => 'Something unexpected happened, please try again.'],500);
        }

    }

    private function calculateFee($items){

        $totalAmount = 0;

        foreach($items as $item){
            $totalAmount += ($item['quantity'] * $item['unit_price']) * ($item['fee_percentage']/100);
        }

        return $totalAmount;

    }

    protected function authenticate(){
        $mpAccessToken = env('MERCADO_PAGO_ACCESS_TOKEN', '');
        MercadoPagoConfig::setAccessToken($mpAccessToken);
        MercadoPagoConfig::setRuntimeEnviroment(MercadoPagoConfig::LOCAL);
    }

    protected function createPreferenceRequest($items, $payer, $purchase_id, $fee){
        
        $paymentMethods = [
            "excluded_payment_methods" => [],
            "installments" => 12,
            "default_installments" => 1
        ];

        $request = [
            "items" => $items,
            "marketplace_fee" => $fee,
            "payer" => $payer,
            "payment_methods" => $paymentMethods,
            "statement_descriptor" => "Sindi",
            "notification_url" => 'https://www.table4all.com.br/dev_api/estabelecimento/logger.php', //TODO
            "external_reference" => $purchase_id,
            "expires" => false,
        ];

        return $request;
    }

    public function createPaymentPreference($user,$items,$purchase_id,$fee = 0){

        $this->authenticate();

        $nameParts = explode(" ", trim($user->name), 2);

        $payer = array(
            "name" => $nameParts[0],
            "surname" => isset($nameParts[1]) ? $nameParts[1] : "",
            "email" => $user->email
        );

        $request = $this->createPreferenceRequest($items, $payer, $purchase_id, $fee);
        
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
                    "unit_price" => $productInfo->price,
                    "fee_percentage" => $productInfo->fee_percentage ?? 0
                ];
            }
        }

        return $productsData;
        
    }

    public function updateStatus(Request $request){
        
        $data = $request->all();
        
        if (isset($data['resource'])) {
            
            $orderData = Http::withToken(env('MERCADO_PAGO_ACCESS_TOKEN', ''))->get($data['resource']);
            $purchase = Purchase::find($orderData['external_reference']);

            preg_match('/merchant_orders\/(\d+)/', $data['resource'], $matches);
            $merchantOrderId = $matches[1];

            $purchase->update([
                "transaction_id" => $merchantOrderId
            ]);

            foreach ($orderData['payments'] as $orderPayment) {
                
                if($orderPayment['status'] != "approved") continue;

                $payment = Payment::where('payment_id',$orderPayment['id'])->first();
                $paymentDate = isset($orderPayment['date_approved']) ? (new DateTime($orderPayment['date_approved']))->format('Y-m-d H:i:s') : null;

                $paymentData = [
                    'purchase_id' => $purchase->id, 
                    'payment_id' => $orderPayment['id'],
                    'amount' => $orderPayment['total_paid_amount'],
                    'payment_date' => $paymentDate, 
                    'payment_platform' => 'mercado_pago',
                ];
            
                if ($payment) {
                    $payment->update($paymentData);
                } else {
                    Payment::create($paymentData);
                }
            }

        }

        return response()->json(['status' => 'success'], 200);
    }

    public function retrieve($transaction_id){
        $this->authenticate();
        $client = new PreferenceClient();
        $status = $client->get($transaction_id);
        return response()->json($status,200);
    }

}
