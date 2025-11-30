<?php

namespace App\Services;

use App\Models\LoyaltyMember;
use App\Models\LoyaltyPoint;
use App\Models\LoyaltyCampaign;
use App\Models\LoyaltySetting;

class LoyaltyService
{
    /**
     * Process loyalty points for a sale transaction
     */
    public function processSale($sale, $memberId = null)
    {
        if (!LoyaltySetting::isEnabled()) {
            return null;
        }

        if (!$memberId) {
            return null;
        }

        $member = LoyaltyMember::find($memberId);
        if (!$member || !$member->is_active) {
            return null;
        }

        // Calculate base points
        $basePoints = LoyaltySetting::calculatePoints($sale->total);

        if ($basePoints <= 0) {
            return null;
        }

        // Apply campaign bonuses
        $campaignBonus = $this->calculateCampaignBonus($basePoints, $member, $sale);

        // Add points to member
        $totalEarned = $member->addPoints(
            $basePoints + $campaignBonus,
            'purchase',
            "Purchase #{$sale->receipt_number}",
            $sale
        );

        return [
            'member_id' => $member->id,
            'base_points' => $basePoints,
            'campaign_bonus' => $campaignBonus,
            'total_earned' => $totalEarned,
            'current_points' => $member->current_points,
            'tier' => $member->tier_name,
        ];
    }

    /**
     * Calculate campaign bonus points
     */
    protected function calculateCampaignBonus($basePoints, $member, $sale = null)
    {
        $totalBonus = 0;
        $activeCampaigns = LoyaltyCampaign::active()->get();

        foreach ($activeCampaigns as $campaign) {
            $context = $this->buildCampaignContext($member, $sale);

            if ($campaign->checkConditions($context)) {
                $totalBonus += $campaign->calculateBonus($basePoints);
            }
        }

        return $totalBonus;
    }

    /**
     * Build context for campaign condition checking
     */
    protected function buildCampaignContext($member, $sale = null)
    {
        $context = [
            'member_id' => $member->id,
            'tier_id' => $member->tier_id,
            'day_of_week' => now()->format('l'),
            'is_weekend' => now()->isWeekend(),
            'is_birthday' => $member->birth_date && $member->birth_date->isBirthday(),
            'is_first_purchase' => $member->total_earned_points == 0,
        ];

        if ($sale) {
            $context['amount'] = $sale->total;
            $context['branch_id'] = $sale->branch_id ?? null;
        }

        return $context;
    }

    /**
     * Redeem reward for member from POS
     */
    public function redeemFromPOS($memberId, $rewardId)
    {
        if (!LoyaltySetting::isEnabled()) {
            return [
                'success' => false,
                'message' => 'Loyalty system is disabled',
            ];
        }

        $member = LoyaltyMember::find($memberId);
        if (!$member || !$member->is_active) {
            return [
                'success' => false,
                'message' => 'Member not found or inactive',
            ];
        }

        $reward = \App\Models\LoyaltyReward::find($rewardId);
        if (!$reward) {
            return [
                'success' => false,
                'message' => 'Reward not found',
            ];
        }

        if (!$reward->canRedeem($member)) {
            return [
                'success' => false,
                'message' => 'Cannot redeem this reward',
            ];
        }

        $redemption = $reward->redeem($member);

        return [
            'success' => true,
            'message' => 'Reward redeemed successfully',
            'redemption' => $redemption,
            'remaining_points' => $member->fresh()->current_points,
        ];
    }

    /**
     * Get member for POS display
     */
    public function getMemberForPOS($search)
    {
        if (!LoyaltySetting::isEnabled()) {
            return null;
        }

        $member = LoyaltyMember::with('tier')
            ->active()
            ->where(function ($q) use ($search) {
                $q->where('phone', $search)
                    ->orWhere('member_code', $search);
            })
            ->first();

        if (!$member) {
            return null;
        }

        return [
            'id' => $member->id,
            'member_code' => $member->member_code,
            'name' => $member->full_name,
            'phone' => $member->phone,
            'current_points' => $member->current_points,
            'tier' => [
                'name' => $member->tier->name ?? 'Bronze',
                'color' => $member->tier->color ?? '#CD7F32',
                'multiplier' => $member->tier->multiplier ?? 1.0,
            ],
        ];
    }

    /**
     * Quick register member from POS
     */
    public function quickRegister($phone, $firstName, $lastName = null)
    {
        if (!LoyaltySetting::isEnabled()) {
            return [
                'success' => false,
                'message' => 'Loyalty system is disabled',
            ];
        }

        // Check if phone already exists
        if (LoyaltyMember::where('phone', $phone)->exists()) {
            return [
                'success' => false,
                'message' => 'Phone number already registered',
            ];
        }

        $member = LoyaltyMember::create([
            'member_code' => LoyaltyMember::generateMemberCode(),
            'referral_code' => LoyaltyMember::generateReferralCode(),
            'phone' => $phone,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'join_date' => now(),
            'current_points' => 0,
            'total_earned_points' => 0,
            'total_spent_points' => 0,
            'tier_id' => \App\Models\LoyaltyTier::orderBy('min_points', 'asc')->first()?->id,
        ]);

        return [
            'success' => true,
            'message' => 'Member registered successfully',
            'member' => $this->getMemberForPOS($phone),
        ];
    }

    /**
     * Preview points for a sale amount
     */
    public function previewPoints($amount, $memberId = null)
    {
        if (!LoyaltySetting::isEnabled()) {
            return [
                'enabled' => false,
                'points' => 0,
            ];
        }

        $basePoints = LoyaltySetting::calculatePoints($amount);
        $multiplier = 1.0;
        $tierName = 'Bronze';

        if ($memberId) {
            $member = LoyaltyMember::with('tier')->find($memberId);
            if ($member && $member->tier) {
                $multiplier = $member->tier->multiplier;
                $tierName = $member->tier->name;
            }
        }

        $finalPoints = (int)($basePoints * $multiplier);

        return [
            'enabled' => true,
            'base_points' => $basePoints,
            'multiplier' => $multiplier,
            'tier' => $tierName,
            'final_points' => $finalPoints,
            'points_per_baht' => LoyaltySetting::getPointsPerBaht(),
        ];
    }
}