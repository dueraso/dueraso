# API Endpoint สำหรับ Employee Performance Report

## Endpoint: `/api/employee-performance` (แนะนำ)

### Request

```
GET /api/employee-performance
```

### Query Parameters

- `branch_id` (required): ID ของสาขา
- `period` (optional): week, month, year (default: month)
- `start_date` (optional): วันที่เริ่มต้น (YYYY-MM-DD)
- `end_date` (optional): วันที่สิ้นสุด (YYYY-MM-DD)

### Response Format

```json
{
  "success": true,
  "data": {
    "employees": [
      {
        "id": 1,
        "name": "สมชาย ใจดี",
        "email": "somchai@example.com",
        "total_orders": 45,
        "total_sales": 125000,
        "total_customers": 38,
        "avg_order_value": 2777.78,
        "orders": [
          {
            "id": 1,
            "timestamp": "2025-11-15T10:30:00",
            "total_price": 1500,
            "customer_id": 10
          }
        ]
      }
    ],
    "summary": {
      "total_employees": 10,
      "active_employees": 8,
      "total_orders": 450,
      "total_sales": 1250000,
      "avg_per_employee": 125000,
      "avg_order_value": 2777.78
    }
  }
}
```

## สำหรับ Backend Developer

### SQL Query ตัวอย่าง (สำหรับสร้าง endpoint)

```sql
SELECT
    u.id,
    CONCAT(u.firstName, ' ', u.lastName) as name,
    u.email,
    COUNT(DISTINCT b.id) as total_orders,
    SUM(b.totalPrice) as total_sales,
    COUNT(DISTINCT b.customer_id) as total_customers,
    AVG(b.totalPrice) as avg_order_value
FROM users u
LEFT JOIN bills b ON b.createdBy = u.id
    AND b.branch_id = :branch_id
    AND b.timestamp >= :start_date
    AND b.timestamp <= :end_date
WHERE u.branch_id = :branch_id
GROUP BY u.id
ORDER BY total_sales DESC
```

### ตัวอย่าง API Controller (PHP/Laravel)

```php
public function getEmployeePerformance(Request $request)
{
    $branchId = $request->input('branch_id');
    $period = $request->input('period', 'month');

    // Calculate date range
    $endDate = now();
    switch ($period) {
        case 'week':
            $startDate = now()->subDays(7);
            break;
        case 'year':
            $startDate = now()->subYear();
            break;
        default: // month
            $startDate = now()->subMonth();
    }

    $employees = User::select([
            'users.id',
            DB::raw("CONCAT(users.firstName, ' ', users.lastName) as name"),
            'users.email',
            DB::raw('COUNT(DISTINCT bills.id) as total_orders'),
            DB::raw('COALESCE(SUM(bills.totalPrice), 0) as total_sales'),
            DB::raw('COUNT(DISTINCT bills.customer_id) as total_customers'),
            DB::raw('COALESCE(AVG(bills.totalPrice), 0) as avg_order_value')
        ])
        ->leftJoin('bills', function($join) use ($branchId, $startDate, $endDate) {
            $join->on('bills.createdBy', '=', 'users.id')
                ->where('bills.branch_id', $branchId)
                ->whereBetween('bills.timestamp', [$startDate, $endDate]);
        })
        ->where('users.branch_id', $branchId)
        ->groupBy('users.id', 'users.firstName', 'users.lastName', 'users.email')
        ->orderByDesc('total_sales')
        ->get();

    $summary = [
        'total_employees' => $employees->count(),
        'active_employees' => $employees->where('total_orders', '>', 0)->count(),
        'total_orders' => $employees->sum('total_orders'),
        'total_sales' => $employees->sum('total_sales'),
        'avg_per_employee' => $employees->count() > 0
            ? $employees->sum('total_sales') / $employees->count()
            : 0,
        'avg_order_value' => $employees->sum('total_orders') > 0
            ? $employees->sum('total_sales') / $employees->sum('total_orders')
            : 0
    ];

    return response()->json([
        'success' => true,
        'data' => [
            'employees' => $employees,
            'summary' => $summary
        ]
    ]);
}
```

### Routes (Laravel)

```php
Route::get('/api/employee-performance', [EmployeeController::class, 'getEmployeePerformance']);
```

## วิธีใช้งานใน Frontend

หลังจากสร้าง API แล้ว ให้แก้ไข `getData()` ใน `employee-performance/index.js`:

```javascript
async getData() {
  if (!this.branchSelect) return;

  this.loading = true;
  try {
    const res = await this.$axios.$get('/employee-performance', {
      params: {
        branch_id: this.branchSelect.id,
        period: this.periodSelect
      },
    });

    if (res.success && res.data) {
      // ใช้ข้อมูลที่จัดกลุ่มแล้วจาก API
      this.employeesData = res.data.employees || [];
      this.summary = res.data.summary || this.summary;

      // เพิ่ม performance rating
      const avgSales = this.summary.avg_per_employee;
      this.employeesData = this.employeesData.map(emp => ({
        ...emp,
        performance: this.getPerformanceRating(emp.total_sales, avgSales),
        percentOfTotal: this.summary.total_sales > 0
          ? (emp.total_sales / this.summary.total_sales) * 100
          : 0
      }));

      this.topEmployees = this.employeesData.slice(0, 10);
      this.prepareChartData();
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  this.loading = false;
}
```

## หมายเหตุ

- ถ้า API `/getBillList` มี field `createdBy` ที่มีข้อมูลพนักงาน (fullName, firstName) อยู่แล้ว ก็สามารถใช้ต่อได้
- แต่ถ้าต้องการประสิทธิภาพที่ดีกว่า ควรสร้าง endpoint ใหม่ที่จัดกลุ่มข้อมูลจาก database เลย
- API ใหม่จะลด load ในการประมวลผลที่ frontend และเร็วกว่ามาก
