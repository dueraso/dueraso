<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltyRedemption extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'reward_id',
        'code',
        'points_used',
        'status',
        'redeemed_at',
        'expire_at',
        'notes',
    ];

    protected $casts = [
        'points_used' => 'integer',
        'redeemed_at' => 'datetime',
        'expire_at' => 'datetime',
    ];

    // Boot
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($redemption) {
            if (!$redemption->code) {
                $redemption->code = self::generateCode();
            }
        });
    }

    // Relations
    public function member()
    {
        return $this->belongsTo(LoyaltyMember::class, 'member_id');
    }

    public function reward()
    {
        return $this->belongsTo(LoyaltyReward::class, 'reward_id');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'expired');
    }

    // Methods
    public function markAsCompleted()
    {
        $this->update([
            'status' => 'completed',
            'redeemed_at' => now(),
        ]);
    }

    public function markAsExpired()
    {
        $this->update(['status' => 'expired']);
    }

    public function cancel()
    {
        // Refund points
        $this->member->current_points += $this->points_used;
        $this->member->total_spent_points -= $this->points_used;
        $this->member->save();

        // Restore stock
        if ($this->reward->stock !== null) {
            $this->reward->increment('stock');
        }

        $this->update(['status' => 'cancelled']);
    }

    public static function generateCode()
    {
        do {
            $code = 'RD' . strtoupper(substr(md5(uniqid()), 0, 8));
        } while (self::where('code', $code)->exists());

        return $code;
    }
}
