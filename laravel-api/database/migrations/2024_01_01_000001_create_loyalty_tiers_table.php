<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loyalty_tiers', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Bronze, Silver, Gold, Platinum
            $table->integer('min_points')->default(0);
            $table->decimal('point_multiplier', 3, 1)->default(1.0); // 1.0, 1.2, 1.5, 2.0
            $table->decimal('discount_percent', 5, 2)->default(0);
            $table->string('color')->default('#CD7F32');
            $table->string('icon')->default('mdi-medal');
            $table->json('perks')->nullable(); // ["สะสมแต้มทุกการซื้อ", "ส่วนลด 5%"]
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loyalty_tiers');
    }
};
