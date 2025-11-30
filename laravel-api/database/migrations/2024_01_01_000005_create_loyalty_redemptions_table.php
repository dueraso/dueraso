<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loyalty_redemptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('loyalty_members')->cascadeOnDelete();
            $table->foreignId('reward_id')->constrained('loyalty_rewards');
            $table->integer('points_used');
            $table->foreignId('branch_id')->nullable()->constrained('branch')->nullOnDelete();
            $table->unsignedBigInteger('order_id')->nullable();
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('completed');
            $table->timestamp('created_at')->useCurrent();

            $table->index(['member_id']);
            $table->index(['reward_id']);
            $table->index(['created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loyalty_redemptions');
    }
};
