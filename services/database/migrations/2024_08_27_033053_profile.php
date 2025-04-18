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
        Schema::create('avaliations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('from')->references('id')->on('users')->onDelete('cascade');
            $table->unsignedBigInteger('to')->references('id')->on('users')->onDelete('cascade');
            $table->unsignedBigInteger('deal')->references('id')->on('deals')->onDelete('cascade')->nullable();
            $table->integer('stars');
            $table->string('message',3000);
            $table->dateTime('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offered_services');
        Schema::dropIfExists('avaliations');
    }
};