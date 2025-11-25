# API Documentation for Inventory Report

## Overview

เอกสารนี้อธิบายการเพิ่ม API endpoints ที่จำเป็นสำหรับระบบรายงานสินค้าคงคลัง

## Required API Endpoints

### 1. Update Product Model (เพิ่ม field stock)

ในตาราง `products` ควรมี field:

- `stock` (integer, default: 0) - จำนวนสินค้าคงเหลือ
- `min_stock` (integer, default: 10) - จำนวนสินค้าขั้นต่ำที่แจ้งเตือน

### 2. GET /posProduct (ปรับปรุง)

**Request:**

```
GET /posProduct?branch={branchId}&type={typeId}&includeStock=true
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "ชื่อสินค้า",
      "price": 100,
      "stock": 25,
      "min_stock": 10,
      "type": {
        "id": 1,
        "name": "ประเภทสินค้า"
      },
      "branch": {
        "id": 1,
        "title": "สาขาหลัก"
      },
      "imageUrl": "{\"fullPath\": \"...\"}"
    }
  ],
  "meta": {
    "total": 50,
    "per_page": 10,
    "current_page": 1
  }
}
```

### 3. GET /inventory/summary (ใหม่)

**Request:**

```
GET /inventory/summary?branch={branchId}&type={typeId}
```

**Response:**

```json
{
  "totalProducts": 150,
  "lowStockProducts": 12,
  "totalValue": 125000.0,
  "totalTypes": 8,
  "byType": [
    {
      "typeId": 1,
      "typeName": "เครื่องดื่ม",
      "totalProducts": 50,
      "totalValue": 45000.0,
      "lowStockCount": 5
    }
  ]
}
```

### 4. GET /inventory/low-stock (ใหม่)

**Request:**

```
GET /inventory/low-stock?branch={branchId}&threshold=10
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "สินค้า A",
      "stock": 5,
      "min_stock": 10,
      "price": 100,
      "type": {
        "id": 1,
        "name": "ประเภท A"
      },
      "imageUrl": "..."
    }
  ]
}
```

### 5. PUT /posProduct/{id}/stock (ใหม่)

**Request:**

```json
{
  "stock": 100,
  "min_stock": 10,
  "action": "set", // or "add", "subtract"
  "note": "รับสินค้าเข้า"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "สินค้า A",
    "stock": 100,
    "previous_stock": 50
  }
}
```

### 6. GET /inventory/history (ใหม่ - Optional)

**Request:**

```
GET /inventory/history?product={productId}&from={date}&to={date}
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "action": "add",
      "quantity": 50,
      "stock_before": 50,
      "stock_after": 100,
      "note": "รับสินค้าเข้า",
      "user": {
        "id": 1,
        "name": "Admin"
      },
      "created_at": "2025-11-15 10:00:00"
    }
  ]
}
```

## Database Schema Changes

### Table: products (ปรับปรุง)

```sql
ALTER TABLE products
ADD COLUMN stock INT DEFAULT 0,
ADD COLUMN min_stock INT DEFAULT 10;
```

### Table: inventory_history (ใหม่ - Optional)

```sql
CREATE TABLE inventory_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  action VARCHAR(20) NOT NULL, -- 'add', 'subtract', 'set'
  quantity INT NOT NULL,
  stock_before INT NOT NULL,
  stock_after INT NOT NULL,
  note TEXT,
  user_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

## Implementation Priority

1. **High Priority (สำหรับรายงานพื้นฐาน):**

   - เพิ่ม field `stock` ใน products table
   - ปรับปรุง GET /posProduct ให้รวม stock
   - สร้าง GET /inventory/summary

2. **Medium Priority (สำหรับฟีเจอร์เพิ่มเติม):**

   - สร้าง GET /inventory/low-stock
   - สร้าง PUT /posProduct/{id}/stock

3. **Low Priority (Optional):**
   - สร้าง inventory_history table
   - สร้าง GET /inventory/history

## Notes

- ในระหว่างที่ยังไม่มี API field `stock` หน้ารายงานจะใช้ข้อมูล mock (random) ชั่วคราว
- เมื่อ API พร้อมใช้งาน ให้ลบ method `getRandomStock()` ออกจาก `/pages/dashboard/inventory-report/index.js`
- ควรมี validation ที่ backend เพื่อไม่ให้ stock เป็นค่าติดลบ
