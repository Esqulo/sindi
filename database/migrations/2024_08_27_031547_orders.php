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
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreign('product_id')->references('id')->on('products')->onDelete('no action');
            $table->unsignedBigInteger('product_id');
            $table->foreign('purchase_id')->references('id')->on('purchases')->onDelete('no action');
            $table->unsignedBigInteger('purchase_id');
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreign('purchase_id')->references('id')->on('purchases')->onDelete('no action');
            $table->unsignedBigInteger('purchase_id');
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

    }
};
