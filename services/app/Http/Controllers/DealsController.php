<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Deal;
use Exception;

use App\Http\Controllers\PurchasesController;

class DealsController extends Controller
{
    public function listDeals(Request $request){
       
        $userId = $this->retrieveId($request->header('Authorization'));
        if(!$userId) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);

        $page = (int) $request->query('page', 1);
        $perPage = 10;

        $deals = Deal::whereNull('counter_prev')
            ->where(function ($query) use ($userId) {
                $query->where('from', $userId)
                    ->orWhere('to', $userId);
            })
            ->orderBy('created_at', 'desc')
            ->forPage($page, $perPage)
            ->get();

        $dealsData = [];

        forEach($deals as $deal){

            $otherUserData = [];
             
            if($deal->from == $userId){
                $otherUserData = $this->getUserData($deal->to);
            }else if($deal->to == $userId){
                $otherUserData = $this->getUserData($deal->from);
            }

            switch ($deal->answer) {
                case 0:
                    $status = "recusado";
                    $last_update = $deal->answered_at;
                break;
                case 1:
                    $status = "aceito";
                    $last_update = $deal->answered_at;
                break;
                case 2:
                    $currentStatus = $this->getCurrentDealData($deal->id);
                    $status = $currentStatus->answer == 0 ? "recusado" : "aceito";
                    $last_update = $currentStatus->created_at;
                break;
                default:
                    $status = "pendente";
                    $last_update = $deal->created_at;
                break;
            }

            $dealsData[] = [
                'id' => $deal->id,
                'title' => $otherUserData->name ?? 'desconhecido',
                'image' => $otherUserData->avatar ?? null,
                'status' => $status ?? 'desconhecido',
                'last_update' => $last_update->format('d/m/Y H:i')?? 'desconhecido'
            ];
        }

        return [
            'data' => $dealsData
        ];
    }

    private function getCurrentDealData($dealId){

        $baseDeal = Deal::find($dealId);
        if($baseDeal->counter_next == null) return $baseDeal;

        $nextDeal = Deal::find($baseDeal->counter_next);
        $currentDeal = null;

        while($currentDeal == null){
            if($nextDeal->counter_next == null) $currentDeal = $nextDeal;
            else $nextDeal = Deal::find($nextDeal->counter_next);
        }
        
       return $currentDeal;

    }

    public function viewDealDetails(Request $request,int $id){

        $userId = $this->retrieveId($request->header('Authorization'));
        if(!$userId) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);

        $deal = Deal::find($id);

        if($deal->from != $userId && $deal->to != $userId) return response([
            'success' => false,
            'message' => 'not allowed'
        ], 403);

        $root_deal = $deal;

        while($root_deal->counter_prev != null){
            $root_deal = Deal::find($root_deal->counter_prev);
        }

        $current_deal = [];
        $temp_deal = $root_deal;
        $current_deal = $root_deal;
        $reached_end = false;

        while(!$reached_end){

            if($temp_deal->counter_next == null){
                $current_deal = $this->parseDealDetails($temp_deal);
                $reached_end = true;
            }else{
                $history[] = $this->parseDealDetails($temp_deal);
                $temp_deal = Deal::find($temp_deal->counter_next);
            } 

        }

        return [
            'current_deal'=> $current_deal,
            'history' => $history
        ];
    }

    private function parseDealDetails($deal){
        $response = [
            'id' => $deal->id,
            'from' => $this->getUserFullName($deal->from),
            'to' => $this->getUserFullName($deal->to),
            'message' => $deal->message,
            'value' => $deal->value,
            'answered_at' => $deal->answered_at->format('d/m/Y H:i') ?? null,
        ];

        switch ($deal->answer) {
            case 0:
                $response['status'] = "recusado";
            break;
            case 1:
                $response['status'] = "aceito";
            break;
            case 2:
                $response['status'] = "contraproposta";
            break;
            default:
                $response['status'] = "pendente";
            break;
        }

        return $response;
    }

    public function createDeal(Request $request){

        $userId = $this->retrieveId($request->header('Authorization'));
        if(!$userId) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);

        try{

            $validatedData = $request->validate([
                "value" => "required|numeric|min:0",
                "to" => "required|numeric|exists:users,id",
                "starts_at" => "required|date|after_or_equal:now",
                "expires_at" => "required|date",
                "place" => "sometimes|numeric|min:0|",
                "message" => "required|string",
            ]);

            $validatedData['from'] = $userId;
            $validatedData['hirer'] = $userId;
            $validatedData['worker'] = $validatedData['to'];

            if(!$validatedData) throw new Exception('invalid data',400);

            $this->runInsert($validatedData);

        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ],400);
        }

        return response()->json(true,201);
    }

    public function answerDeal(Request $request,int $dealId){
        try{
            $userId = $this->retrieveId($request->header('Authorization'));
            if(!$userId) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);

            $deal = Deal::find($dealId);

            if(!$deal) throw new Exception("deal not found.",404);

            if($deal->to != $userId) throw new Exception("not allowed",403);

            if($deal->answer != null) throw new Exception("already answered",409);

            $validatedData = $request->validate([
                "answer" => "required|numeric|min:0|max:2",
                "value" => "numeric|min:0|required_if:answer,2",
                "starts_at" => "date|after_or_equal:now|required_if:answer,2",
                "expires_at" => "date|required_if:answer,2",
                "place" => "sometimes|numeric|min:0",
                "message" => "string|required_if:answer,2",
            ]);
        
            switch($validatedData['answer']){
                case 0: //Denied: save denied
                    
                    $validatedData['answered_at'] = Carbon::now();

                    $this->runUpdate($dealId,$validatedData);

                    return response()->json([
                        "success" => true,
                    ],200);

                break;
                case 1: //Accepted: save accepted and create new purchase
                   
                    $alreadyMadeADeal = Deal::where('worker',$deal->worker)->where('answer',1)->first();
                    $validatedData['answered_at'] = Carbon::now();
                    
                    $this->runUpdate($dealId,$validatedData);

                    //Create a new payment to be processed later
                    $purchasesController = new PurchasesController;
                    $purchase = $purchasesController->createNewPurchase($deal->hirer);
                    $purchasesController->addProducts($purchase->id,[
                        [
                            'type' => 'deal',
                            'id' => $deal['id'],
                            'quantity' => 1,
                            'unit_price' => $deal['value'],
                            'fee_percentage' => $alreadyMadeADeal ? 0 : 100 //first deal has a 100% fee
                        ]
                    ]);

                    return response()->json([
                        "success" => true,
                    ],200);

                break;
                case 2: //Answered with a counter-deal: save and create the new deal

                    //must be inversed since it's a counter!
                    $validatedData['answer'] = null;
                    $validatedData['from'] = $userId;
                    $validatedData['to'] = $deal->from;
                    $validatedData['hirer'] = $deal->hirer;
                    $validatedData['worker'] = $deal->worker;
                    $validatedData['counter_prev'] = $deal->id;
                    
                    $newDeal = $this->runInsert($validatedData);
                    
                    $this->runUpdate($dealId,[
                        "answer" => 2,
                        'answered_at' => Carbon::now(),
                        "counter_next" => $newDeal->id
                    ]);
    
                    return response()->json([
                        "success" => true,
                    ],201);

                break;
                default:

                    throw new Exception("Invalid option.",400);

                break;
            }

        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage() ?? "solicitação inválida"
            ],$e->code ?? 400);
        }
    }

    private function runInsert($data){
        return Deal::create($data);
    }
    
    private function runUpdate($id,$data){
        $deal = Deal::find($id);
        $deal->update($data);
    }

    public function checkIfUserHasPendingDeals($userId){
        $hasPendingDeals = Deal::where('to', $userId)
            ->where('answer', null)
            ->where('created_at', '<=', Carbon::now()->subDays(env('LIMIT_DAYS_TO_ANWER_DEAL')))
            ->first();

        return (bool) $hasPendingDeals;
    }
}
