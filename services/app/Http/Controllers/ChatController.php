<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chat;

class ChatController extends Controller
{
    public function sendMessage(Request $request){   
        $token = $request->header('Authorization');
        $from = $this->retrieveId($token);
        $to = $request->to;

        if(!$from) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);
        if(!$to) return response()->json(['success' => false, 'message' => 'Missing parameter.'], 400);
        if($from == $to) return response()->json(['success' => false, 'message' => 'Can not message yourself.'], 400);
        if(!$request->message) return response()->json(['success' => false, 'message' => 'Missing parameter.'], 400);

        $message = $this->sanitizeMessage($request->message);

        Chat::create([
            'from' => $from,
            'to' => $to,
            'message' => $message
        ]);

        return response()->json(['success' => true]);
    }

    public function getMessages($user_id, Request $request){  
        $token = $request->header('Authorization');
        if(!$token) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);

        $reader = $this->retrieveId($token);

        if($reader == $user_id) return response()->json(['success' => false, 'message' => 'Icorrect request.'], 400);

        $conversation = Chat::where(function($query) use ($reader, $user_id) {
            $query->where('from', $reader)->where('to', $user_id);
        })
        ->orWhere(function($query) use ($reader, $user_id) {
            $query->where('from', $user_id)->where('to', $reader);
        })
        ->orderBy('sent_at', 'asc')
        ->paginate(10);

        return response()->json($conversation);
    }

    private function sanitizeMessage($message){

        $emailPattern = '/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/';
        $urlPattern = '/(http|https|www)\S+/i';
        $phonePattern = '/\(?\d{2,3}\)?[\s-]?\d{4,5}[\s-]?\d{4}/';
        $socialPattern = '/@([A-Za-z0-9_]+)/';

        $message = preg_replace($emailPattern, '*****', $message);
        $message = preg_replace($urlPattern, '*****', $message);
        $message = preg_replace($phonePattern, '*****', $message);
        $message = preg_replace($socialPattern, '*****', $message);

        return $message;
    }

    
    
    
 
}
