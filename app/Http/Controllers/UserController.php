<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Exception;

// use App\Http\Controllers\MercadoPagoController;

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
                "address" => "required|string",
                "cep" => "required|string|regex:/^[0-9]+$/",
                "bio" => "sometimes|string",
            ]);

            if($validatedData['password']) $validatedData['password'] = $this->passwordIntoHash($validatedData['password']);

            if(!$validatedData) throw new Exception('invalid data');

            $user = User::create($validatedData);

            // $mercadoPagoController = new MercadoPagoController;
            // $mercadoPagoController->createMercadoPagoUser($user);

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
        $user = User::find($id);
        if(!$user) return response()->json(['message' => 'User not found'], 404);
        return $user;
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

    public function create(){
        return response()->json(['message' => 'not found'], 404);
    }
    public function edit(string $id){
        return response()->json(['message' => 'not found'], 404);
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
