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
        Schema::create('chat', function (Blueprint $table) {
            $table->id();
            $table->string('title',100)->nullable();
            $table->integer('type');
            $table->string('image')->nullable();
            $table->dateTime('created_at')->useCurrent();
        });

        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('chat_id');
            $table->foreign('chat_id')->references('id')->on('chat')->onDelete('no action');
            $table->unsignedBigInteger('from');
            $table->foreign('from')->references('id')->on('users')->onDelete('no action');
            $table->dateTime('sent_at')->useCurrent();
            $table->string('message',2000);
        });

        Schema::create('chat_access', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('no action');
            $table->unsignedBigInteger('chat_id');
            $table->foreign('chat_id')->references('id')->on('chat')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat');
    }
};
