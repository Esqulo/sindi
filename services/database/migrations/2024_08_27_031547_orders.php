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
        //Store products
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->float('price');
            $table->float('fee_percentage')->nullable();
            $table->string('image')->nullable();
            $table->string('description',3000);
            $table->boolean('active')->default(1);
            $table->unsignedBigInteger('user_id')->nullable();//Can be a offered by Sindi, wich means null user_id
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->integer('main_category')->nullable();
        });
        //Store user purchases
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_id',500)->nullable();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('no action');
            $table->dateTime('purchase_date')->useCurrent();
        });
        //Store items inside purchases
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreign('purchase_id')->references('id')->on('purchases')->onDelete('no action');
            $table->unsignedBigInteger('purchase_id');
            $table->string('product_type',10);
            $table->unsignedBigInteger('product_id');
            $table->integer('quantity');
            $table->float('current_unit_price');
            $table->float('current_fee_percentage');
        });
        //Store Purchases payments 
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('purchase_id');
            $table->foreign('purchase_id')->references('id')->on('purchases')->onDelete('no action');
            $table->string('payment_id',150);
            $table->float('amount');
            $table->dateTime('payment_date');
            $table->string('payment_method',20);
            $table->string('payment_platform',25);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
        Schema::dropIfExists('purchases');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('payments');
    }
};
