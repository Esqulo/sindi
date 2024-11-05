<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Deal;
use Exception;

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
        try{
            $userId = $this->validateUser($request);
        }catch(Exception $e){
            return response([
                'success' => false,
                'message' => $e->getMessage()
            ], 401);
        }

        try{

            $validatedData = $request->validate([
                "value" => "required|numeric|min:0",
                "to" => "required|numeric|exists:users,id",
                "starts_at" => "required||date|after_or_equal:now",
                "expires_at" => "required|date",
                "place" => "sometimes|numeric|min:0|",
                "message" => "required|string",
            ]);

            $validatedData['from'] = $userId;
            $validatedData['worker'] = $validatedData['to'];

            if(!$validatedData) throw new Exception('invalid data');

            $this->runInsert($validatedData);

        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ],400);
        }

        return response()->json(true,201);
    }

    public function answerDeal(Request $request,int $id){
        try{
            $userId = $this->validateUser($request);
        }catch(Exception $e){
            return response([
                'success' => false,
                'message' => $e->getMessage()
            ], 401);
        }

        $deal = Deal::find($id);

        if(!$deal) return response([
            'success' => false,
            'message' => 'deal not found'
        ], 404);

        if($deal->to != $userId) return response([
            'success' => false,
            'message' => 'not allowed'
        ], 403);

        if($deal->answer != null) return response([
            'success' => false,
            'message' => 'already answered'
        ], 409);
        

        try{
            if($request['answer'] == 2){    
                $validatedData = $request->validate([
                    "answer" => "required|numeric|min:0|max:2",
                    "value" => "required|numeric|min:0",
                    "starts_at" => "required||date|after_or_equal:now",
                    "expires_at" => "required|date",
                    "place" => "sometimes|numeric|min:0|",
                    "message" => "required|string",
                ]);

                //must be inversed since it's a counter!
                $validatedData['answer'] = null;
                $validatedData['from'] = $userId;
                $validatedData['to'] = $deal->from;
                $validatedData['worker'] = $deal->worker;
                $validatedData['counter_prev'] = $deal->id;
                
                $newDeal = $this->runInsert($validatedData);
                
                $this->runUpdate($id,[
                    "answer" => 2,
                    'answered_at' => Carbon::now(),
                    "counter_next" => $newDeal->id
                ]);

                return response()->json([
                    "success" => true,
                ],201);

            }else{
                $validatedData = $request->validate([
                    "answer" => "required|numeric|min:0|max:2"
                ]);
                $validatedData['answered_at'] = Carbon::now();
                $this->runUpdate($id,$validatedData);

                return response()->json([
                    "success" => true,
                ],200);
            }
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ],400);
        }
    }

    private function runInsert($data){
        return Deal::create($data);
    }
    
    private function runUpdate($id,$data){
        $deal = Deal::find($id);
        $deal->update($data);
    }
}
