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
        Schema::create('places', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('owner_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            $table->string('neighbourhood')->nullable();
            $table->string('address')->nullable();
            $table->string('number')->nullable();
            $table->string('cep');
            $table->integer('units')->nullable();
            $table->string('coordinates')->nullable();
            $table->boolean('third_party_services')->default(0);
            $table->boolean('had_professional_trustee_before')->default(0);
        });

        Schema::create('place_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('place_id');
            $table->foreign('place_id')->references('id')->on('places')->onDelete('cascade');
            $table->string('file',1000);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('places');
        Schema::dropIfExists('place_images');
    }
};