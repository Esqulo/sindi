<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chat;
use App\Models\ChatMessages;
use App\Models\ChatAccess;
use App\Models\User;

class ChatController extends Controller
{

    private function checkChatPermission($user_id,$chat_id){
        $hasAccess = ChatAccess::where('user_id', $user_id)->where('chat_id', $chat_id)->first();
        if($hasAccess) return true;
        return false;
    }

    public function createNewChat(Request $request){

        $token = $request->header('Authorization');
        $user_id = $this->retrieveId($token);

        if(!$user_id) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);

        $chat = Chat::create([
            'type' => '0'
        ]);

        ChatAccess::create([
            'user_id' => $user_id,
            'chat_id' => $chat->id
        ]);

        foreach($request->users as $user){
            ChatAccess::create([
                'user_id' => $user,
                'chat_id' => $chat->id
            ]);
        }

        return response()->json(true,201);
    }

    public function sendMessage(Request $request){
        $token = $request->header('Authorization');
        if(!$token) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);

        $user_id = $this->retrieveId($token);
        if(!$user_id) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);

        if(!$request->to || !$request->message) return response()->json(['success' => false, 'message' => 'Missing parameter.'], 400);

        $chat_id = Chat::where('id',$request->to)->first();
        $hasAccess = $this->checkChatPermission($user_id,$request->to);

        if(!$hasAccess || !$chat_id) return response()->json(['success' => false, 'message' => 'Conversation not found.'], 404);

        $message = $this->sanitizeMessage($request->message);

        ChatMessages::create([
            'from' => $user_id,
            'chat_id' => $request->to,
            'message' => $message
        ]);

        return response()->json(true,201);
    }

    private function getChatImage($chat_id, $requesting_user) {

        // $image = env('APP_URL')."/assets/images/icons/no-image-profile.png";
        $image = null;

        $chat = Chat::where('id', $chat_id)->first();
    
        if ($chat->type == 0) {

            $otherChatUser = ChatAccess::where('chat_id', $chat_id)
                ->where('user_id', '!=', $requesting_user)
                ->first();

            if ($otherChatUser){
                $user = User::where('id', $otherChatUser->user_id)->first();
                if($user->avatar){
                    $image = $user->avatar;
                }
            }
            
        } elseif ($chat->type == 1 && $chat->image) { 
            $image = $chat->image;
        }
    
        return $image;
    }

    private function getChatTitle($chat_id, $requesting_user) {

        $title = "";
        $chat = Chat::where('id', $chat_id)->first();
    
        if ($chat->type == 0) {

            $otherChatUser = ChatAccess::where('chat_id', $chat_id)
                ->where('user_id', '!=', $requesting_user)
                ->first();

            if ($otherChatUser){
                $user = User::where('id', $otherChatUser->user_id)->first();
                if($user->name){
                    $title = $user->name;
                }
            }
            
        } elseif ($chat->type == 1 && $chat->title) { 
            $title = $chat->title;
        }
    
        return $title;
    }

    private function getChatLastMessage($chat_id){
        if(!$chat_id) return '' ;
        $lastMessage = ChatMessages::where('chat_id',$chat_id)->orderByDesc('sent_at')->first();
        return $lastMessage ? $lastMessage->message : null;
    }

    public function getUserChats(Request $request){
        $token = $request->header('Authorization');
        if(!$token) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);

        $user_id = $this->retrieveId($token);
        if(!$user_id) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);

        $chatIds = ChatAccess::where('user_id', $user_id)->pluck('chat_id');

        $chats = Chat::whereIn('id', $chatIds)
            ->orderByDesc(
                ChatMessages::select('sent_at')
                ->whereColumn('chat_id', 'chat.id')
                ->latest()
                ->take(1)
            )
        ->paginate(10);

        $chats->transform(function ($chat) use ($user_id) {
            $chat->image = $this->getChatImage($chat->id, $user_id);
            $chat->last_message = $this->getChatLastMessage($chat->id);
            $chat->title = $this->getChatTitle($chat->id, $user_id);
            return $chat;
        });

        return response()->json($chats);
    }

    public function getChatMessages($chat_id, Request $request){  

        $token = $request->header('Authorization');
        $user_id = $this->retrieveId($token);

        if(!$user_id) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);

        $hasAccess = $this->checkChatPermission($user_id,$chat_id);

        if(!$hasAccess) return response()->json(['success' => false, 'message' => 'Conversation not found.'], 404);

        $beginDate = $request->begin_date;

        $query = ChatMessages::where('chat_id', $chat_id)->orderBy('sent_at', 'asc');

        if ($beginDate) {
            $query->where('sent_at', '>', $beginDate);
        }

        $conversation = $query->paginate(10);

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
