<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['doc_number']);
            $table->string('doc_number')->nullable()->change();
            $table->unique('doc_number');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['doc_number']);
            $table->string('doc_number')->nullable(false)->change();
            $table->unique('doc_number');
        });
    }
};
