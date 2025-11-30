<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyReward;
use App\Models\LoyaltyMember;
use App\Models\LoyaltyRedemption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LoyaltyRewardController extends Controller
{
    /**
     * Get all rewards
     */
    public function index(Request $request)
    {
        $query = LoyaltyReward::with('minTier:id,name');

        // Filter by type
        if ($type = $request->get('type')) {
            $query->where('type', $type);
        }

        // Filter by availability
        if ($request->boolean('available_only')) {
            $query->available();
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Sort
        $sortBy = $request->get('sort_by', 'points_required');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $rewards = $query->get();

        return response()->json($rewards);
    }

    /**
     * Create new reward
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'type' => 'required|string|in:discount,voucher,product,service',
            'points_required' => 'required|integer|min:1',
            'value' => 'nullable|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'min_tier_id' => 'nullable|exists:loyalty_tiers,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('rewards', 'public');
        }

        $reward = LoyaltyReward::create($validated);

        return response()->json([
            'message' => 'Reward created successfully',
            'data' => $reward
        ], 201);
    }

    /**
     * Get reward details
     */
    public function show($id)
    {
        $reward = LoyaltyReward::with('minTier')
            ->withCount('redemptions')
            ->findOrFail($id);

        return response()->json($reward);
    }

    /**
     * Update reward
     */
    public function update(Request $request, $id)
    {
        $reward = LoyaltyReward::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'type' => 'sometimes|string|in:discount,voucher,product,service',
            'points_required' => 'sometimes|integer|min:1',
            'value' => 'nullable|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'min_tier_id' => 'nullable|exists:loyalty_tiers,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($reward->image) {
                Storage::disk('public')->delete($reward->image);
            }
            $validated['image'] = $request->file('image')->store('rewards', 'public');
        }

        $reward->update($validated);

        return response()->json([
            'message' => 'Reward updated successfully',
            'data' => $reward
        ]);
    }

    /**
     * Delete reward
     */
    public function destroy($id)
    {
        $reward = LoyaltyReward::findOrFail($id);

        // Check if there are pending redemptions
        if ($reward->redemptions()->pending()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete reward with pending redemptions'
            ], 400);
        }

        // Delete image if exists
        if ($reward->image) {
            Storage::disk('public')->delete($reward->image);
        }

        $reward->delete();

        return response()->json([
            'message' => 'Reward deleted successfully'
        ]);
    }

    /**
     * Get available rewards for a member
     */
    public function availableForMember($memberId)
    {
        $member = LoyaltyMember::findOrFail($memberId);

        $rewards = LoyaltyReward::available()
            ->forTier($member->tier_id)
            ->where('points_required', '<=', $member->current_points)
            ->orderBy('points_required', 'asc')
            ->get();

        return response()->json($rewards);
    }

    /**
     * Redeem reward for member
     */
    public function redeem(Request $request, $id)
    {
        $request->validate([
            'member_id' => 'required|exists:loyalty_members,id',
        ]);

        $reward = LoyaltyReward::findOrFail($id);
        $member = LoyaltyMember::findOrFail($request->member_id);

        if (!$reward->canRedeem($member)) {
            return response()->json([
                'message' => 'Cannot redeem this reward',
                'reasons' => $this->getRedeemFailReasons($reward, $member)
            ], 400);
        }

        $redemption = $reward->redeem($member);

        return response()->json([
            'message' => 'Reward redeemed successfully',
            'data' => $redemption->load('reward'),
            'remaining_points' => $member->fresh()->current_points
        ]);
    }

    /**
     * Get reasons why redemption failed
     */
    private function getRedeemFailReasons($reward, $member)
    {
        $reasons = [];

        if (!$reward->is_available) {
            $reasons[] = 'Reward is not available';
        }

        if ($member->current_points < $reward->points_required) {
            $reasons[] = 'Insufficient points';
        }

        if ($reward->min_tier_id && $member->tier_id < $reward->min_tier_id) {
            $reasons[] = 'Tier requirement not met';
        }

        return $reasons;
    }
}
