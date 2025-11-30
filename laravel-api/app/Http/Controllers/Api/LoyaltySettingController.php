<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoyaltySetting;
use Illuminate\Http\Request;

class LoyaltySettingController extends Controller
{
    /**
     * Get all settings
     */
    public function index()
    {
        $settings = LoyaltySetting::getAll();

        return response()->json($settings);
    }

    /**
     * Get single setting
     */
    public function show($key)
    {
        $value = LoyaltySetting::get($key);

        if ($value === null) {
            return response()->json([
                'message' => 'Setting not found'
            ], 404);
        }

        return response()->json([
            'key' => $key,
            'value' => $value
        ]);
    }

    /**
     * Update settings
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
        ]);

        LoyaltySetting::setMany($validated['settings']);

        return response()->json([
            'message' => 'Settings updated successfully',
            'data' => LoyaltySetting::getAll()
        ]);
    }

    /**
     * Update single setting
     */
    public function updateSingle(Request $request, $key)
    {
        $validated = $request->validate([
            'value' => 'required',
        ]);

        LoyaltySetting::set($key, $validated['value']);

        return response()->json([
            'message' => 'Setting updated successfully',
            'key' => $key,
            'value' => $validated['value']
        ]);
    }

    /**
     * Reset settings to default
     */
    public function reset()
    {
        $defaults = [
            'system_enabled' => '1',
            'points_per_baht' => '10',
            'point_expire_days' => '365',
            'min_purchase_for_points' => '0',
            'max_points_per_transaction' => '0',
            'enable_rounding' => '1',
            'enable_birthday_bonus' => '1',
            'birthday_bonus_points' => '100',
            'enable_referral' => '1',
            'referral_points' => '50',
        ];

        LoyaltySetting::setMany($defaults);

        return response()->json([
            'message' => 'Settings reset to defaults',
            'data' => $defaults
        ]);
    }

    /**
     * Calculate points for an amount
     */
    public function calculatePoints(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        $points = LoyaltySetting::calculatePoints($request->amount);

        return response()->json([
            'amount' => $request->amount,
            'points' => $points,
            'points_per_baht' => LoyaltySetting::getPointsPerBaht(),
        ]);
    }

    /**
     * Check if system is enabled
     */
    public function isEnabled()
    {
        return response()->json([
            'enabled' => LoyaltySetting::isEnabled()
        ]);
    }
}
