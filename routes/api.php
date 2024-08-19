<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('test')->group(function(){    
    Route::get('/', function (Request $request) {
        return "hello world";
    });
    
    Route::post('/teste', function (Request $request) {
        return $request->hello;
    });
});