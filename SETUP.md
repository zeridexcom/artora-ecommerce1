# Artora E-commerce Platform - Setup Guide

## Initial Setup

### 1. Install Dependencies

```bash
cd artora-home-4
npm install
```

This will install all required packages for both frontend and backend.

### 2. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Or run manually
mongod --config /usr/local/etc/mongod.conf
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Add to `.env` file

### 3. Configure Environment Variables

Copy the example file:
```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/artora-ecommerce
# Or for Atlas: mongodb+srv://username:password@cluster.mongodb.net/artora

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Stripe (Get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Email (Optional - for order confirmations)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Start the Application

**Development Mode:**

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run dev
```

**Or run both concurrently:**
```bash
npm run dev:all
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## Creating Your First Admin User

### Method 1: Via MongoDB Shell

```bash
# Connect to MongoDB
mongosh

# Use the database
use artora-ecommerce

# Create admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@artora.com",
  password: "$2a$10$YourHashedPasswordHere", // You'll need to hash this
  role: "admin",
  active: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Method 2: Register then Promote

1. Register a normal user at http://localhost:3000/register
2. Then in MongoDB:
```bash
mongosh
use artora-ecommerce
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Adding Sample Products

You can add products via the admin panel or use this script:

```javascript
// save as seed-products.js
const mongoose = require('mongoose');
const Product = require('./server/models/Product');

mongoose.connect('mongodb://localhost:27017/artora-ecommerce');

const sampleProducts = [
  {
    name: "Abstract Minimalist Art",
    description: "Clean lines and bold forms in a modern frame",
    price: 149.99,
    category: "modern",
    images: [{ url: "/images/products/product-1.jpg", alt: "Abstract art" }],
    inventory: { quantity: 50, lowStockThreshold: 10 },
    featured: true,
    active: true,
  },
  // Add more products...
];

Product.insertMany(sampleProducts)
  .then(() => {
    console.log('Products added!');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
```

Run with: `node seed-products.js`

## Setting Up Stripe

1. **Create Stripe Account**: https://dashboard.stripe.com/register

2. **Get API Keys**:
   - Go to https://dashboard.stripe.com/apikeys
   - Copy "Publishable key" and "Secret key"
   - Add to `.env` file

3. **Test Cards**:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - 3D Secure: `4000 0025 0000 3155`

4. **Webhook Setup** (for production):
   - Go to https://dashboard.stripe.com/webhooks
   - Add endpoint: `https://yourdomain.com/api/payment/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook secret to `.env`

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000 or 3001
lsof -i :3000
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### MongoDB Connection Error

```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
brew services start mongodb-community

# Check logs
tail -f /usr/local/var/log/mongodb/mongo.log
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Stripe Webhook Testing (Local)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3001/api/payment/webhook
```

## Next Steps

1. ✅ Customize the homepage content in `app/page.tsx`
2. ✅ Add your logo images to `public/images/`
3. ✅ Configure email settings for order confirmations
4. ✅ Set up Cloudinary for product image uploads
5. ✅ Add your products via admin panel
6. ✅ Test the complete checkout flow
7. ✅ Deploy to production (see README.md)

## Production Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use production Stripe keys
- [ ] Set up MongoDB Atlas for database
- [ ] Configure email service
- [ ] Set up SSL/HTTPS
- [ ] Enable Stripe webhooks
- [ ] Set up backup strategy for database
- [ ] Configure CDN for images
- [ ] Set up monitoring and logging
- [ ] Test all payment flows
- [ ] Review security settings

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review server logs: `npm run server`
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

---

Happy selling! 🎨
