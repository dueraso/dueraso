<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LoyaltyCampaign;
use Carbon\Carbon;

class LoyaltyCampaignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $campaigns = [
            [
                'name' => 'แคมเปญเปิดร้านใหม่',
                'description' => 'ฉลองเปิดร้านใหม่ รับแต้ม x2 ทุกการซื้อ',
                'type' => 'multiplier',
                'multiplier' => 2.0,
                'bonus_points' => null,
                'conditions' => null,
                'start_date' => Carbon::now(),
                'end_date' => Carbon::now()->addDays(30),
                'icon' => 'mdi-party-popper',
                'color' => '#FF6B6B',
                'is_active' => true,
            ],
            [
                'name' => 'Happy Birthday',
                'description' => 'รับแต้มโบนัส 100 แต้มในวันเกิดของคุณ',
                'type' => 'bonus',
                'multiplier' => null,
                'bonus_points' => 100,
                'conditions' => [
                    ['field' => 'is_birthday', 'operator' => '=', 'value' => true]
                ],
                'start_date' => null,
                'end_date' => null,
                'icon' => 'mdi-cake-variant',
                'color' => '#FFD93D',
                'is_active' => true,
            ],
            [
                'name' => 'Weekend Double Points',
                'description' => 'รับแต้ม x2 ทุกวันเสาร์-อาทิตย์',
                'type' => 'multiplier',
                'multiplier' => 2.0,
                'bonus_points' => null,
                'conditions' => [
                    ['field' => 'day_of_week', 'operator' => 'in', 'value' => ['Saturday', 'Sunday']]
                ],
                'start_date' => null,
                'end_date' => null,
                'icon' => 'mdi-calendar-weekend',
                'color' => '#6BCB77',
                'is_active' => false,
            ],
            [
                'name' => 'First Purchase Bonus',
                'description' => 'รับแต้มโบนัส 50 แต้มสำหรับการซื้อครั้งแรก',
                'type' => 'bonus',
                'multiplier' => null,
                'bonus_points' => 50,
                'conditions' => [
                    ['field' => 'is_first_purchase', 'operator' => '=', 'value' => true]
                ],
                'start_date' => null,
                'end_date' => null,
                'icon' => 'mdi-gift',
                'color' => '#4D96FF',
                'is_active' => true,
            ],
        ];

        foreach ($campaigns as $campaign) {
            LoyaltyCampaign::updateOrCreate(
                ['name' => $campaign['name']],
                $campaign
            );
        }
    }
}
