<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OfferedServices;
use Exception;


class OfferedServicesController extends Controller
{

    public function store(Request $request)
    {
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
                "name" => "required|string",
                "description" => "required|string",
                "price" => "required|numeric|min:0"
            ]);

            OfferedServices::create([
                'user_id' => $userId,
                'name' => $validatedData['name'],
                'description' => $validatedData['description'],
                'price' => $validatedData['price']
            ]);

        }catch(Exception $e){
            return response([
                "success" => false,
                "message" => $e->getMessage()
            ],400);
        }

        return response(['success'=>true],201);

    }

    public function show(int $id,Request $request)
    {
        try{
            $userId = $this->validateUser($request);
        }catch(Exception $e){
            return response([
                'success' => false,
                'message' => $e->getMessage()
            ], 401);
        }

        $service = OfferedServices::find($id);

        if(!$service) return response([
            "success" => false,
            "message" => "item not found"
        ],404);

        return response($service,200);
    }

    public function update(Request $request, string $id)
    {
        try{
            $userId = $this->validateUser($request);
        }catch(Exception $e){
            return response([
                'success' => false,
                'message' => $e->getMessage()
            ], 401);
        }

        $service = OfferedServices::find($id);

        if(!$service || $service->active == 0) return response([
            "success" => false,
            "message" => "item not found"
        ],404);

        if($userId != $service->user_id) return response([
            "success" => false,
            "message" => "not allowed"
        ],403);

        try{

            $validatedData = $request->validate([
                "description" => "sometimes|string",
                "price" => "sometimes|numeric|min:0",
                "active" => "sometimes|boolean"
            ]);

            $service->update($validatedData);

        }catch(Exception $e){
            return response([
                "success" => false,
                "message" => $e->getMessage()
            ],400);
        }

        return response(['success'=>true],200);
    }

    public function destroy(Request $request, string $id)
    {
        try{
            $userId = $this->validateUser($request);
        }catch(Exception $e){
            return response([
                'success' => false,
                'message' => $e->getMessage()
            ], 401);
        }

        $service = OfferedServices::find($id);

        if(!$service || $service->active == 0) return response([
            "success" => false,
            "message" => "item not found"
        ],404);

        if($userId != $service->user_id) return response([
            "success" => false,
            "message" => "not allowed"
        ],403);


        $service->active = 0;
        $service->save();


        return response(['success'=>true],200);
    }
}
