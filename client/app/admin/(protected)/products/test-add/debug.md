# Product Creation Debug Checklist

## Issues Fixed:
1. ✅ Fixed price field registration bug in `/add/page.tsx`
2. ✅ Changed server schema to accept `price` as number (not string)

## What to Check:

### 1. Authentication
- Are you logged in as ADMIN?
- Check browser DevTools → Application → Cookies for `access_token`
- Server requires `authMiddleware` + `requireRole("ADMIN")` for POST /api/product

### 2. Form Validation
Before submitting, ensure:
- Product name is filled
- Slug is filled
- Category is selected (not 0)
- At least one variant is added with:
  - SKU filled
  - Price > 0
  - Stock >= 0

### 3. Check Browser Console
Look for:
- Form validation errors
- Network errors (401 Unauthorized, 403 Forbidden, 400 Bad Request)
- Console logs from the submit handler

### 4. Check Server Logs
In `server/logs/combined.log` or console:
- Request received?
- Validation errors?
- Database errors?

### 5. Test with Minimal Data
```json
{
  "name": "Test Product",
  "slug": "test-product-123",
  "description": "Test description",
  "category_id": 1,
  "images": [],
  "variants": [
    {
      "color_id": null,
      "size_id": null,
      "sku": "TEST-001",
      "price": 29.99,
      "stock": 10,
      "images": []
    }
  ]
}
```

## Common Errors:

### "Category not found" → category_id = 0 or invalid
### "Product with this slug already exists" → Change slug
### 401/403 → Not authenticated or not ADMIN role
### Price validation error → Price must be > 0
