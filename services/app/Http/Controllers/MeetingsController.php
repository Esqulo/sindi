<?php

namespace App\Http\Controllers;

use App\Http\Controllers\GoogleController;
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

            $sindi_event_result['success'] = false;
            $google_event_result['success'] = false;
            
            $validatedData = $request->validate([
                "address" => "required|string",
                "type" => "required|numeric",
                "time" => "required|date|after_or_equal:now",
                "to" => "required|exists:users,id",
                "setGoogleCalendar" => "sometimes|boolean"
            ]);

            $validatedData['from'] = $user_id;
            
            if($validatedData['setGoogleCalendar']){
                try{
                    $this->createGoogleCalendarEvent($request,$validatedData);
                    $google_event_result['success'] = true;
                }catch(Exception $er){
                    $google_event_result['message'] = $er->getMessage();
                }
            }
            
            Meeting::create($validatedData);
            $sindi_event_result['success'] = true;
            
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ],400);
        }

        return response()->json([
            "success" => true,
            "sindi_event" => $sindi_event_result,
            "google_event" => $google_event_result
        ],201);

    }

    public function createGoogleCalendarEvent($credentials,$data)
    {
        return app(GoogleController::class)->createEvent($credentials,$data);
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
