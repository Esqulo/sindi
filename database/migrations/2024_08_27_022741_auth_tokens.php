<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('auth', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('token');
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('expires_at')->nullable();
        });
        
        Schema::create('phone_confirmation_codes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('code');
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('expires_at')->nullable();
            $table->boolean('already_used')->default(0);
            $table->boolean('expired_by_another')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auth');
        Schema::dropIfExists('phone_confirmation_codes');
    }
};