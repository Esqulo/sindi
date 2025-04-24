<?php

namespace App\Http\Controllers;

use Google\Client as GoogleClient;
use Carbon\Carbon;
use Google\Service\Calendar;
use Illuminate\Http\Request;
use App\Models\GoogleUserCredential;
use App\Models\User;
use Illuminate\Support\Facades\Http;

use Exception;

class GoogleController extends Controller
{
    public function redirectToGoogle(Request $request)
    {
        $client = new GoogleClient();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect'));
        $client->addScope(Calendar::CALENDAR);
        $client->setAccessType('offline');
        $client->setPrompt('consent');
        $authUrl = $client->createAuthUrl();
        return redirect()->away($authUrl);
    }

    public function handleGoogleCallback(Request $request)
    {
        $client = new GoogleClient();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect'));
    
        if (!$request->has('code')) return response()->json([
            'success' => false,
            'message' => 'missing token'
        ], 400);
        
        $token = $client->fetchAccessTokenWithAuthCode($request->code);
       
        if (!isset($token['access_token'])) return response()->json([
            'error' => 'Erro ao obter token de acesso'
        ], 500);

        try{
            $userId = $this->retrieveId($request->header('Authorization'));
        }catch(Exception $e){
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 401);
        }

        $this->syncCalendarAccount($userId,$token);

        return response()->json($token, 200);
    }

    public function syncCalendarAccount($user_id,$tokenData){

        $credential = $this->retrieveUserGoogleCredentials($user_id);

        if($credential){
            $credential->calendar_token = $tokenData['access_token'];
            $credential->calendar_expires_in = Carbon::now()->addSeconds($tokenData['expires_in'])->toDateTimeString();
            $credential->calendar_created_at = Carbon::now();
            $credential->save();
        }else{
            GoogleUserCredential::create([
                'user_id' => $user_id,
                'calendar_token' => $tokenData['access_token'],
                'calendar_refresh_token' => $tokenData['refresh_token'],
                'calendar_expires_in' => Carbon::now()->addSeconds($tokenData['expires_in'])->toDateTimeString(),
                'calendar_created_at' => Carbon::now()
            ]);
        }

    }

    public function listEvents(Request $request)
    {
        try{
            $userId = $this->validateUser($request);
        }catch(Exception $e){
            return response([
                'success' => false,
                'message' => $e->getMessage()
            ], 401);
        }
        
        $userGoogleCredentials = $this->retrieveUserGoogleCredentials($userId);

        if (!$userGoogleCredentials) {
            return response()->json(['error' => 'Google Credentials not found'], 401);
        }
    
        try {
            $client = new GoogleClient();
            $client->setAccessToken($userGoogleCredentials['calendar_token']);
            $calendarService = new Calendar($client);
            $calendarId = 'primary';
    
            $events = $calendarService->events->listEvents($calendarId)->getItems();

            return response()->json($events, 200);
        } catch (Exception $e) {
            if($e->getCode() == 401){
                try{
                    $this->refreshAccessToken($userGoogleCredentials);
                    $userGoogleCredentials = $this->retrieveUserGoogleCredentials($userId);
                    $client->setAccessToken($userGoogleCredentials['calendar_token']);
                    $events = $calendarService->events->listEvents($calendarId)->getItems();
                    return response()->json($events, 200);
                }catch(Exception $er){
                    return response()->json([
                        "success" => false,
                        "message" => "Failed at creating event after new auth.",
                        "details" => json_decode($er->getMessage(),true)
                    ], $er->getCode() ?: 500);
                }
            }else{
                $message = json_decode($e->getMessage(),true);
                return response()->json([
                    'error' => 'Falha ao listar eventos',
                    'details' => $message
                ], $e->getCode() ?: 500);
            }
        }
    }

    private function setEventData($data){

        $eventData = [];
        $from = User::find($data['from']);
        $to = User::find($data['to']);

        if(!$from || !$to) throw new Exception('guests required');

        if(isset($data['summary'])){
            $eventData['summary'] = $data['summary'];
        }else{
            $eventData['summary'] = "Sindi - Reunião com ".$from['name'];
        }

        if(!$data['location']) throw new Exception('location is required');
        $eventData['location'] = $data['location'];

        if(isset($data['description'])){
            $eventData['description'] = $data['description'];
        }else{
            $eventData['description'] = "Evento criado através do Sindi.";
        }

        if(!$data['time']) throw new Exception('time is required');
        $startDate = Carbon::parse($data['time'])->toRfc3339String();
        $endDate = Carbon::parse($data['time'])->addHour()->toRfc3339String();
        $eventData['start'] = [
            'dateTime' => $startDate,
            'timeZone' => 'America/Sao_Paulo',
        ];
        $eventData['end'] = [
            'dateTime' => $endDate,
            'timeZone' => 'America/Sao_Paulo',
        ];

        $eventData['attendees'] = [
            [
                'email' => $from['email'],
                'displayName' => $from['name'],
                'responseStatus' => 'accepted'
            ],
            [
                'email' => $to['email'],
                'displayName' => $to['name'],
                'responseStatus' => 'needsAction'
            ]
        ];
        
        return $eventData;
    }

    public function createEvent(Request $request, $data = [])
    {
        try{
            $userId = $this->validateUser($request);
        }catch(Exception $e){
            return response([
                'success' => false,
                'message' => $e->getMessage()
            ], 401);
        }

        $userGoogleCredentials = $this->retrieveUserGoogleCredentials($userId);

        if (!$userGoogleCredentials) return response()->json(['error' => 'Token não fornecido'], 401);
        
        try{
            if($data){
                $eventData = $this->setEventData([
                    'from' => $userId,
                    'to' => $data['to'],
                    'location' => $data['address'],
                    'time' => $data['time']
                ]);
            }else{
                $eventData = $this->setEventData([
                    'from' => $userId,
                    'to' => $request->to,
                    'summary' => $request->summary,
                    'location' => $request->address,
                    'time' => $request->time
                ]);
            }       
        }catch(Exception $e){
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ],400);
        }

        try {
            $this->executeCalendarInsert($userGoogleCredentials,$eventData);
        } catch (Exception $e) {
            
            $errorDetails = json_decode($e->getMessage(),true);

            if($e->getCode() == 401){
                try{
                    $this->refreshAccessToken($userGoogleCredentials);
                    $userGoogleCredentials = $this->retrieveUserGoogleCredentials($userId);
                    $this->executeCalendarInsert($userGoogleCredentials,$eventData);
                }catch(Exception $er){
                    return response()->json([
                        "success" => false,
                        "message" => "Failed at creating event after new auth.",
                        "details" => json_decode($er->getMessage(),true)
                    ], $er->getCode() ?: 500);
                }
            }else{
                return response()->json([
                    "success" => false,
                    "message" => "Failed at creating event",
                    "details" => $errorDetails
                ], $e->getCode() ?: 500);
            }
        }

        return response()->json(['success' => true], 201);
    }

    private function executeCalendarInsert($credentials,$event){

        $client = new GoogleClient();
        $client->setAccessToken($credentials['calendar_token']);

        $calendarService = new Calendar($client);

        $calendarId = 'primary';

        $event = new \Google\Service\Calendar\Event($event);

        $calendarService->events->insert($calendarId, $event);

    }

    function refreshAccessToken($tokenData)
    {
        $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'client_id' => env('GOOGLE_CLIENT_ID'),
            'client_secret' => env('GOOGLE_CLIENT_SECRET'),
            'refresh_token' => $tokenData['calendar_refresh_token'],
            'grant_type' => 'refresh_token',
        ]);

        if ($response->successful()) {
            $newCredentials = $response->json();
            $this->syncCalendarAccount($tokenData['user_id'],$newCredentials);
            return $newCredentials;
        } else {
            throw new Exception("Erro ao renovar o token: " . $response->body());
        }
    }

    public function retrieveUserGoogleCredentials($user_id){
        return GoogleUserCredential::where('user_id',$user_id)->first();
    }
}
