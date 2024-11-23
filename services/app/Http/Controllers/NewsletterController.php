<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Newsletter;
use Exception;


class NewsletterController extends Controller
{
    public function insert(Request $body){
        try{
            
            $validatedData = $body->validate([
                "email" => "required|email|unique:landing_page_users,email",
                "name" => "required|string",
                "phone" => "required|string|unique:landing_page_users,phone"
            ]);

            if(!$validatedData) throw new Exception('invalid data');

            Newsletter::create($validatedData);

        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ],400);
        }
    }
}
