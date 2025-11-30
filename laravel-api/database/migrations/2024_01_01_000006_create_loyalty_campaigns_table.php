<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loyalty_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['multiplier', 'bonus', 'referral', 'birthday', 'spend_bonus']);
            $table->decimal('value', 10, 2); // multiplier or bonus points
            $table->string('icon')->default('mdi-star');
            $table->string('color')->default('#B27D41');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->integer('usage_count')->default(0);
            $table->tinyInteger('status')->default(1);
            $table->timestamps();

            $table->index(['status']);
            $table->index(['start_date', 'end_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loyalty_campaigns');
    }
};
