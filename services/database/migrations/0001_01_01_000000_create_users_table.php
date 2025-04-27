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
            $table->integer('user_type');
            $table->boolean('is_admin')->default(0);
            $table->string('name');
            $table->string('email')->unique();
            $table->dateTime('email_verified_at')->nullable();
            $table->string('phone')->unique();
            $table->dateTime('phone_verified_at')->nullable();
            $table->date('birthdate');
            $table->string('avatar')->nullable();
            $table->string('doc_type',10);
            $table->string('doc_number')->unique();
            $table->string('id_number')->nullable();
            $table->string('password');
            $table->string('position')->nullable();
            $table->boolean('active')->default(1);
            $table->string('state');
            $table->string('city');
            $table->string('neighbourhood');
            $table->string('address');
            $table->string('number')->nullable();
            $table->string('complement')->nullable();
            $table->string('cep');
            $table->text('bio')->nullable();
            $table->integer('reviews_count')->nullable();
            $table->string('gender')->nullable();
            $table->string('marital_status')->nullable();
            $table->date('work_since')->nullable();
            $table->dateTime('last_accepted_terms')->nullable();
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('updated_at')->nullable()->useCurrentOnUpdate();
        });

        Schema::create('user_academic_data', function (Blueprint $table) {
            $table->id()->primary()->autoIncrement();
            $table->integer('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('graduation_level');
            $table->string('graduation_title');
            $table->date('achieved_at');
            $table->dateTime('created_at')->useCurrent();
        });
        
        Schema::create('work_fields', function (Blueprint $table) {
            $table->id()->primary()->autoIncrement();
            $table->integer('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('work_field');
            $table->boolean('highlight')->nullable()->default(1);
            $table->dateTime('created_at')->useCurrent();
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
