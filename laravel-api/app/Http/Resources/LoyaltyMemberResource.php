<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoyaltyMemberResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'member_code' => $this->member_code,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'birth_date' => $this->birth_date?->format('Y-m-d'),
            'referral_code' => $this->referral_code,
            'points' => [
                'current' => $this->current_points,
                'total_earned' => $this->total_earned_points,
                'total_spent' => $this->total_spent_points,
            ],
            'tier' => $this->whenLoaded('tier', function () {
                return [
                    'id' => $this->tier->id,
                    'name' => $this->tier->name,
                    'color' => $this->tier->color,
                    'multiplier' => $this->tier->multiplier,
                ];
            }),
            'join_date' => $this->join_date?->format('Y-m-d'),
            'last_activity_date' => $this->last_activity_date?->format('Y-m-d H:i:s'),
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
