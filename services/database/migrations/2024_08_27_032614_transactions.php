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
        Schema::create('deals', function (Blueprint $table) {
            $table->id();
            $table->float('value');
            $table->unsignedBigInteger('from')->references('id')->on('users')->onDelete('no action');
            $table->unsignedBigInteger('to')->references('id')->on('users')->onDelete('no action');
            $table->unsignedBigInteger('worker')->references('id')->on('users')->onDelete('no action');
            $table->unsignedBigInteger('hirer')->references('id')->on('users')->onDelete('no action');
            $table->dateTime('starts_at');
            $table->dateTime('expires_at');
            $table->integer('answer')->nullable();
            $table->dateTime('answered_at')->nullable();
            $table->unsignedBigInteger('counter_next')->references('id')->on('deals')->onDelete('no action')->nullable();
            $table->unsignedBigInteger('counter_prev')->references('id')->on('deals')->onDelete('no action')->nullable();
            $table->integer('place')->references('id')->on('places')->onDelete('set null')->nullable();
            $table->unsignedBigInteger('purchase_id')->references('id')->on('purchases')->onDelete('no action')->nullable();
            $table->text('message');
            $table->dateTime('created_at')->useCurrent();
        });
        
        Schema::create('meetings', function (Blueprint $table) {
            $table->id();
            $table->string('address');
            $table->integer('type');
            $table->dateTime('time');
            $table->unsignedBigInteger('from');
            $table->foreign('from')->references('id')->on('users')->onDelete('no action');
            $table->unsignedBigInteger('to');
            $table->foreign('to')->references('id')->on('users')->onDelete('no action');
            $table->dateTime('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deals');
        Schema::dropIfExists('meetings');
    }
};
