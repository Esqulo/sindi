<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Place;
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
                "place_name" => "required_if:user_type,0|string",
                "units" => "required_if:user_type,0|integer",
                "position" => "required_if:user_type,0|string",
                "doc_type" => "required|string",
                "doc_number" => "required|string|unique:users,doc_number",
                "id_number" => "required_if:user_type,1|string",
                "phone" => "required|string|unique:users,phone",
                "password" => "required|string|min:8|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/|regex:/[@$!%*#?&.;?,'\":{}\-\+\=`_^]/",
                "birthdate" => "required|date|after_or_equal:1900-01-01|before:now",
                "work_since" => "required_if:user_type,1|date|after_or_equal:1900-01-01|before:now",
                "cep" => "required|string|regex:/^[0-9]+$/",
                "state" => "required|string|max:2",
                "city" => "required|string",
                "neighbourhood" => "required|string",
                "address" => "required|string",
                "number" => "nullable|string",
                "complement" => "nullable|string",
                "user_type" => "required|integer|min:0|max:1",
                "terms" => "required|integer|min:1|max:1",
                "bio" => "sometimes|string"
            ]);
            
            $validatedData['last_accepted_terms'] = date("Y-m-d H:i:s");
            $validatedData['password'] = $this->passwordIntoHash($validatedData['password']);

            $user = User::create($validatedData);

            if($validatedData['user_type'] == 0){
                Place::create([
                    'name' => $validatedData['place_name'],
                    'owner_id' => $user->id,
                    'cep' => $validatedData['cep'],
                    'state' => $validatedData['state'],
                    'city' => $validatedData['city'],
                    'neighbourhood' => $validatedData['neighbourhood'],
                    'address' => $validatedData['address'],
                    'number' => $validatedData['number'],
                    'units' => $validatedData['units']
                ]);
            }

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
            'type' => $userData->user_type,
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

    public function getFullProfile(Request $request){
        
        $userId = $this->retrieveId($request->header('Authorization'));
        if(!$userId) return response()->json(['success' => false, 'message' => 'Not allowed.'], 403);

        $user = User::find($userId);

        $response = [
            "user_type" => $user->user_type,
            "name" => $user->name,
            "email" => $user->email,
            "phone" => $user->phone,
            "birthdate" => $user->birthdate->format('d/m/Y'),
            "avatar" => $user->avatar,
            "doc_type" => $user->doc_type,
            "doc_number" => $user->doc_number,
            "id_number" => $user->id_number,
            "position" => $user->position,
            "state" => $user->state,
            "city" => $user->city,
            "neighbourhood" => $user->neighbourhood,
            "address" => $user->address,
            "number" => $user->number,
            "complement" => $user->complement,
            "cep" => $user->cep,
            "bio" => $user->bio,
            "work_since" => $user->work_since,
        ];

        if($user->user_type === 0){
            $place = Place::where('owner_id',$userId)->first();
            $response = array_merge($response,[
                "place_name" => $place->name,
                "place_units" => $place->units
            ]);
        }

        return response()->json($response);

    }

    public function updateUserData(Request $request){
        try{
            $userId = $this->retrieveId($request->header('Authorization'));
            if(!$userId) throw new Exception('Not allowed.', 403);

            $user = User::find($userId);
            $validatedData = $request->validate([
                "place_name" => "sometimes|string",
                "units" => "sometimes|integer",
                "position" => "sometimes|string",
                "phone" => "sometimes|string",
                "password" => "sometimes|string|min:8|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/|regex:/[@$!%*#?&.;?,'\":{}\-\+\=`_^]/",
                "cep" => "sometimes|string|regex:/^[0-9]+$/",
                "state" => "sometimes|string|max:2",
                "city" => "sometimes|string",
                "neighbourhood" => "sometimes|string",
                "address" => "sometimes|string",
                "number" => "sometimes|string",
                "complement" => "sometimes|string",
                "bio" => "sometimes|string"
            ]);

            if (isset($validatedData['password'])) {
                $validatedData['password'] = $this->passwordIntoHash($validatedData['password']);
            }
    
            $user->update($validatedData);
    
            return response()->json([
                "success" => true,
                "message" => "Dados atualizados com sucesso."
            ], 200);

        }catch(Exception $e){
            return response()->json([
                "success" => false,
                "message" => $e->getMessage() ?? "Erro inesperado."
            ], $e->getCode() ?: 500);
        }
    }

    public function updateUserAvatar(Request $request){
        try{
            $userId = $this->retrieveId($request->header('Authorization'));
            if(!$userId) throw new Exception('Not allowed.', 403);

            $request->validate([
                'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);

            if ($request->hasFile('avatar')) {
                $avatarPath = $request->file('avatar')->store('avatars', 'public');

                $user = User::find($userId);
                $user->avatar = env('APP_URL').'/services/storage/app/public/'. $avatarPath;
                $user->save();

                return response()->json(['message' => 'Avatar atualizado com sucesso!']);
            }

        }catch(Exception $e){
            return response()->json([
                "success" => false,
                "message" => $e->getMessage() ?? "Erro inesperado."
            ], $e->getCode() ?: 500);
        }
    }
}
