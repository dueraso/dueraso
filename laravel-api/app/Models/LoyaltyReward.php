<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltyReward extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image',
        'type',
        'points_required',
        'value',
        'stock',
        'min_tier_id',
        'start_date',
        'end_date',
        'is_active',
    ];

    protected $casts = [
        'points_required' => 'integer',
        'value' => 'decimal:2',
        'stock' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    protected $appends = ['is_available'];

    // Accessors
    public function getIsAvailableAttribute()
    {
        if (!$this->is_active) return false;
        if ($this->stock !== null && $this->stock <= 0) return false;
        if ($this->start_date && $this->start_date > now()) return false;
        if ($this->end_date && $this->end_date < now()) return false;
        return true;
    }

    // Relations
    public function minTier()
    {
        return $this->belongsTo(LoyaltyTier::class, 'min_tier_id');
    }

    public function redemptions()
    {
        return $this->hasMany(LoyaltyRedemption::class, 'reward_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeAvailable($query)
    {
        return $query->active()
            ->where(function ($q) {
                $q->whereNull('stock')->orWhere('stock', '>', 0);
            })
            ->where(function ($q) {
                $q->whereNull('start_date')->orWhere('start_date', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', now());
            });
    }

    public function scopeForTier($query, $tierId)
    {
        return $query->where(function ($q) use ($tierId) {
            $q->whereNull('min_tier_id')->orWhere('min_tier_id', '<=', $tierId);
        });
    }

    // Methods
    public function canRedeem(LoyaltyMember $member)
    {
        if (!$this->is_available) return false;
        if ($member->current_points < $this->points_required) return false;
        if ($this->min_tier_id && $member->tier_id < $this->min_tier_id) return false;
        return true;
    }

    public function redeem(LoyaltyMember $member)
    {
        if (!$this->canRedeem($member)) {
            return false;
        }

        // Use points
        $member->usePoints($this->points_required, "Redeemed: {$this->name}");

        // Reduce stock if applicable
        if ($this->stock !== null) {
            $this->decrement('stock');
        }

        // Create redemption record
        return LoyaltyRedemption::create([
            'member_id' => $member->id,
            'reward_id' => $this->id,
            'points_used' => $this->points_required,
            'status' => 'pending',
        ]);
    }
}
