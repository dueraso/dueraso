<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loyalty_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Insert default settings
        DB::table('loyalty_settings')->insert([
            ['key' => 'system_enabled', 'value' => '1', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'points_per_baht', 'value' => '10', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'point_expire_days', 'value' => '365', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'min_purchase_for_points', 'value' => '0', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'max_points_per_transaction', 'value' => '0', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'enable_rounding', 'value' => '1', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'enable_birthday_bonus', 'value' => '1', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'birthday_bonus_points', 'value' => '100', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'enable_referral', 'value' => '1', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'referral_points', 'value' => '50', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('loyalty_settings');
    }
};
