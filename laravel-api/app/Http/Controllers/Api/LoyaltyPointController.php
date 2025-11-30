<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyPoint;
use App\Models\LoyaltyMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LoyaltyPointController extends Controller
{
    /**
     * Get all points with pagination
     */
    public function index(Request $request)
    {
        $query = LoyaltyPoint::with('member:id,member_code,first_name,last_name');

        // Filter by type
        if ($type = $request->get('type')) {
            if ($type === 'earned') {
                $query->earned();
            } elseif ($type === 'used') {
                $query->used();
            } else {
                $query->byType($type);
            }
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
        $points = $query->paginate($perPage);

        return response()->json($points);
    }

    /**
     * Get points statistics
     */
    public function statistics(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now());

        $stats = [
            'total_earned' => LoyaltyPoint::earned()
                ->dateRange($startDate, $endDate)
                ->sum('points'),
            'total_used' => abs(LoyaltyPoint::used()
                ->dateRange($startDate, $endDate)
                ->sum('points')),
            'expiring_soon' => LoyaltyPoint::expiring(30)->sum('points'),
            'expired_this_month' => LoyaltyPoint::where('is_expired', true)
                ->whereMonth('updated_at', now()->month)
                ->sum('points'),
            'by_type' => LoyaltyPoint::select('type', DB::raw('SUM(points) as total'))
                ->dateRange($startDate, $endDate)
                ->groupBy('type')
                ->get(),
        ];

        return response()->json($stats);
    }

    /**
     * Get earned points
     */
    public function earned(Request $request)
    {
        $query = LoyaltyPoint::with('member:id,member_code,first_name,last_name')
            ->earned();

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
     * Get used points
     */
    public function used(Request $request)
    {
        $query = LoyaltyPoint::with('member:id,member_code,first_name,last_name')
            ->used();

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
     * Get expiring points
     */
    public function expiring(Request $request)
    {
        $days = $request->get('days', 30);

        $points = LoyaltyPoint::with('member:id,member_code,first_name,last_name')
            ->expiring($days)
            ->orderBy('expire_date', 'asc')
            ->paginate($request->get('per_page', 20));

        return response()->json($points);
    }

    /**
     * Manually expire points
     */
    public function processExpiry()
    {
        $expiredCount = LoyaltyPoint::expirePoints();

        return response()->json([
            'message' => 'Expiry processed successfully',
            'expired_count' => $expiredCount
        ]);
    }

    /**
     * Get points chart data
     */
    public function chartData(Request $request)
    {
        $days = $request->get('days', 30);
        $startDate = now()->subDays($days);

        $data = LoyaltyPoint::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(CASE WHEN points > 0 THEN points ELSE 0 END) as earned'),
                DB::raw('SUM(CASE WHEN points < 0 THEN ABS(points) ELSE 0 END) as used')
            )
            ->where('created_at', '>=', $startDate)
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date', 'asc')
            ->get();

        return response()->json($data);
    }
}
