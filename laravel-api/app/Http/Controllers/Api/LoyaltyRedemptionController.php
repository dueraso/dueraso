<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyRedemption;
use App\Models\LoyaltyMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LoyaltyRedemptionController extends Controller
{
    /**
     * Get all redemptions
     */
    public function index(Request $request)
    {
        $query = LoyaltyRedemption::with([
            'member:id,member_code,first_name,last_name',
            'reward:id,name,type,points_required'
        ]);

        // Filter by status
        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        // Filter by member
        if ($memberId = $request->get('member_id')) {
            $query->where('member_id', $memberId);
        }

        // Date range filter
        if ($startDate = $request->get('start_date')) {
            $query->whereDate('created_at', '>=', $startDate);
        }

        if ($endDate = $request->get('end_date')) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 20);
        $redemptions = $query->paginate($perPage);

        return response()->json($redemptions);
    }

    /**
     * Get redemption details
     */
    public function show($id)
    {
        $redemption = LoyaltyRedemption::with(['member', 'reward'])
            ->findOrFail($id);

        return response()->json($redemption);
    }

    /**
     * Mark redemption as completed
     */
    public function complete($id)
    {
        $redemption = LoyaltyRedemption::findOrFail($id);

        if ($redemption->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending redemptions can be completed'
            ], 400);
        }

        $redemption->markAsCompleted();

        return response()->json([
            'message' => 'Redemption completed successfully',
            'data' => $redemption
        ]);
    }

    /**
     * Cancel redemption
     */
    public function cancel(Request $request, $id)
    {
        $redemption = LoyaltyRedemption::findOrFail($id);

        if ($redemption->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending redemptions can be cancelled'
            ], 400);
        }

        $request->validate([
            'reason' => 'nullable|string|max:255'
        ]);

        $redemption->cancel();

        if ($request->reason) {
            $redemption->update(['notes' => $request->reason]);
        }

        return response()->json([
            'message' => 'Redemption cancelled successfully',
            'data' => $redemption,
            'refunded_points' => $redemption->points_used
        ]);
    }

    /**
     * Verify redemption code
     */
    public function verifyCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string'
        ]);

        $redemption = LoyaltyRedemption::with(['member', 'reward'])
            ->where('code', $request->code)
            ->first();

        if (!$redemption) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid redemption code'
            ], 404);
        }

        return response()->json([
            'valid' => true,
            'data' => $redemption,
            'can_complete' => $redemption->status === 'pending'
        ]);
    }

    /**
     * Get redemption statistics
     */
    public function statistics(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now());

        $stats = [
            'total_redemptions' => LoyaltyRedemption::whereBetween('created_at', [$startDate, $endDate])->count(),
            'pending' => LoyaltyRedemption::pending()->count(),
            'completed' => LoyaltyRedemption::completed()
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count(),
            'total_points_redeemed' => LoyaltyRedemption::whereBetween('created_at', [$startDate, $endDate])
                ->sum('points_used'),
            'by_reward' => LoyaltyRedemption::select('reward_id', DB::raw('count(*) as count'))
                ->with('reward:id,name,type')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('reward_id')
                ->get(),
        ];

        return response()->json($stats);
    }

    /**
     * Get recent redemptions for dashboard
     */
    public function recent(Request $request)
    {
        $limit = $request->get('limit', 10);

        $redemptions = LoyaltyRedemption::with([
                'member:id,member_code,first_name,last_name',
                'reward:id,name,type'
            ])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        return response()->json($redemptions);
    }
}
