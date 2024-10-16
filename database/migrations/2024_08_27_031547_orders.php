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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->float('price');
            $table->string('image');
            $table->string('description',3000);
            $table->boolean('active')->default(1);
            $table->integer('main_category')->nullable();
        });

        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_id',500)->nullable();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('no action');
            $table->dateTime('purchase_date')->useCurrent();
            $table->dateTime('payment_date')->nullable();
            $table->integer('payment_method')->nullable();
            $table->float('payment_value')->nullable();
            $table->string('payment_platform');
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreign('product_id')->references('id')->on('products')->onDelete('no action');
            $table->unsignedBigInteger('product_id');
            $table->foreign('purchase_id')->references('id')->on('purchases')->onDelete('no action');
            $table->unsignedBigInteger('purchase_id');
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
    }
};
