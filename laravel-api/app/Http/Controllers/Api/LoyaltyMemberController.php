<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyMember;
use App\Models\LoyaltyTier;
use App\Models\LoyaltyPoint;
use App\Models\LoyaltyRedemption;
use App\Models\LoyaltySetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LoyaltyMemberController extends Controller
{
    /**
     * Get all members with pagination
     */
    public function index(Request $request)
    {
        $query = LoyaltyMember::with('tier');

        // Search
        if ($search = $request->get('search')) {
            $query->search($search);
        }

        // Filter by tier
        if ($tierId = $request->get('tier_id')) {
            $query->where('tier_id', $tierId);
        }

        // Filter by status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 15);
        $members = $query->paginate($perPage);

        return response()->json($members);
    }

    /**
     * Create new member
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'email' => 'nullable|email|unique:loyalty_members,email',
            'phone' => 'required|string|unique:loyalty_members,phone',
            'birth_date' => 'nullable|date',
            'referred_by' => 'nullable|exists:loyalty_members,id',
        ]);

        // Generate member code
        $validated['member_code'] = LoyaltyMember::generateMemberCode();
        $validated['referral_code'] = LoyaltyMember::generateReferralCode();
        $validated['join_date'] = now();
        $validated['current_points'] = 0;
        $validated['total_earned_points'] = 0;
        $validated['total_spent_points'] = 0;

        // Set default tier (Bronze)
        $defaultTier = LoyaltyTier::orderBy('min_points', 'asc')->first();
        if ($defaultTier) {
            $validated['tier_id'] = $defaultTier->id;
        }

        $member = LoyaltyMember::create($validated);

        // Handle referral bonus
        if ($request->referred_by) {
            $referrer = LoyaltyMember::find($request->referred_by);
            if ($referrer && LoyaltySetting::get('enable_referral')) {
                $referralPoints = (int) LoyaltySetting::get('referral_points', 50);
                $referrer->addPoints($referralPoints, 'referral', "Referral bonus for inviting {$member->full_name}");
            }
        }

        return response()->json([
            'message' => 'Member created successfully',
            'data' => $member->load('tier')
        ], 201);
    }

    /**
     * Get member details
     */
    public function show($id)
    {
        $member = LoyaltyMember::with(['tier', 'points' => function ($q) {
            $q->orderBy('created_at', 'desc')->limit(10);
        }, 'redemptions' => function ($q) {
            $q->with('reward')->orderBy('created_at', 'desc')->limit(10);
        }])->findOrFail($id);

        return response()->json($member);
    }

    /**
     * Update member
     */
    public function update(Request $request, $id)
    {
        $member = LoyaltyMember::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'email' => 'nullable|email|unique:loyalty_members,email,' . $id,
            'phone' => 'sometimes|string|unique:loyalty_members,phone,' . $id,
            'birth_date' => 'nullable|date',
            'tier_id' => 'sometimes|exists:loyalty_tiers,id',
            'is_active' => 'sometimes|boolean',
        ]);

        $member->update($validated);

        return response()->json([
            'message' => 'Member updated successfully',
            'data' => $member->load('tier')
        ]);
    }

    /**
     * Delete member
     */
    public function destroy($id)
    {
        $member = LoyaltyMember::findOrFail($id);

        // Soft delete approach - just deactivate
        $member->update(['is_active' => false]);

        return response()->json([
            'message' => 'Member deactivated successfully'
        ]);
    }

    /**
     * Search members (for quick search in POS)
     */
    public function search(Request $request)
    {
        $search = $request->get('q', '');

        if (strlen($search) < 2) {
            return response()->json([]);
        }

        $members = LoyaltyMember::with('tier')
            ->active()
            ->search($search)
            ->limit(10)
            ->get();

        return response()->json($members);
    }

    /**
     * Get member by phone
     */
    public function findByPhone($phone)
    {
        $member = LoyaltyMember::with('tier')
            ->where('phone', $phone)
            ->active()
            ->first();

        if (!$member) {
            return response()->json([
                'message' => 'Member not found'
            ], 404);
        }

        return response()->json($member);
    }

    /**
     * Add points to member
     */
    public function addPoints(Request $request, $id)
    {
        $member = LoyaltyMember::findOrFail($id);

        $validated = $request->validate([
            'points' => 'required|integer|min:1',
            'type' => 'sometimes|string|in:purchase,bonus,referral,campaign,adjustment',
            'description' => 'nullable|string|max:255',
        ]);

        $earnedPoints = $member->addPoints(
            $validated['points'],
            $validated['type'] ?? 'adjustment',
            $validated['description'] ?? 'Manual point adjustment'
        );

        return response()->json([
            'message' => 'Points added successfully',
            'points_added' => $earnedPoints,
            'current_points' => $member->current_points
        ]);
    }

    /**
     * Deduct points from member
     */
    public function deductPoints(Request $request, $id)
    {
        $member = LoyaltyMember::findOrFail($id);

        $validated = $request->validate([
            'points' => 'required|integer|min:1|max:' . $member->current_points,
            'description' => 'nullable|string|max:255',
        ]);

        $success = $member->usePoints(
            $validated['points'],
            $validated['description'] ?? 'Manual point deduction'
        );

        if (!$success) {
            return response()->json([
                'message' => 'Insufficient points'
            ], 400);
        }

        return response()->json([
            'message' => 'Points deducted successfully',
            'points_deducted' => $validated['points'],
            'current_points' => $member->current_points
        ]);
    }

    /**
     * Get member point history
     */
    public function pointHistory(Request $request, $id)
    {
        $member = LoyaltyMember::findOrFail($id);

        $query = $member->points();

        if ($type = $request->get('type')) {
            if ($type === 'earned') {
                $query->earned();
            } elseif ($type === 'used') {
                $query->used();
            } else {
                $query->byType($type);
            }
        }

        if ($startDate = $request->get('start_date')) {
            $query->whereDate('created_at', '>=', $startDate);
        }

        if ($endDate = $request->get('end_date')) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        $points = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json($points);
    }

    /**
     * Get member redemption history
     */
    public function redemptionHistory(Request $request, $id)
    {
        $member = LoyaltyMember::findOrFail($id);

        $redemptions = $member->redemptions()
            ->with('reward')
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json($redemptions);
    }

    /**
     * Get member statistics
     */
    public function statistics()
    {
        $stats = [
            'total_members' => LoyaltyMember::count(),
            'active_members' => LoyaltyMember::active()->count(),
            'new_this_month' => LoyaltyMember::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'total_points_issued' => LoyaltyMember::sum('total_earned_points'),
            'total_points_redeemed' => LoyaltyMember::sum('total_spent_points'),
            'members_by_tier' => LoyaltyMember::select('tier_id', DB::raw('count(*) as count'))
                ->groupBy('tier_id')
                ->with('tier:id,name,color')
                ->get(),
        ];

        return response()->json($stats);
    }
}
