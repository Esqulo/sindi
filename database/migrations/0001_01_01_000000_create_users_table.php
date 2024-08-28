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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('name');
            $table->string('doc_number')->unique();
            $table->string('phone')->unique();
            $table->string('password');
            $table->dateTime('email_verified_at')->nullable();
            $table->dateTime('phone_verified_at')->nullable();
            $table->rememberToken();
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('updated_at')->nullable()->useCurrentOnUpdate();
            $table->boolean('active')->default(1);
            $table->date('birthdate');
            $table->string('adress');
            $table->string('cep');
            $table->string('avatar');
            $table->text('bio');
            $table->integer('reviews_count');
        });
        
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->id()->primary()->autoIncrement();
            $table->integer('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('email');
            $table->string('token');
            $table->dateTime('expires_at');
            $table->dateTime('created_at')->useCurrent();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
