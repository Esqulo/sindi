<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Avaliation;

class AvaliationController extends Controller
{

    public function store(Request $request)
    {
        //
    }

    public function show(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }

    public function index()
    {
        return response()->json(['success' => false, 'message' => 'not found'], 404);
    }

    public function edit(string $id)
    {
        return response()->json(['success' => false, 'message' => 'not found'], 404);
    }

    public function create()
    {
        return response()->json(['success' => false, 'message' => 'not found'], 404);
    }

}
