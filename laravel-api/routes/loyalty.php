<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LoyaltyMemberController;
use App\Http\Controllers\Api\LoyaltyTierController;
use App\Http\Controllers\Api\LoyaltyPointController;
use App\Http\Controllers\Api\LoyaltyRewardController;
use App\Http\Controllers\Api\LoyaltyRedemptionController;
use App\Http\Controllers\Api\LoyaltyCampaignController;
use App\Http\Controllers\Api\LoyaltySettingController;
use App\Http\Controllers\Api\LoyaltyDashboardController;

/*
|--------------------------------------------------------------------------
| Loyalty API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for the loyalty system.
| Add this file to your routes/api.php using:
| require __DIR__.'/loyalty.php';
|
*/

Route::prefix('loyalty')->group(function () {

    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('/overview', [LoyaltyDashboardController::class, 'overview']);
        Route::get('/tier-distribution', [LoyaltyDashboardController::class, 'tierDistribution']);
        Route::get('/points-chart', [LoyaltyDashboardController::class, 'pointsChart']);
        Route::get('/members-chart', [LoyaltyDashboardController::class, 'membersChart']);
        Route::get('/recent-members', [LoyaltyDashboardController::class, 'recentMembers']);
        Route::get('/recent-redemptions', [LoyaltyDashboardController::class, 'recentRedemptions']);
        Route::get('/top-members', [LoyaltyDashboardController::class, 'topMembers']);
        Route::get('/active-campaigns', [LoyaltyDashboardController::class, 'activeCampaigns']);
        Route::get('/monthly-report', [LoyaltyDashboardController::class, 'monthlyReport']);
    });

    // Members
    Route::prefix('members')->group(function () {
        Route::get('/', [LoyaltyMemberController::class, 'index']);
        Route::post('/', [LoyaltyMemberController::class, 'store']);
        Route::get('/search', [LoyaltyMemberController::class, 'search']);
        Route::get('/statistics', [LoyaltyMemberController::class, 'statistics']);
        Route::get('/phone/{phone}', [LoyaltyMemberController::class, 'findByPhone']);
        Route::get('/{id}', [LoyaltyMemberController::class, 'show']);
        Route::put('/{id}', [LoyaltyMemberController::class, 'update']);
        Route::delete('/{id}', [LoyaltyMemberController::class, 'destroy']);
        Route::post('/{id}/add-points', [LoyaltyMemberController::class, 'addPoints']);
        Route::post('/{id}/deduct-points', [LoyaltyMemberController::class, 'deductPoints']);
        Route::get('/{id}/point-history', [LoyaltyMemberController::class, 'pointHistory']);
        Route::get('/{id}/redemption-history', [LoyaltyMemberController::class, 'redemptionHistory']);
    });

    // Tiers
    Route::prefix('tiers')->group(function () {
        Route::get('/', [LoyaltyTierController::class, 'index']);
        Route::post('/', [LoyaltyTierController::class, 'store']);
        Route::get('/distribution', [LoyaltyTierController::class, 'distribution']);
        Route::get('/upgrade-stats', [LoyaltyTierController::class, 'upgradeStats']);
        Route::get('/{id}', [LoyaltyTierController::class, 'show']);
        Route::put('/{id}', [LoyaltyTierController::class, 'update']);
        Route::delete('/{id}', [LoyaltyTierController::class, 'destroy']);
    });

    // Points
    Route::prefix('points')->group(function () {
        Route::get('/', [LoyaltyPointController::class, 'index']);
        Route::get('/statistics', [LoyaltyPointController::class, 'statistics']);
        Route::get('/earned', [LoyaltyPointController::class, 'earned']);
        Route::get('/used', [LoyaltyPointController::class, 'used']);
        Route::get('/expiring', [LoyaltyPointController::class, 'expiring']);
        Route::post('/process-expiry', [LoyaltyPointController::class, 'processExpiry']);
        Route::get('/chart-data', [LoyaltyPointController::class, 'chartData']);
    });

    // Rewards
    Route::prefix('rewards')->group(function () {
        Route::get('/', [LoyaltyRewardController::class, 'index']);
        Route::post('/', [LoyaltyRewardController::class, 'store']);
        Route::get('/available/{memberId}', [LoyaltyRewardController::class, 'availableForMember']);
        Route::get('/{id}', [LoyaltyRewardController::class, 'show']);
        Route::put('/{id}', [LoyaltyRewardController::class, 'update']);
        Route::delete('/{id}', [LoyaltyRewardController::class, 'destroy']);
        Route::post('/{id}/redeem', [LoyaltyRewardController::class, 'redeem']);
    });

    // Redemptions
    Route::prefix('redemptions')->group(function () {
        Route::get('/', [LoyaltyRedemptionController::class, 'index']);
        Route::get('/statistics', [LoyaltyRedemptionController::class, 'statistics']);
        Route::get('/recent', [LoyaltyRedemptionController::class, 'recent']);
        Route::post('/verify-code', [LoyaltyRedemptionController::class, 'verifyCode']);
        Route::get('/{id}', [LoyaltyRedemptionController::class, 'show']);
        Route::post('/{id}/complete', [LoyaltyRedemptionController::class, 'complete']);
        Route::post('/{id}/cancel', [LoyaltyRedemptionController::class, 'cancel']);
    });

    // Campaigns
    Route::prefix('campaigns')->group(function () {
        Route::get('/', [LoyaltyCampaignController::class, 'index']);
        Route::post('/', [LoyaltyCampaignController::class, 'store']);
        Route::get('/active', [LoyaltyCampaignController::class, 'active']);
        Route::post('/calculate-bonus', [LoyaltyCampaignController::class, 'calculateBonus']);
        Route::get('/{id}', [LoyaltyCampaignController::class, 'show']);
        Route::put('/{id}', [LoyaltyCampaignController::class, 'update']);
        Route::delete('/{id}', [LoyaltyCampaignController::class, 'destroy']);
        Route::post('/{id}/toggle-status', [LoyaltyCampaignController::class, 'toggleStatus']);
    });

    // Settings
    Route::prefix('settings')->group(function () {
        Route::get('/', [LoyaltySettingController::class, 'index']);
        Route::put('/', [LoyaltySettingController::class, 'update']);
        Route::post('/reset', [LoyaltySettingController::class, 'reset']);
        Route::get('/is-enabled', [LoyaltySettingController::class, 'isEnabled']);
        Route::post('/calculate-points', [LoyaltySettingController::class, 'calculatePoints']);
        Route::get('/{key}', [LoyaltySettingController::class, 'show']);
        Route::put('/{key}', [LoyaltySettingController::class, 'updateSingle']);
    });
});
