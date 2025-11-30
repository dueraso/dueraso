<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loyalty_points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('loyalty_members')->cascadeOnDelete();
            $table->enum('type', ['earn', 'redeem', 'adjust', 'expire', 'bonus']);
            $table->integer('points'); // positive or negative
            $table->integer('balance_after');
            $table->string('description');
            $table->string('reference_type')->nullable(); // order, reward, campaign, manual
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->foreignId('branch_id')->nullable()->constrained('branch')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['member_id']);
            $table->index(['type']);
            $table->index(['created_at']);
            $table->index(['expires_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loyalty_points');
    }
};
