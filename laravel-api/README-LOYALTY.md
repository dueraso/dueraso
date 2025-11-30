# Loyalty System API

## ภาพรวม

ระบบสะสมแต้ม (Loyalty System) สำหรับ POS System พัฒนาด้วย Laravel

## โครงสร้าง Database

### Tables

1. **loyalty_tiers** - ระดับสมาชิก (Bronze, Silver, Gold, Platinum)
2. **loyalty_members** - ข้อมูลสมาชิก
3. **loyalty_points** - ประวัติแต้ม (ได้รับ/ใช้)
4. **loyalty_rewards** - รางวัลที่แลกได้
5. **loyalty_redemptions** - ประวัติการแลกรางวัล
6. **loyalty_campaigns** - แคมเปญโปรโมชั่น
7. **loyalty_settings** - การตั้งค่าระบบ

## การติดตั้ง

### 1. Run Migrations

```bash
php artisan migrate
```

### 2. Run Seeders

```bash
php artisan db:seed --class=LoyaltySeeder
```

### 3. Add Routes

เพิ่มใน `routes/api.php`:

```php
require __DIR__.'/loyalty.php';
```

## API Endpoints

### Dashboard

- `GET /api/loyalty/dashboard/overview` - ภาพรวมระบบ
- `GET /api/loyalty/dashboard/tier-distribution` - การกระจายตาม Tier
- `GET /api/loyalty/dashboard/points-chart` - กราฟแต้ม
- `GET /api/loyalty/dashboard/recent-members` - สมาชิกล่าสุด
- `GET /api/loyalty/dashboard/recent-redemptions` - การแลกล่าสุด
- `GET /api/loyalty/dashboard/top-members` - สมาชิกยอดนิยม

### Members

- `GET /api/loyalty/members` - รายการสมาชิก (pagination)
- `POST /api/loyalty/members` - เพิ่มสมาชิก
- `GET /api/loyalty/members/search?q=xxx` - ค้นหาสมาชิก
- `GET /api/loyalty/members/phone/{phone}` - ค้นหาด้วยเบอร์
- `GET /api/loyalty/members/{id}` - รายละเอียดสมาชิก
- `PUT /api/loyalty/members/{id}` - แก้ไขสมาชิก
- `DELETE /api/loyalty/members/{id}` - ลบสมาชิก
- `POST /api/loyalty/members/{id}/add-points` - เพิ่มแต้ม
- `POST /api/loyalty/members/{id}/deduct-points` - หักแต้ม
- `GET /api/loyalty/members/{id}/point-history` - ประวัติแต้ม
- `GET /api/loyalty/members/{id}/redemption-history` - ประวัติแลก

### Tiers

- `GET /api/loyalty/tiers` - รายการ Tier
- `POST /api/loyalty/tiers` - เพิ่ม Tier
- `GET /api/loyalty/tiers/{id}` - รายละเอียด Tier
- `PUT /api/loyalty/tiers/{id}` - แก้ไข Tier
- `DELETE /api/loyalty/tiers/{id}` - ลบ Tier

### Points

- `GET /api/loyalty/points` - ประวัติแต้มทั้งหมด
- `GET /api/loyalty/points/statistics` - สถิติแต้ม
- `GET /api/loyalty/points/earned` - แต้มที่ได้รับ
- `GET /api/loyalty/points/used` - แต้มที่ใช้
- `GET /api/loyalty/points/expiring` - แต้มที่กำลังหมดอายุ

### Rewards

- `GET /api/loyalty/rewards` - รายการรางวัล
- `POST /api/loyalty/rewards` - เพิ่มรางวัล
- `GET /api/loyalty/rewards/{id}` - รายละเอียดรางวัล
- `PUT /api/loyalty/rewards/{id}` - แก้ไขรางวัล
- `DELETE /api/loyalty/rewards/{id}` - ลบรางวัล
- `GET /api/loyalty/rewards/available/{memberId}` - รางวัลที่แลกได้
- `POST /api/loyalty/rewards/{id}/redeem` - แลกรางวัล

### Redemptions

- `GET /api/loyalty/redemptions` - ประวัติการแลก
- `GET /api/loyalty/redemptions/{id}` - รายละเอียด
- `POST /api/loyalty/redemptions/{id}/complete` - ยืนยันการแลก
- `POST /api/loyalty/redemptions/{id}/cancel` - ยกเลิกการแลก
- `POST /api/loyalty/redemptions/verify-code` - ตรวจสอบ code

### Campaigns

- `GET /api/loyalty/campaigns` - รายการแคมเปญ
- `POST /api/loyalty/campaigns` - เพิ่มแคมเปญ
- `GET /api/loyalty/campaigns/active` - แคมเปญที่ใช้งาน
- `GET /api/loyalty/campaigns/{id}` - รายละเอียดแคมเปญ
- `PUT /api/loyalty/campaigns/{id}` - แก้ไขแคมเปญ
- `DELETE /api/loyalty/campaigns/{id}` - ลบแคมเปญ
- `POST /api/loyalty/campaigns/{id}/toggle-status` - เปิด/ปิดแคมเปญ

### Settings

- `GET /api/loyalty/settings` - การตั้งค่าทั้งหมด
- `PUT /api/loyalty/settings` - อัพเดทการตั้งค่า
- `POST /api/loyalty/settings/reset` - รีเซ็ตค่าเริ่มต้น
- `POST /api/loyalty/settings/calculate-points` - คำนวณแต้ม

## การใช้งาน LoyaltyService

### ใน Sale Controller

```php
use App\Services\LoyaltyService;

class SaleController extends Controller
{
    protected $loyaltyService;

    public function __construct(LoyaltyService $loyaltyService)
    {
        $this->loyaltyService = $loyaltyService;
    }

    public function store(Request $request)
    {
        // ... save sale ...

        // Process loyalty points
        $loyaltyResult = $this->loyaltyService->processSale(
            $sale,
            $request->loyalty_member_id
        );

        return response()->json([
            'sale' => $sale,
            'loyalty' => $loyaltyResult,
        ]);
    }
}
```

### Preview Points

```php
// Preview points before checkout
$preview = $loyaltyService->previewPoints(1000, $memberId);
// Returns: base_points, multiplier, tier, final_points
```

### Quick Register

```php
// Register member from POS
$result = $loyaltyService->quickRegister(
    '0891234567',
    'สมชาย',
    'ใจดี'
);
```

### Redeem from POS

```php
// Redeem reward
$result = $loyaltyService->redeemFromPOS($memberId, $rewardId);
```

## การตั้งค่าเริ่มต้น

| Key                        | Default | Description                            |
| -------------------------- | ------- | -------------------------------------- |
| system_enabled             | 1       | เปิด/ปิดระบบ                           |
| points_per_baht            | 10      | ซื้อกี่บาทได้ 1 แต้ม                   |
| point_expire_days          | 365     | แต้มหมดอายุภายในกี่วัน                 |
| min_purchase_for_points    | 0       | ยอดซื้อขั้นต่ำที่ได้แต้ม               |
| max_points_per_transaction | 0       | แต้มสูงสุดต่อ transaction (0=ไม่จำกัด) |
| enable_rounding            | 1       | ปัดเศษแต้ม                             |
| enable_birthday_bonus      | 1       | โบนัสวันเกิด                           |
| birthday_bonus_points      | 100     | แต้มโบนัสวันเกิด                       |
| enable_referral            | 1       | ระบบแนะนำเพื่อน                        |
| referral_points            | 50      | แต้มแนะนำเพื่อน                        |

## Tiers

| Tier     | Points       | Multiplier |
| -------- | ------------ | ---------- |
| Bronze   | 0-999        | 1.0x       |
| Silver   | 1,000-4,999  | 1.25x      |
| Gold     | 5,000-19,999 | 1.5x       |
| Platinum | 20,000+      | 2.0x       |
