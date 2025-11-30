<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyMember;
use App\Models\LoyaltyPoint;
use App\Models\LoyaltyRedemption;
use App\Models\LoyaltyTier;
use App\Models\LoyaltyCampaign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LoyaltyDashboardController extends Controller
{
    /**
     * Get dashboard overview statistics
     */
    public function overview()
    {
        $stats = [
            'total_members' => LoyaltyMember::count(),
            'active_members' => LoyaltyMember::active()->count(),
            'new_members_this_month' => LoyaltyMember::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'total_points_issued' => LoyaltyMember::sum('total_earned_points'),
            'total_points_redeemed' => LoyaltyMember::sum('total_spent_points'),
            'total_points_circulation' => LoyaltyMember::sum('current_points'),
            'pending_redemptions' => LoyaltyRedemption::pending()->count(),
            'active_campaigns' => LoyaltyCampaign::active()->count(),
        ];

        // Calculate growth percentages
        $lastMonth = now()->subMonth();
        $previousMonthMembers = LoyaltyMember::whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->count();

        if ($previousMonthMembers > 0) {
            $stats['member_growth'] = round(
                (($stats['new_members_this_month'] - $previousMonthMembers) / $previousMonthMembers) * 100,
                1
            );
        } else {
            $stats['member_growth'] = $stats['new_members_this_month'] > 0 ? 100 : 0;
        }

        return response()->json($stats);
    }

    /**
     * Get tier distribution
     */
    public function tierDistribution()
    {
        $distribution = LoyaltyTier::select('id', 'name', 'color')
            ->withCount('members')
            ->orderBy('min_points', 'asc')
            ->get()
            ->map(function ($tier) {
                return [
                    'name' => $tier->name,
                    'value' => $tier->members_count,
                    'color' => $tier->color,
                ];
            });

        return response()->json($distribution);
    }

    /**
     * Get points chart data
     */
    public function pointsChart(Request $request)
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

        // Fill in missing dates
        $result = [];
        $period = new \DatePeriod(
            $startDate,
            new \DateInterval('P1D'),
            now()
        );

        foreach ($period as $date) {
            $dateStr = $date->format('Y-m-d');
            $found = $data->firstWhere('date', $dateStr);
            $result[] = [
                'date' => $dateStr,
                'earned' => $found ? (int)$found->earned : 0,
                'used' => $found ? (int)$found->used : 0,
            ];
        }

        return response()->json($result);
    }

    /**
     * Get members chart data
     */
    public function membersChart(Request $request)
    {
        $days = $request->get('days', 30);
        $startDate = now()->subDays($days);

        $data = LoyaltyMember::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as count')
            )
            ->where('created_at', '>=', $startDate)
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date', 'asc')
            ->get();

        return response()->json($data);
    }

    /**
     * Get recent members
     */
    public function recentMembers(Request $request)
    {
        $limit = $request->get('limit', 10);

        $members = LoyaltyMember::with('tier:id,name,color')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get(['id', 'member_code', 'first_name', 'last_name', 'phone', 'current_points', 'tier_id', 'created_at']);

        return response()->json($members);
    }

    /**
     * Get recent redemptions
     */
    public function recentRedemptions(Request $request)
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

    /**
     * Get top members
     */
    public function topMembers(Request $request)
    {
        $limit = $request->get('limit', 10);
        $sortBy = $request->get('sort_by', 'total_earned_points');

        $members = LoyaltyMember::with('tier:id,name,color')
            ->orderBy($sortBy, 'desc')
            ->limit($limit)
            ->get(['id', 'member_code', 'first_name', 'last_name', 'current_points', 'total_earned_points', 'tier_id']);

        return response()->json($members);
    }

    /**
     * Get active campaigns
     */
    public function activeCampaigns()
    {
        $campaigns = LoyaltyCampaign::active()
            ->orderBy('end_date', 'asc')
            ->get();

        return response()->json($campaigns);
    }

    /**
     * Get monthly report
     */
    public function monthlyReport(Request $request)
    {
        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);

        $startDate = now()->setYear($year)->setMonth($month)->startOfMonth();
        $endDate = now()->setYear($year)->setMonth($month)->endOfMonth();

        $report = [
            'period' => [
                'month' => $month,
                'year' => $year,
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ],
            'members' => [
                'new' => LoyaltyMember::whereBetween('created_at', [$startDate, $endDate])->count(),
                'active' => LoyaltyMember::active()->whereBetween('last_activity_date', [$startDate, $endDate])->count(),
            ],
            'points' => [
                'earned' => LoyaltyPoint::earned()->whereBetween('created_at', [$startDate, $endDate])->sum('points'),
                'used' => abs(LoyaltyPoint::used()->whereBetween('created_at', [$startDate, $endDate])->sum('points')),
                'expired' => LoyaltyPoint::where('is_expired', true)
                    ->whereBetween('updated_at', [$startDate, $endDate])
                    ->sum('points'),
            ],
            'redemptions' => [
                'total' => LoyaltyRedemption::whereBetween('created_at', [$startDate, $endDate])->count(),
                'completed' => LoyaltyRedemption::completed()->whereBetween('redeemed_at', [$startDate, $endDate])->count(),
            ],
            'top_rewards' => LoyaltyRedemption::select('reward_id', DB::raw('count(*) as count'))
                ->with('reward:id,name')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('reward_id')
                ->orderBy('count', 'desc')
                ->limit(5)
                ->get(),
        ];

        return response()->json($report);
    }
}
