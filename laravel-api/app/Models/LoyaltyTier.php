<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltyTier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'min_points',
        'max_points',
        'multiplier',
        'color',
        'icon',
        'perks',
        'is_active',
    ];

    protected $casts = [
        'min_points' => 'integer',
        'max_points' => 'integer',
        'multiplier' => 'decimal:2',
        'perks' => 'array',
        'is_active' => 'boolean',
    ];

    // Relations
    public function members()
    {
        return $this->hasMany(LoyaltyMember::class, 'tier_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Helpers
    public static function getTierByPoints($points)
    {
        return self::active()
            ->where('min_points', '<=', $points)
            ->where(function ($query) use ($points) {
                $query->where('max_points', '>=', $points)
                    ->orWhereNull('max_points');
            })
            ->orderBy('min_points', 'desc')
            ->first();
    }
}
