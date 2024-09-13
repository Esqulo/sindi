<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\NearbyController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\AvaliationController;
use Illuminate\Support\Facades\Route;

Route::resource('user', UserController::class);

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

Route::resource('avaliation', AvaliationController::class);
