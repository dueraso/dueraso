<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyTier;
use App\Models\LoyaltyMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LoyaltyTierController extends Controller
{
    /**
     * Get all tiers
     */
    public function index()
    {
        $tiers = LoyaltyTier::withCount('members')
            ->orderBy('min_points', 'asc')
            ->get();

        return response()->json($tiers);
    }

    /**
     * Create new tier
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:loyalty_tiers,name',
            'min_points' => 'required|integer|min:0',
            'max_points' => 'nullable|integer|gt:min_points',
            'multiplier' => 'required|numeric|min:1|max:10',
            'color' => 'nullable|string|max:20',
            'icon' => 'nullable|string|max:50',
            'perks' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $tier = LoyaltyTier::create($validated);

        return response()->json([
            'message' => 'Tier created successfully',
            'data' => $tier
        ], 201);
    }

    /**
     * Get tier details
     */
    public function show($id)
    {
        $tier = LoyaltyTier::withCount('members')->findOrFail($id);

        return response()->json($tier);
    }

    /**
     * Update tier
     */
    public function update(Request $request, $id)
    {
        $tier = LoyaltyTier::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:50|unique:loyalty_tiers,name,' . $id,
            'min_points' => 'sometimes|integer|min:0',
            'max_points' => 'nullable|integer',
            'multiplier' => 'sometimes|numeric|min:1|max:10',
            'color' => 'nullable|string|max:20',
            'icon' => 'nullable|string|max:50',
            'perks' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $tier->update($validated);

        return response()->json([
            'message' => 'Tier updated successfully',
            'data' => $tier
        ]);
    }

    /**
     * Delete tier
     */
    public function destroy($id)
    {
        $tier = LoyaltyTier::findOrFail($id);

        // Check if there are members in this tier
        if ($tier->members()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete tier with existing members'
            ], 400);
        }

        $tier->delete();

        return response()->json([
            'message' => 'Tier deleted successfully'
        ]);
    }

    /**
     * Get tier distribution statistics
     */
    public function distribution()
    {
        $distribution = LoyaltyTier::select('id', 'name', 'color')
            ->withCount('members')
            ->orderBy('min_points', 'asc')
            ->get()
            ->map(function ($tier) {
                return [
                    'tier' => $tier->name,
                    'count' => $tier->members_count,
                    'color' => $tier->color,
                ];
            });

        return response()->json($distribution);
    }

    /**
     * Get tier upgrade statistics
     */
    public function upgradeStats()
    {
        // Get members who upgraded in the last 30 days
        $stats = DB::table('loyalty_members')
            ->select('tier_id', DB::raw('count(*) as upgraded_count'))
            ->where('updated_at', '>=', now()->subDays(30))
            ->whereColumn('created_at', '<', 'updated_at')
            ->groupBy('tier_id')
            ->get();

        return response()->json($stats);
    }
}
