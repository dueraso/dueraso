<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loyalty_rewards', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['discount', 'percent', 'free_item', 'other']);
            $table->decimal('value', 10, 2)->default(0); // discount amount or percent
            $table->integer('points_required');
            $table->string('image')->nullable();
            $table->integer('stock')->nullable(); // null = unlimited
            $table->integer('redemption_count')->default(0);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->tinyInteger('status')->default(1);
            $table->timestamps();

            $table->index(['status']);
            $table->index(['points_required']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loyalty_rewards');
    }
};
