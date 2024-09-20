<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Products;
use Exception;


class ProductsController extends Controller
{
    public function index()
    {
        return Products::where('active', true)->paginate(20);
    }

    public function store(Request $request)
    {
        $token = $request->header('Authorization');

        if(!$token || !$this->userIsAdmin($token)) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);

        try{

            $validatedData = $request->validate([
                "name" => "required|string",
                "price" => "required|numeric|min:0",
                "description" => "required|string",
                "active" => "sometimes|boolean",
                "main_category" => "sometimes|integer",
            ]);

            Products::create($validatedData);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ],400);
        }

        return response()->json(true,201);
    }

    public function show(int $id)
    {
        $product = Products::find($id);
        if(!$product) return response()->json(['message' => 'Product not found'], 404);
        return $product;
    }

    public function update(Request $request, int $id)
    {
        $token = $request->header('Authorization');

        if(!$token || !$this->userIsAdmin($token)) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);
       
        $product = Products::find($id);
        if(!$product) return response()->json(['message' => 'invalid data'], 404);

        try{
            $validatedData = $request->validate([
                "name" => "sometimes|string",
                "price" => "sometimes|numeric|min:0",
                "description" => "sometimes|string",
                "active" => "sometimes|boolean",
                "main_category" => "sometimes|integer",
            ]);

            $product->update($validatedData);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ],400);
        }

        return response()->json(true,200);
    }

    public function destroy(int $id, Request $request)
    {
        $token = $request->header('Authorization');
        if(!$token || !$this->userIsAdmin($token)) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);

        $product = Products::find($id);
        if(!$product) return response()->json(['message' => 'invalid data'], 404);
       
        $product->active = false;
        $product->save();

        return response()->json(true);
    }

    public function edit(string $id)
    {
        return response()->json(['success' => false, 'message' => 'not found'], 404);
    }

    public function create()
    {
        return response()->json(['success' => false, 'message' => 'not found'], 404);
    }
}
