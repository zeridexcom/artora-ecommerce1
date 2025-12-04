# ✅ Final Deployment Steps

## Backend URL (Railway)
```
https://web-production-a938.up.railway.app
```

## Add to Vercel Environment Variables

1. Go to: Vercel → artora-ecommerce1 → Settings → Environment Variables
2. Add this variable:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://web-production-a938.up.railway.app`
   - **Environments:** Production, Preview, Development (all 3)
3. Click **Save**
4. Vercel will auto-redeploy

## What This Does
Connects your live frontend (Vercel) to your live backend (Railway), enabling:
- ✅ Shopping Cart
- ✅ User Authentication
- ✅ Checkout/Payments
- ✅ Admin Panel
- ✅ Full E-commerce Functionality
