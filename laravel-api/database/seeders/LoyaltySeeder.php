<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class LoyaltySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Run this seeder with:
     * php artisan db:seed --class=LoyaltySeeder
     */
    public function run(): void
    {
        $this->call([
            LoyaltyTierSeeder::class,
            LoyaltyRewardSeeder::class,
            LoyaltyCampaignSeeder::class,
        ]);

        $this->command->info('Loyalty system seeded successfully!');
    }
}
