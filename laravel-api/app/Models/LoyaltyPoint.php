<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltyPoint extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'points',
        'type',
        'description',
        'reference_type',
        'reference_id',
        'expire_date',
        'is_expired',
    ];

    protected $casts = [
        'points' => 'integer',
        'expire_date' => 'date',
        'is_expired' => 'boolean',
    ];

    // Relations
    public function member()
    {
        return $this->belongsTo(LoyaltyMember::class, 'member_id');
    }

    public function reference()
    {
        return $this->morphTo();
    }

    // Scopes
    public function scopeEarned($query)
    {
        return $query->where('points', '>', 0);
    }

    public function scopeUsed($query)
    {
        return $query->where('points', '<', 0);
    }

    public function scopeNotExpired($query)
    {
        return $query->where('is_expired', false)
            ->where(function ($q) {
                $q->whereNull('expire_date')
                    ->orWhere('expire_date', '>=', now());
            });
    }

    public function scopeExpiring($query, $days = 30)
    {
        return $query->where('is_expired', false)
            ->whereNotNull('expire_date')
            ->where('expire_date', '<=', now()->addDays($days))
            ->where('expire_date', '>=', now());
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeDateRange($query, $startDate, $endDate)
    {
        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }
        return $query;
    }

    // Static Methods
    public static function expirePoints()
    {
        return self::where('is_expired', false)
            ->where('points', '>', 0)
            ->whereNotNull('expire_date')
            ->where('expire_date', '<', now())
            ->update(['is_expired' => true]);
    }
}
