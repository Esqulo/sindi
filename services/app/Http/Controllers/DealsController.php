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
        try{
            $userId = $this->validateUser($request);
        }catch(Exception $e){
            return response([
                'success' => false,
                'message' => $e->getMessage()
            ], 401);
        }
        
        return Deal::where('from', $userId)
                ->orWhere('to', $userId)
                ->where('expires_at', '>=', Carbon::now())
                ->orderBy('created_at', 'desc') 
                ->paginate(10);
    }

    public function viewDealDetails(Request $request,int $id){
        try{
            $userId = $this->validateUser($request);
        }catch(Exception $e){
            return response([
                'success' => false,
                'message' => $e->getMessage()
            ], 401);
        }

        $deal = Deal::find($id);

        if($deal->from != $userId && $deal->to != $userId){
            return response([
                'success' => false,
                'message' => 'not allowed'
            ], 403);
        }

        return $deal;
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
