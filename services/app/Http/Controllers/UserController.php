<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\MailSender;
use Exception;

use App\Http\Controllers\MercadoPagoController;
use App\Models\Avaliation;
use App\Models\Products;

class UserController extends Controller
{

    public function index()
    {
        return User::where('active', true)->paginate(20);
    }

    public function store(Request $body)
    {

        try{
            $validatedData = $body->validate([
                "email" => "required|email|unique:users,email",
                "name" => "required|string",
                "doc_number" => "required|string|unique:users,doc_number",
                "phone" => "required|string|unique:users,phone",
                "password" => "required|string|min:8|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/|regex:/[@$!%*#?&.;?,'\":{}\-\+\=`_^]/",
                "birthdate" => "required|date|after_or_equal:1900-01-01|before:now",
                "state" => "required|string|max:2",
                "city" => "required|string",
                "neighbourhood" => "required|string",
                "address" => "required|string",
                "number" => "required|string",
                "complement" => "nullable|string",
                "user_type" => "required|integer|min:0|max:1",
                "terms" => "required|integer|min:1|max:1",
                "cep" => "required|string|regex:/^[0-9]+$/",
                "bio" => "sometimes|string",
            ]);
            
            $validatedData['last_accepted_terms'] = date("Y-m-d H:i:s");

            if($validatedData['password']) $validatedData['password'] = $this->passwordIntoHash($validatedData['password']);

            if(!$validatedData) throw new Exception('invalid data');

            $user = User::create($validatedData);

            $mailSender = new MailSender();
            $mailSender->sendEmailConfirmation($user->id);
            
            $mercadoPagoController = new MercadoPagoController;
            $mercadoPagoController->createMercadoPagoUser($user);

        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ],400);
        }

        return response()->json(true,201);
    }

    public function show(Request $request, $id)
    {
        $requesterId = $this->retrieveId($request->header('Authorization'));

        $response = [];

        //if not logged and not requesting anything send to home
        if(!$requesterId && !$id) {
            $response = [
                'success' => true,
                'action' => 'redirectToHome'
            ];

            return response()->json($response, 200);
        }

        $userToFind = 0;

        //if not logged but requested a profile, retrieve it
        if($id > 0) {
            $userToFind = $id;
        }

        //if logged and not requesting anything, return logged user
        if(($requesterId == $id) || ($requesterId && !$id) ) {
            $userToFind = $requesterId;
            $response = [
                'userIsOwner' => true
            ];
        }

        $userData = User::where('id', $userToFind)
            ->where('active', 1)
            ->first();

        if(!$userData) return response()->json(['message' => 'User not found'], 404);

        $services = Products::where('user_id', $userToFind)
            ->where('active', 1)
            ->get();

        $userRating = Avaliation::where('to', $userToFind)
            ->selectRaw('AVG(stars) as rating')
            ->first();

        $response = array_merge($response, [
            'id' => $userData->id,
            'name' => $userData->name,
            'rating' => $userRating->rating ?? 0,
            'reviews' => $userData->reviews_count,
            'avatar' => $userData->avatar,
            'highlight' => false, //future feature
            'bio' => $userData->bio,
            'services' => $services
        ]);

        return response()->json($response, 200);
    }

    public function update(string $id, Request $request)
    {                
        $token = $request->header('Authorization');
        if(!$token) return response()->json(['message' => 'Credentials are required'], 401);
        
        $hasAccess = $this->checkModifyPermission($token,$id);
        if(!$hasAccess) return response()->json(['message' => 'not allowed'], 403);

        $user = User::find($id);
        if(!$user) return response()->json(['message' => 'invalid data'], 404);
        
        try{
            $validatedData = $request->validate([
                "email" => "sometimes|email|unique:users,email,$id",
                "phone" => "sometimes|string|unique:users,phone,$id",
                "password" => "sometimes|string|min:8|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/|regex:/[@$!%*#?&.;?,'\":{}\-\+\=`_^]/",
                "address" => "sometimes|string",
                "cep" => "sometimes|string",
                "bio" => "sometimes|string",
            ]);

            if($validatedData['password']) $validatedData['password'] = $this->passwordIntoHash($validatedData['password']);

            if(!$validatedData) throw new Exception('invalid data');

            $user->update($validatedData);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ],400);
        }
        
        return response()->json(true);
    }

    public function destroy(string $id, Request $request)
    {
        $token = $request->header('Authorization');
        if(!$token) return response()->json(['message' => 'Credentials are required'], 401);
        
        $hasAccess = $this->checkModifyPermission($token,$id);
        if(!$hasAccess) return response()->json(['message' => 'not allowed'], 403);

        $user = User::find($id);
        if(!$user) return response()->json(['message' => 'User not found'], 404);

        $user->active = false;
        $user->save();

        return response()->json(true);
    }

    private function checkModifyPermission($token,$item){
        if (preg_match('/Bearer\s(\S+)/', $token, $matches)) $token = $matches[1];
        if(!$this->userIsAdmin($token) && $this->retrieveId($token) != $item) return false;
        return true;
    }

    private function passwordIntoHash($password){
        return password_hash($password, PASSWORD_BCRYPT);
    }
}
