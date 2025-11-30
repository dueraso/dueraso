<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LoyaltyReward;
use App\Models\LoyaltyTier;

class LoyaltyRewardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bronzeTier = LoyaltyTier::where('name', 'Bronze')->first();
        $silverTier = LoyaltyTier::where('name', 'Silver')->first();
        $goldTier = LoyaltyTier::where('name', 'Gold')->first();
        $platinumTier = LoyaltyTier::where('name', 'Platinum')->first();

        $rewards = [
            // Discounts
            [
                'name' => 'ส่วนลด 50 บาท',
                'description' => 'รับส่วนลด 50 บาท สำหรับการซื้อครั้งถัดไป',
                'type' => 'discount',
                'points_required' => 500,
                'value' => 50,
                'stock' => null,
                'min_tier_id' => null,
                'is_active' => true,
            ],
            [
                'name' => 'ส่วนลด 100 บาท',
                'description' => 'รับส่วนลด 100 บาท สำหรับการซื้อครั้งถัดไป',
                'type' => 'discount',
                'points_required' => 900,
                'value' => 100,
                'stock' => null,
                'min_tier_id' => null,
                'is_active' => true,
            ],
            [
                'name' => 'ส่วนลด 200 บาท',
                'description' => 'รับส่วนลด 200 บาท สำหรับการซื้อครั้งถัดไป',
                'type' => 'discount',
                'points_required' => 1700,
                'value' => 200,
                'stock' => null,
                'min_tier_id' => $silverTier?->id,
                'is_active' => true,
            ],
            [
                'name' => 'ส่วนลด 500 บาท',
                'description' => 'รับส่วนลด 500 บาท สำหรับการซื้อครั้งถัดไป',
                'type' => 'discount',
                'points_required' => 4000,
                'value' => 500,
                'stock' => null,
                'min_tier_id' => $goldTier?->id,
                'is_active' => true,
            ],

            // Vouchers
            [
                'name' => 'คูปองกาแฟฟรี',
                'description' => 'รับเครื่องดื่มกาแฟฟรี 1 แก้ว',
                'type' => 'voucher',
                'points_required' => 300,
                'value' => null,
                'stock' => 100,
                'min_tier_id' => null,
                'is_active' => true,
            ],
            [
                'name' => 'คูปองของหวานฟรี',
                'description' => 'รับของหวานฟรี 1 ชิ้น มูลค่าไม่เกิน 100 บาท',
                'type' => 'voucher',
                'points_required' => 600,
                'value' => 100,
                'stock' => 50,
                'min_tier_id' => null,
                'is_active' => true,
            ],

            // Products
            [
                'name' => 'แก้วน้ำ Limited Edition',
                'description' => 'แก้วน้ำรุ่นพิเศษ Limited Edition',
                'type' => 'product',
                'points_required' => 2000,
                'value' => null,
                'stock' => 20,
                'min_tier_id' => $silverTier?->id,
                'is_active' => true,
            ],
            [
                'name' => 'กระเป๋าผ้า Eco Bag',
                'description' => 'กระเป๋าผ้ารักษ์โลก',
                'type' => 'product',
                'points_required' => 1500,
                'value' => null,
                'stock' => 50,
                'min_tier_id' => null,
                'is_active' => true,
            ],

            // Services
            [
                'name' => 'บริการจัดส่งฟรี',
                'description' => 'รับบริการจัดส่งฟรี 1 ครั้ง',
                'type' => 'service',
                'points_required' => 400,
                'value' => null,
                'stock' => null,
                'min_tier_id' => null,
                'is_active' => true,
            ],
            [
                'name' => 'บริการ VIP Priority',
                'description' => 'รับบริการแบบ VIP ไม่ต้องรอคิว 1 ครั้ง',
                'type' => 'service',
                'points_required' => 3000,
                'value' => null,
                'stock' => null,
                'min_tier_id' => $goldTier?->id,
                'is_active' => true,
            ],
        ];

        foreach ($rewards as $reward) {
            LoyaltyReward::updateOrCreate(
                ['name' => $reward['name']],
                $reward
            );
        }
    }
}
