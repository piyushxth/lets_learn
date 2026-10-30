# Quick Start - Product Creation Testing

## ✅ Pre-Flight Checklist

### 1. Start Servers
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

### 2. Verify Servers Are Running
- ✅ Backend: http://localhost:5000 shows "API is running!"
- ✅ Frontend: http://localhost:3000 loads

### 3. Login as Admin
- ✅ Go to: http://localhost:3000/admin/login
- ✅ Login with admin credentials
- ✅ Should redirect to admin dashboard

### 4. Check Database Has Required Data
Run this in your database:
```sql
-- Check categories exist
SELECT id, name FROM "Category" WHERE deleted_at IS NULL;

-- Check colors exist (optional)
SELECT id, name FROM "Color";

-- Check sizes exist (optional)  
SELECT id, name FROM "Size";
```

If no categories exist, create one:
```sql
INSERT INTO "Category" (name) VALUES ('Test Category');
```

---

## 🚀 Test Product Creation

### Go to Test Page
Navigate to: http://localhost:3000/admin/products/test-add

### Fill the Form (Minimal Required Fields)
1. **Product Name:** My Test Product
2. **Slug:** my-test-product-001 *(must be unique)*
3. **Description:** *(optional)*
4. **Category:** Select from dropdown
5. Click **"Add Variant"** button
6. In the variant section:
   - **SKU:** TEST-SKU-001
   - **Price:** 29.99 *(must be > 0)*
   - **Stock:** 10
7. Click **"Create Product"**

---

## 🔍 What to Look For

### Success ✅
- Green toast notification: "Product created successfully"
- Console log: "✅ Product created:"
- Product appears in the products list

### Failure ❌
Open Browser DevTools (F12) and check:

**Console Tab:**
- Look for error messages
- Check form validation errors
- Look for "❌ Failed to create product"

**Network Tab:**
- Find POST request to `/api/product`
- Check status code:
  - **400** = Validation error (check response for details)
  - **401** = Not authenticated (need to login)
  - **403** = Not authorized (user is not ADMIN)
  - **404** = Category not found
  - **409** = Slug already exists
  - **500** = Server error (check server logs)

---

## 🐛 Quick Debugging

### Issue: Form doesn't submit
**Check:**
- All required fields filled?
- At least one variant added?
- Price > 0?
- Category selected?

### Issue: 401 Unauthorized
**Solution:**
1. Logout
2. Login again as admin
3. Try again

### Issue: 403 Forbidden  
**Solution:**
Check user role in database:
```sql
SELECT email, role FROM "User" WHERE email = 'your-email@example.com';
```
Should be 'ADMIN', not 'USER'

### Issue: 404 Category not found
**Solution:**
Select a valid category from dropdown, or create one in database

### Issue: 409 Slug exists
**Solution:**
Change the slug to something unique like: `test-product-002`

---

## 📋 Files Changed

If issues persist, these files were modified:
1. ✅ `server/src/schemas/product.schema.ts` - Fixed price type
2. ✅ `client/schemas/product.schema.ts` - Added price validation  
3. ✅ `client/app/admin/(protected)/products/add/page.tsx` - Fixed price field
4. ✅ `client/components/admin/ProductForm.tsx` - Better error handling

**Restart both servers after these changes!**

---

## Still Not Working?

1. Check `server/logs/combined.log` for errors
2. Check browser console for detailed errors
3. Test with the minimal payload in `PRODUCT_CREATION_FIX.md`
4. Verify PostgreSQL is running and connected
