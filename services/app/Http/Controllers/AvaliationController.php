<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Avaliation;
use App\Models\User;
use App\Models\Deal;
use Exception;

class AvaliationController extends Controller
{

    public function listUserAvaliations(Request $request, int $id){
        try{
            $userId = $this->validateUser($request);
        }catch(Exception $e){
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 401);
        }

        if(!User::find($id)) return response()->json([
            'success' => false,
            'message' => 'user does not exists'
        ],404);
        

        $avaliations = Avaliation::where('to', $id)->get();

        return response()->json($avaliations, 200);
    }

    public function getAvaliationDetails(Request $request, string $id){
        try{
            $userId = $this->validateUser($request);
        }catch(Exception $e){
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 401);
        }

        $avaliationDetails = Avaliation::find($id);

        if(!$avaliationDetails) return response()->json([
            'success' => false,
            'message' => 'avaliation does not exists'
        ],404);
        
        
        return response()->json($avaliationDetails, 200);
    }

    public function newAvaliation(Request $request){
        try{
            $userId = $this->validateUser($request);
        }catch(Exception $e){
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 401);
        }

        try{

            if(Avaliation::where('deal',$request->deal)->exists()) throw new Exception("already avaliated",409);

            $validatedData = $request->validate([
                "deal" => "required|numeric|exists:deals,id",
                "stars" => "required|integer|min:1|max:5",
                "message" => "required|string|max:3000"
            ]); 

            $dealData = Deal::find($validatedData['deal']);
            
            if($dealData['answer'] != 1) throw new Exception("cannot avaliate this deal",409);
            if($dealData['expires_at'] >= Carbon::now()) throw new Exception("cannot avaliate a deal before it expires",409);

            $validatedData['from'] = $dealData['hirer'];
            $validatedData['to'] = $dealData['worker'];

            Avaliation::create($validatedData);

        } catch (Exception $e) {
            $statusCode = $e->getCode();

            if (empty($statusCode)) {
                $statusCode = 400;
            } elseif (!is_int($statusCode) || $statusCode < 100 || $statusCode > 599) {
                $statusCode = 500;
            }

            return response()->json([
                "success" => 'false',
                "message" => $e->getMessage()
            ],$statusCode);
        }

        return response()->json(true,201);
    }

}
