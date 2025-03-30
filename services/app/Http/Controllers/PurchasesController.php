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

        $items = $this->getProductsInfo($request['items']);
        if(!$items) return response()->json(['success' => false, 'message' => 'No valid product informed.'], 400);

        try{

            $purchase = $this->createNewPurchase($userId);

            $this->addProducts($purchase->id,$items);

            $dataForPayment = $this->generatePayment($purchase->id);

            return response()->json($dataForPayment,201);

        }catch(Exception $e){
            return $e;
            return response()->json(['success' => false, 'message' => 'Something unexpected happened, please try again.'],500);
        }

    }

    public function createNewPurchase($userId) {
        return Purchase::create([
            'user_id' => $userId
        ]);
    }

    public function addProducts($purchaseId,$products) {
        foreach($products as $item){  
            Order::create([
                'purchase_id' => $purchaseId,
                'product_type' => $item['type'],
                'product_id' => $item['id'],
                'quantity' => $item['quantity'],
                'current_unit_price' => $item['unit_price'],
                'current_fee_percentage' => $item['fee_percentage']
            ]);
        }
    }

    public function getPurchaseItems($purchaseId){
        
        $orders = Order::where('purchase_id',$purchaseId)->get()->toArray();

        $items = [];

        foreach ($orders as $order) {
            $items[] = [
                "id" => $order['product_id'],
                "quantity" => $order['quantity']
            ];
        }

        return $this->getProductsInfo($items);

    }

    public function generatePayment($purchaseId){

        $items = $this->getPurchaseItems($purchaseId);
        $fee = $this->calculateFee($items);
        $purchase = Purchase::find($purchaseId);
        $user = User::find($purchase->user_id);
       
        $preference = $this->createPaymentPreference($user,$items,$purchaseId,$fee);

        return $preference;

    }

    private function calculateFee($items){

        $totalAmount = 0;

        foreach($items as $item){
            $totalAmount += ($item['quantity'] * $item['unit_price']) * ($item['fee_percentage']/100);
        }
        
        return round($totalAmount, 2);

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
        
            $productInfo = Products::where('id',$product['id'])->where('active',1)->first();

            if ($productInfo) {
                $productsData[] = [
                    "type" => 'product',
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
