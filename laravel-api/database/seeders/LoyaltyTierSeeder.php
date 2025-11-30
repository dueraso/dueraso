<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LoyaltyTier;

class LoyaltyTierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tiers = [
            [
                'name' => 'Bronze',
                'min_points' => 0,
                'max_points' => 999,
                'multiplier' => 1.0,
                'color' => '#CD7F32',
                'icon' => 'mdi-medal',
                'perks' => [
                    'สะสมแต้ม 1 แต้มต่อ 10 บาท',
                    'รับส่วนลดวันเกิด 5%',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Silver',
                'min_points' => 1000,
                'max_points' => 4999,
                'multiplier' => 1.25,
                'color' => '#C0C0C0',
                'icon' => 'mdi-medal-outline',
                'perks' => [
                    'สะสมแต้ม x1.25 เท่า',
                    'รับส่วนลดวันเกิด 10%',
                    'แลกรางวัลพิเศษ Silver',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Gold',
                'min_points' => 5000,
                'max_points' => 19999,
                'multiplier' => 1.5,
                'color' => '#FFD700',
                'icon' => 'mdi-star',
                'perks' => [
                    'สะสมแต้ม x1.5 เท่า',
                    'รับส่วนลดวันเกิด 15%',
                    'แลกรางวัลพิเศษ Gold',
                    'สิทธิ์แลกก่อนใคร',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Platinum',
                'min_points' => 20000,
                'max_points' => null,
                'multiplier' => 2.0,
                'color' => '#E5E4E2',
                'icon' => 'mdi-crown',
                'perks' => [
                    'สะสมแต้ม x2.0 เท่า',
                    'รับส่วนลดวันเกิด 20%',
                    'แลกรางวัล Exclusive',
                    'สิทธิ์แลกก่อนใคร',
                    'บริการพิเศษ VIP',
                ],
                'is_active' => true,
            ],
        ];

        foreach ($tiers as $tier) {
            LoyaltyTier::updateOrCreate(
                ['name' => $tier['name']],
                $tier
            );
        }
    }
}
