<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class LoyaltySetting extends Model
{
    protected $fillable = ['key', 'value'];

    public $timestamps = true;

    // Get setting value with caching
    public static function get($key, $default = null)
    {
        return Cache::remember("loyalty_setting_{$key}", 3600, function () use ($key, $default) {
            $setting = self::where('key', $key)->first();
            return $setting ? $setting->value : $default;
        });
    }

    // Set setting value
    public static function set($key, $value)
    {
        $setting = self::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );

        Cache::forget("loyalty_setting_{$key}");
        Cache::forget('loyalty_settings_all');

        return $setting;
    }

    // Get all settings as array
    public static function getAll()
    {
        return Cache::remember('loyalty_settings_all', 3600, function () {
            return self::pluck('value', 'key')->toArray();
        });
    }

    // Set multiple settings
    public static function setMany(array $settings)
    {
        foreach ($settings as $key => $value) {
            self::set($key, $value);
        }
    }

    // Check if system is enabled
    public static function isEnabled()
    {
        return (bool) self::get('system_enabled', true);
    }

    // Get points per baht
    public static function getPointsPerBaht()
    {
        return (int) self::get('points_per_baht', 10);
    }

    // Get point expire days
    public static function getPointExpireDays()
    {
        return (int) self::get('point_expire_days', 365);
    }

    // Calculate points from amount
    public static function calculatePoints($amount)
    {
        if (!self::isEnabled()) return 0;

        $minPurchase = (float) self::get('min_purchase_for_points', 0);
        if ($amount < $minPurchase) return 0;

        $pointsPerBaht = self::getPointsPerBaht();
        $points = (int) ($amount / $pointsPerBaht);

        $maxPoints = (int) self::get('max_points_per_transaction', 0);
        if ($maxPoints > 0 && $points > $maxPoints) {
            $points = $maxPoints;
        }

        $enableRounding = (bool) self::get('enable_rounding', true);
        if ($enableRounding) {
            $points = (int) round($points);
        }

        return $points;
    }
}
