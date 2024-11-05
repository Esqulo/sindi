<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\NearbyController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\AvaliationController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\MeetingsController;
use App\Http\Controllers\OfferedServicesController;
use App\Http\Controllers\PurchasesController;
use App\Http\Controllers\DealsController;
use Illuminate\Support\Facades\Route;

Route::resources([
    'user' => UserController::class,
    'product' => ProductsController::class,
    'meeting' => MeetingsController::class,
    'offeredservices' => OfferedServicesController::class
]);

Route::prefix('nearby')->group(function(){
    Route::get('users/{id}',[NearbyController::class, 'users']);
});

Route::prefix('auth')->group(function(){
    Route::post('login',[AuthController::class, 'login']);
    Route::match(['get','post'],'logout',[AuthController::class, 'logout']);
    Route::post('logoutFromAll',[AuthController::class, 'logoutFromAll']);
});

Route::prefix('chat')->group(function(){
    Route::get('/{user_id}',[ChatController::class, 'getMessages']);
    Route::post('send',[ChatController::class, 'sendMessage']);
});

Route::prefix('payment')->group(function(){
    Route::post('/new',[PurchasesController::class, 'newPurchase']);
    Route::get('/retrieve/{transaction_id}',[PurchasesController::class, 'retrieve']);
    Route::post('/update',[PurchasesController::class, 'updateStatus']);
});

Route::prefix('deal')->group(function(){
    Route::get('/',[DealsController::class, 'listDeals']);
    Route::get('/{id}',[DealsController::class, 'viewDealDetails']);
    Route::post('/create',[DealsController::class, 'createDeal']);
    Route::put('/answer/{id}',[DealsController::class, 'answerDeal']);
});

Route::prefix('avaliation')->group(function(){
    Route::get('/user/{id}',[AvaliationController::class, 'listUserAvaliations']);
    Route::get('/{id}',[AvaliationController::class, 'getAvaliationDetails']);
    Route::post('/new',[AvaliationController::class, 'newAvaliation']);
});
