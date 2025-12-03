# Artora E-commerce Platform 🚀

> **Live Demo:** [Coming Soon](https://artora-ecommerce1.vercel.app)

A full-stack e-commerce platform for framed artwork, built with Next.js and Node.js, featuring the beautiful Artora Shopify theme design.

## 🎨 Features

### Customer Features
- ✅ Beautiful, responsive UI matching Artora Shopify theme
- ✅ Product browsing with categories and search
- ✅ Shopping cart with localStorage persistence
- ✅ User authentication (register/login)
- ✅ Wishlist functionality
- ✅ Order history and tracking
- ✅ Secure checkout with Stripe
- ✅ Multiple shipping addresses

### Admin Features
- ✅ Admin dashboard with analytics
- ✅ Product management (CRUD)
- ✅ Inventory tracking with low stock alerts
- ✅ Order management
- ✅ Customer management
- ✅ Payment processing and refunds

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Stripe account (for payments)

### Installation

1. **Clone and navigate to the project**
```bash
cd artora-home-4
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
MONGODB_URI=mongodb://localhost:27017/artora-ecommerce
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. **Start MongoDB** (if running locally)
```bash
mongod
```

5. **Run the development servers**

In one terminal (Backend):
```bash
npm run server
```

In another terminal (Frontend):
```bash
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

## 📁 Project Structure

```
artora-home-4/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Homepage
│   ├── products/          # Product pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   ├── account/           # User account
│   └── admin/             # Admin panel
├── components/            # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── sections/          # Homepage sections
├── context/               # React context providers
│   ├── CartContext.tsx
│   └── AuthContext.tsx
├── server/                # Backend server
│   ├── index.js           # Express server
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── middleware/        # Auth middleware
└── public/                # Static assets
```

## 🔐 Admin Access

To create an admin user, you can either:

1. **Via MongoDB directly**:
```javascript
db.users.updateOne(
  { email: "admin@artora.com" },
  { $set: { role: "admin" } }
)
```

2. **Via API after registration**:
Register a user normally, then update their role in the database.

## 🛍️ Usage

### Adding Products

1. Login to admin panel at `/admin`
2. Navigate to Products
3. Click "Add Product"
4. Fill in product details:
   - Name, description, price
   - Upload images
   - Set category
   - Configure inventory
5. Save product

### Managing Orders

1. Go to `/admin/orders`
2. View all orders with filters
3. Update order status
4. Add tracking numbers
5. Process refunds if needed

### Inventory Management

- Real-time stock tracking
- Low stock alerts (configurable threshold)
- Automatic inventory reduction on purchase
- Inventory restoration on order cancellation

## 💳 Payment Integration

This platform uses Stripe for payment processing:

1. Get your Stripe keys from https://dashboard.stripe.com/apikeys
2. Add them to `.env`
3. For testing, use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

## 📧 Email Notifications

Configure email service in `.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🎨 Customization

### Changing Colors
Edit `app/globals.css`:
```css
:root {
  --color-primary: 0, 0, 0;
  --color-background: 255, 255, 255;
}
```

### Updating Content
- Homepage sections: `app/page.tsx`
- Header/Footer: `components/Header.tsx` and `components/Footer.tsx`
- Product categories: Update in `server/models/Product.js`

## 🚢 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create cluster at mongodb.com/cloud/atlas
2. Get connection string
3. Update `MONGODB_URI` in production environment

## 🔧 Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
npm run build
npm start
```

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders/my-orders` - Get user orders
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update status (admin)
- `PATCH /api/orders/:id/cancel` - Cancel order

### Payment
- `POST /api/payment/create-intent` - Create payment intent
- `POST /api/payment/confirm` - Confirm payment
- `POST /api/payment/refund` - Process refund (admin)

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access in MongoDB Atlas

### Stripe Payment Fails
- Verify Stripe keys are correct
- Check if using test mode keys in development
- Ensure webhook endpoint is configured

### Images Not Loading
- Check image paths in `public/` directory
- Verify Next.js image domains in `next.config.js`
- Ensure Cloudinary credentials are set (if using)

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check server logs for errors

---

Built with ❤️ using Next.js, Express, MongoDB, and Stripe
