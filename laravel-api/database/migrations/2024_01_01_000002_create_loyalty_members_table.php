<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loyalty_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('member_code', 20)->unique();
            $table->string('name');
            $table->string('phone', 15)->unique();
            $table->string('email')->nullable();
            $table->date('birthday')->nullable();
            $table->foreignId('tier_id')->default(1)->constrained('loyalty_tiers');
            $table->integer('points')->default(0);
            $table->integer('total_points_earned')->default(0);
            $table->integer('total_points_used')->default(0);
            $table->decimal('total_spent', 12, 2)->default(0);
            $table->string('referral_code', 10)->unique();
            $table->foreignId('referred_by')->nullable()->constrained('loyalty_members')->nullOnDelete();
            $table->tinyInteger('status')->default(1); // 1=active, 0=inactive
            $table->text('note')->nullable();
            $table->foreignId('branch_id')->nullable()->constrained('branch')->nullOnDelete();
            $table->timestamps();

            $table->index(['phone']);
            $table->index(['member_code']);
            $table->index(['tier_id']);
            $table->index(['status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loyalty_members');
    }
};
