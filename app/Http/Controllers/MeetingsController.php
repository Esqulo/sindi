<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Meeting;
use Exception;

class MeetingsController extends Controller
{
    
    public function index()
    {
        return response()->json(['success' => false, 'message' => 'not found'], 404);
    }

    public function store(Request $request)
    {
        $token = $request->header('Authorization');
        if(!$token) return response()->json(['success' => false, 'message' => 'Not allowed.'], 401);
        $user_id = $this->retrieveId($token);
        if(!$user_id) return response()->json(['success' => false, 'message' => 'Not allowed.'], 401);
        
        try{    
            
            $validatedData = $request->validate([
                "address" => "required|string",
                "type" => "required|numeric",
                "time" => "required|date|after_or_equal:now",
                "to" => "required|exists:users,id"
            ]);

            $validatedData['from'] = $user_id;

            Meeting::create($validatedData);

        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ],400);
        }

        return response()->json(true,201);

    }

    public function show(Request $request, string $id)
    {
        $token = $request->header('Authorization');
        if(!$token) return response()->json(['success' => false, 'message' => 'Not allowed.'], 401);
        $user_id = $this->retrieveId($token);
        if(!$user_id) return response()->json(['success' => false, 'message' => 'Not allowed.'], 401);
        
        $meeting = Meeting::find($id);

        if($meeting->from != $user_id && $meeting->to != $user_id){
            return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);
        }

        return $meeting;
    }

    public function update(Request $request, string $id)
    {
        $token = $request->header('Authorization');
        if(!$token) return response()->json(['success' => false, 'message' => 'Not allowed.'], 401);
        $user_id = $this->retrieveId($token);
        if(!$user_id) return response()->json(['success' => false, 'message' => 'Not allowed.'], 401);
        
        $meeting = Meeting::find($id);

        if($meeting->from != $user_id){
            return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);
        }

        try{
            $validatedData = $request->validate([
                "type" => "sometimes|numeric",
                "address" => "required_with:type|string",
                "time" => "sometimes|date|after_or_equal:now"
            ]);

            $meeting->update($validatedData);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ],400);
        }

        return response()->json(true,200);
    }

    public function destroy(Request $request, string $id)
    {
        $token = $request->header('Authorization');
        if(!$token) return response()->json(['success' => false, 'message' => 'Not allowed.'], 401);
        $user_id = $this->retrieveId($token);
        if(!$user_id) return response()->json(['success' => false, 'message' => 'Not allowed.'], 401);

        $meeting = Meeting::find($id);

        if($meeting->from != $user_id && $meeting->to != $user_id){
            return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);
        }

        $meeting->delete();

        return response()->json(true,200);
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
