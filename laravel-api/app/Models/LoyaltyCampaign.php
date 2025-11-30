<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltyCampaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'type',
        'multiplier',
        'bonus_points',
        'conditions',
        'start_date',
        'end_date',
        'icon',
        'color',
        'is_active',
    ];

    protected $casts = [
        'multiplier' => 'decimal:2',
        'bonus_points' => 'integer',
        'conditions' => 'array',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
    ];

    protected $appends = ['status'];

    // Accessors
    public function getStatusAttribute()
    {
        if (!$this->is_active) return 'inactive';
        if ($this->start_date && $this->start_date > now()) return 'scheduled';
        if ($this->end_date && $this->end_date < now()) return 'ended';
        return 'active';
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('start_date')->orWhere('start_date', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', now());
            });
    }

    public function scopeScheduled($query)
    {
        return $query->where('is_active', true)
            ->where('start_date', '>', now());
    }

    public function scopeEnded($query)
    {
        return $query->where('end_date', '<', now());
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    // Methods
    public function calculateBonus($basePoints)
    {
        $bonus = 0;

        if ($this->type === 'multiplier' && $this->multiplier > 1) {
            $bonus = (int)($basePoints * ($this->multiplier - 1));
        } elseif ($this->type === 'bonus' && $this->bonus_points > 0) {
            $bonus = $this->bonus_points;
        }

        return $bonus;
    }

    public function checkConditions($context = [])
    {
        if (empty($this->conditions)) return true;

        foreach ($this->conditions as $condition) {
            $field = $condition['field'] ?? null;
            $operator = $condition['operator'] ?? '=';
            $value = $condition['value'] ?? null;

            if (!isset($context[$field])) continue;

            $contextValue = $context[$field];

            switch ($operator) {
                case '=':
                    if ($contextValue != $value) return false;
                    break;
                case '!=':
                    if ($contextValue == $value) return false;
                    break;
                case '>':
                    if ($contextValue <= $value) return false;
                    break;
                case '>=':
                    if ($contextValue < $value) return false;
                    break;
                case '<':
                    if ($contextValue >= $value) return false;
                    break;
                case '<=':
                    if ($contextValue > $value) return false;
                    break;
                case 'in':
                    if (!in_array($contextValue, (array)$value)) return false;
                    break;
            }
        }

        return true;
    }

    public static function getActiveCampaigns()
    {
        return self::active()->get();
    }
}
