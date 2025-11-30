<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyCampaign;
use Illuminate\Http\Request;

class LoyaltyCampaignController extends Controller
{
    /**
     * Get all campaigns
     */
    public function index(Request $request)
    {
        $query = LoyaltyCampaign::query();

        // Filter by status
        if ($status = $request->get('status')) {
            switch ($status) {
                case 'active':
                    $query->active();
                    break;
                case 'scheduled':
                    $query->scheduled();
                    break;
                case 'ended':
                    $query->ended();
                    break;
                case 'inactive':
                    $query->where('is_active', false);
                    break;
            }
        }

        // Filter by type
        if ($type = $request->get('type')) {
            $query->byType($type);
        }

        // Sort
        $sortBy = $request->get('sort_by', 'start_date');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $campaigns = $query->get();

        return response()->json($campaigns);
    }

    /**
     * Create new campaign
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'type' => 'required|string|in:multiplier,bonus,special',
            'multiplier' => 'required_if:type,multiplier|nullable|numeric|min:1|max:10',
            'bonus_points' => 'required_if:type,bonus|nullable|integer|min:1',
            'conditions' => 'nullable|array',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ]);

        $campaign = LoyaltyCampaign::create($validated);

        return response()->json([
            'message' => 'Campaign created successfully',
            'data' => $campaign
        ], 201);
    }

    /**
     * Get campaign details
     */
    public function show($id)
    {
        $campaign = LoyaltyCampaign::findOrFail($id);

        return response()->json($campaign);
    }

    /**
     * Update campaign
     */
    public function update(Request $request, $id)
    {
        $campaign = LoyaltyCampaign::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'type' => 'sometimes|string|in:multiplier,bonus,special',
            'multiplier' => 'nullable|numeric|min:1|max:10',
            'bonus_points' => 'nullable|integer|min:1',
            'conditions' => 'nullable|array',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ]);

        $campaign->update($validated);

        return response()->json([
            'message' => 'Campaign updated successfully',
            'data' => $campaign
        ]);
    }

    /**
     * Delete campaign
     */
    public function destroy($id)
    {
        $campaign = LoyaltyCampaign::findOrFail($id);

        $campaign->delete();

        return response()->json([
            'message' => 'Campaign deleted successfully'
        ]);
    }

    /**
     * Get active campaigns
     */
    public function active()
    {
        $campaigns = LoyaltyCampaign::active()->get();

        return response()->json($campaigns);
    }

    /**
     * Toggle campaign status
     */
    public function toggleStatus($id)
    {
        $campaign = LoyaltyCampaign::findOrFail($id);

        $campaign->update(['is_active' => !$campaign->is_active]);

        return response()->json([
            'message' => 'Campaign status updated',
            'is_active' => $campaign->is_active
        ]);
    }

    /**
     * Calculate campaign bonus for a purchase
     */
    public function calculateBonus(Request $request)
    {
        $request->validate([
            'base_points' => 'required|integer|min:1',
            'context' => 'nullable|array',
        ]);

        $basePoints = $request->base_points;
        $context = $request->context ?? [];
        $totalBonus = 0;
        $appliedCampaigns = [];

        $activeCampaigns = LoyaltyCampaign::active()->get();

        foreach ($activeCampaigns as $campaign) {
            if ($campaign->checkConditions($context)) {
                $bonus = $campaign->calculateBonus($basePoints);
                if ($bonus > 0) {
                    $totalBonus += $bonus;
                    $appliedCampaigns[] = [
                        'campaign' => $campaign->name,
                        'bonus' => $bonus,
                    ];
                }
            }
        }

        return response()->json([
            'base_points' => $basePoints,
            'total_bonus' => $totalBonus,
            'final_points' => $basePoints + $totalBonus,
            'applied_campaigns' => $appliedCampaigns,
        ]);
    }
}
