<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class LoyaltyMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_code',
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'birth_date',
        'tier_id',
        'current_points',
        'total_earned_points',
        'total_spent_points',
        'join_date',
        'last_activity_date',
        'referral_code',
        'referred_by',
        'is_active',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'join_date' => 'date',
        'last_activity_date' => 'datetime',
        'current_points' => 'integer',
        'total_earned_points' => 'integer',
        'total_spent_points' => 'integer',
        'is_active' => 'boolean',
    ];

    protected $appends = ['full_name', 'tier_name'];

    // Accessors
    public function getFullNameAttribute()
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    public function getTierNameAttribute()
    {
        return $this->tier ? $this->tier->name : 'Bronze';
    }

    // Relations
    public function tier()
    {
        return $this->belongsTo(LoyaltyTier::class, 'tier_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function points()
    {
        return $this->hasMany(LoyaltyPoint::class, 'member_id');
    }

    public function redemptions()
    {
        return $this->hasMany(LoyaltyRedemption::class, 'member_id');
    }

    public function referrer()
    {
        return $this->belongsTo(LoyaltyMember::class, 'referred_by');
    }

    public function referrals()
    {
        return $this->hasMany(LoyaltyMember::class, 'referred_by');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('member_code', 'like', "%{$search}%")
                ->orWhere('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%");
        });
    }

    // Methods
    public function addPoints($points, $type = 'purchase', $description = null, $reference = null)
    {
        $multiplier = $this->tier ? $this->tier->multiplier : 1.0;
        $earnedPoints = (int)($points * $multiplier);

        LoyaltyPoint::create([
            'member_id' => $this->id,
            'points' => $earnedPoints,
            'type' => $type,
            'description' => $description,
            'reference_type' => $reference ? get_class($reference) : null,
            'reference_id' => $reference ? $reference->id : null,
            'expire_date' => $this->calculateExpireDate(),
        ]);

        $this->current_points += $earnedPoints;
        $this->total_earned_points += $earnedPoints;
        $this->last_activity_date = now();
        $this->save();

        $this->checkTierUpgrade();

        return $earnedPoints;
    }

    public function usePoints($points, $description = null, $reference = null)
    {
        if ($this->current_points < $points) {
            return false;
        }

        LoyaltyPoint::create([
            'member_id' => $this->id,
            'points' => -$points,
            'type' => 'redemption',
            'description' => $description,
            'reference_type' => $reference ? get_class($reference) : null,
            'reference_id' => $reference ? $reference->id : null,
        ]);

        $this->current_points -= $points;
        $this->total_spent_points += $points;
        $this->last_activity_date = now();
        $this->save();

        return true;
    }

    public function checkTierUpgrade()
    {
        $newTier = LoyaltyTier::getTierByPoints($this->total_earned_points);
        if ($newTier && (!$this->tier_id || $newTier->id != $this->tier_id)) {
            $this->tier_id = $newTier->id;
            $this->save();
        }
    }

    protected function calculateExpireDate()
    {
        $expireDays = LoyaltySetting::get('point_expire_days', 365);
        return Carbon::now()->addDays($expireDays);
    }

    public static function generateMemberCode()
    {
        do {
            $code = 'LM' . str_pad(mt_rand(1, 9999999), 7, '0', STR_PAD_LEFT);
        } while (self::where('member_code', $code)->exists());

        return $code;
    }

    public static function generateReferralCode()
    {
        do {
            $code = strtoupper(substr(md5(uniqid()), 0, 8));
        } while (self::where('referral_code', $code)->exists());

        return $code;
    }
}
