<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\NearbyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::resource('user', UserController::class);

Route::prefix('nearby')->group(function(){
    Route::get('users/{id}',[NearbyController::class, 'users']);
});