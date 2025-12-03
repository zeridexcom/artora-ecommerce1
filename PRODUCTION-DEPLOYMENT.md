# 🚀 Production Deployment Guide - High Traffic E-commerce
## For 100,000+ Customers | 1 Lakh+ Daily Traffic

---

## 🎯 Architecture Overview

For your scale, you need:
- ✅ **Auto-scaling infrastructure**
- ✅ **CDN for global performance**
- ✅ **Database clustering & replication**
- ✅ **Redis caching layer**
- ✅ **Load balancing**
- ✅ **99.9% uptime SLA**

---

## 📊 Recommended Infrastructure

### **Tier 1: Production-Grade Setup (Recommended)**

| Component | Service | Specs | Monthly Cost |
|-----------|---------|-------|--------------|
| **Frontend** | Vercel Pro | Auto-scaling, Global CDN | $20/month |
| **Backend** | Railway/Render | 4GB RAM, Auto-scale | $25-50/month |
| **Database** | MongoDB Atlas M10 | 2GB RAM, Replica Set | $57/month |
| **Redis Cache** | Upstash/Redis Cloud | 1GB | $10/month |
| **CDN** | Cloudflare Pro | Unlimited bandwidth | $20/month |
| **Monitoring** | Sentry + LogRocket | Error tracking | $26/month |
| **Total** | | | **~$158-183/month** |

### **Tier 2: Enterprise Setup (For 500K+ traffic)**

| Component | Service | Specs | Monthly Cost |
|-----------|---------|-------|--------------|
| **Frontend** | Vercel Enterprise | Multi-region, DDoS protection | $150/month |
| **Backend** | AWS ECS/Fargate | Auto-scaling containers | $200/month |
| **Database** | MongoDB Atlas M30 | 8GB RAM, Sharding | $240/month |
| **Redis** | AWS ElastiCache | 6GB | $100/month |
| **CDN** | Cloudflare Business | Advanced DDoS | $200/month |
| **Total** | | | **~$890/month** |

---

## 🔧 Step-by-Step Production Deployment

### **Phase 1: Database Setup (MongoDB Atlas)**

#### 1.1 Create Production Cluster

```bash
# Go to: https://cloud.mongodb.com
# Create account → New Project → Build Cluster

Cluster Configuration:
- Provider: AWS (recommended) or Google Cloud
- Region: Choose closest to your users (e.g., Mumbai for India)
- Tier: M10 (minimum for production)
- Enable: Backup, Monitoring, Performance Advisor
```

#### 1.2 Configure Security

```bash
# Network Access
- Add IP: 0.0.0.0/0 (for cloud deployment)
- Or whitelist specific IPs

# Database User
Username: artora-admin
Password: [Generate strong password]
Role: Atlas admin
```

#### 1.3 Get Connection String

```
mongodb+srv://artora-admin:<password>@cluster0.xxxxx.mongodb.net/artora-production?retryWrites=true&w=majority
```

#### 1.4 Optimize for High Traffic

```javascript
// Add to server/index.js
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 50,        // Increase connection pool
  minPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,              // Use IPv4
});
```

---

### **Phase 2: Redis Caching Layer**

#### 2.1 Set Up Redis (Upstash - Recommended)

```bash
# Go to: https://upstash.com
# Create Redis database
# Copy connection details
```

#### 2.2 Install Redis Client

```bash
npm install ioredis
```

#### 2.3 Create Cache Middleware

Create `server/middleware/cache.js`:

```javascript
const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL);

const cache = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      res.originalJson = res.json;
      res.json = (data) => {
        redis.setex(key, duration, JSON.stringify(data));
        res.originalJson(data);
      };
      next();
    } catch (error) {
      next();
    }
  };
};

module.exports = { cache, redis };
```

#### 2.4 Apply Caching to Routes

```javascript
// In server/routes/products.js
const { cache } = require('../middleware/cache');

// Cache product list for 5 minutes
router.get('/', cache(300), async (req, res) => {
  // ... existing code
});

// Cache single product for 10 minutes
router.get('/:id', cache(600), async (req, res) => {
  // ... existing code
});
```

---

### **Phase 3: Backend Deployment (Railway)**

#### 3.1 Prepare for Deployment

Add to `package.json`:

```json
{
  "scripts": {
    "start": "node server/index.js",
    "build": "next build",
    "server:prod": "NODE_ENV=production node server/index.js"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

#### 3.2 Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

#### 3.3 Set Environment Variables in Railway

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=[strong-random-string]
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
REDIS_URL=redis://...
NEXT_PUBLIC_API_URL=https://your-api.railway.app
```

#### 3.4 Enable Auto-Scaling

```yaml
# railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 2,
    "restartPolicyType": "ON_FAILURE",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100
  }
}
```

---

### **Phase 4: Frontend Deployment (Vercel)**

#### 4.1 Connect to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### 4.2 Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://your-api.railway.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

#### 4.3 Configure Custom Domain

```bash
# In Vercel Dashboard
Domains → Add Domain → artora.com
Add DNS records as instructed
```

#### 4.4 Enable Performance Features

```javascript
// next.config.js - Update for production
module.exports = {
  images: {
    domains: ['cdn.shopify.com', 'res.cloudinary.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Enable SWC minification
  swcMinify: true,
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};
```

---

### **Phase 5: CDN & Performance (Cloudflare)**

#### 5.1 Set Up Cloudflare

```bash
1. Go to: https://cloudflare.com
2. Add your domain
3. Update nameservers at your domain registrar
4. Enable:
   - Auto Minify (JS, CSS, HTML)
   - Brotli compression
   - HTTP/3 (QUIC)
   - Early Hints
   - Rocket Loader
```

#### 5.2 Configure Caching Rules

```
Cache Everything:
- URL: artora.com/*
- Edge Cache TTL: 1 month
- Browser Cache TTL: 4 hours

Bypass Cache:
- URL: artora.com/api/*
- URL: artora.com/admin/*
- URL: artora.com/checkout/*
```

#### 5.3 Enable DDoS Protection

```
Security → DDoS → Enable
Firewall Rules:
- Block bad bots
- Challenge suspicious traffic
- Rate limiting: 100 requests/minute per IP
```

---

### **Phase 6: Monitoring & Alerts**

#### 6.1 Set Up Sentry (Error Tracking)

```bash
npm install @sentry/nextjs @sentry/node
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

#### 6.2 Set Up Uptime Monitoring

```bash
# Use: UptimeRobot (free) or Pingdom
Monitor URLs:
- https://artora.com
- https://artora.com/api/health
- https://artora.com/products

Alert via: Email, SMS, Slack
Check interval: 1 minute
```

#### 6.3 Performance Monitoring

```bash
# Add to package.json
"dependencies": {
  "@vercel/analytics": "^1.0.0",
  "web-vitals": "^3.0.0"
}
```

```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

### **Phase 7: Database Optimization for High Traffic**

#### 7.1 Create Indexes

```javascript
// Add to server/models/Product.js
productSchema.index({ category: 1, active: 1 });
productSchema.index({ featured: 1, active: 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Add to server/models/Order.js
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 }, { unique: true });

// Add to server/models/User.js
userSchema.index({ email: 1 }, { unique: true });
```

#### 7.2 Enable Read Replicas

```javascript
// In MongoDB Atlas Dashboard
Clusters → Configuration → Add Read Replica
Region: Same as primary or closest to users
```

#### 7.3 Connection Pooling

```javascript
// server/index.js
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 100,      // For high traffic
  minPoolSize: 20,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
});
```

---

### **Phase 8: Security Hardening**

#### 8.1 Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
// server/index.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: 'Too many requests, please try again later.'
});

app.use('/api/', limiter);

// Stricter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.'
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

#### 8.2 Helmet.js for Security Headers

```bash
npm install helmet
```

```javascript
// server/index.js
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "js.stripe.com"],
      frameSrc: ["js.stripe.com"],
    },
  },
}));
```

#### 8.3 CORS Configuration

```javascript
// server/index.js
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

### **Phase 9: Stripe Production Setup**

#### 9.1 Switch to Live Mode

```bash
# In Stripe Dashboard
Developers → API Keys → Reveal live key
Copy: sk_live_... and pk_live_...
```

#### 9.2 Configure Webhooks

```bash
# In Stripe Dashboard
Developers → Webhooks → Add endpoint

Endpoint URL: https://your-api.railway.app/api/payment/webhook

Events to send:
- payment_intent.succeeded
- payment_intent.payment_failed
- charge.refunded

Copy webhook signing secret: whsec_...
```

#### 9.3 Test Webhook

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3001/api/payment/webhook

# Test
stripe trigger payment_intent.succeeded
```

---

### **Phase 10: Load Testing**

#### 10.1 Install k6

```bash
# Download from: https://k6.io/docs/getting-started/installation/
```

#### 10.2 Create Load Test Script

Create `load-test.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up to 100 users
    { duration: '5m', target: 100 },   // Stay at 100 users
    { duration: '2m', target: 1000 },  // Ramp up to 1000 users
    { duration: '5m', target: 1000 },  // Stay at 1000 users
    { duration: '2m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% errors
  },
};

export default function () {
  const res = http.get('https://artora.com/api/products');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

#### 10.3 Run Load Test

```bash
k6 run load-test.js
```

---

## ✅ Pre-Launch Checklist

### Database
- [ ] MongoDB Atlas M10+ cluster configured
- [ ] Indexes created on all collections
- [ ] Backup enabled (Point-in-time recovery)
- [ ] Connection pooling optimized
- [ ] Read replicas configured

### Backend
- [ ] Deployed to Railway/Render
- [ ] Environment variables set
- [ ] Redis caching enabled
- [ ] Rate limiting configured
- [ ] Health check endpoint working
- [ ] Auto-scaling enabled

### Frontend
- [ ] Deployed to Vercel
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Image optimization enabled
- [ ] Analytics integrated

### Security
- [ ] Helmet.js configured
- [ ] CORS properly set
- [ ] Rate limiting active
- [ ] JWT secret is strong random string
- [ ] All API keys are LIVE (not test)
- [ ] Stripe webhooks configured

### Performance
- [ ] Cloudflare CDN active
- [ ] Caching rules configured
- [ ] Compression enabled
- [ ] Load testing passed (1000+ concurrent users)
- [ ] Response time < 500ms (p95)

### Monitoring
- [ ] Sentry error tracking active
- [ ] Uptime monitoring configured
- [ ] Performance monitoring enabled
- [ ] Alerts configured (Email/SMS/Slack)
- [ ] Log aggregation set up

### Stripe
- [ ] Live API keys configured
- [ ] Webhooks working
- [ ] Test transactions successful
- [ ] Refund process tested

---

## 🚨 Emergency Procedures

### If Site Goes Down

```bash
1. Check status: https://status.vercel.com, https://status.railway.app
2. Check MongoDB Atlas: https://cloud.mongodb.com
3. Check logs in Railway/Vercel dashboard
4. Check Sentry for errors
5. Rollback if needed: vercel rollback
```

### If Database is Slow

```bash
1. Check MongoDB Atlas Performance Advisor
2. Add missing indexes
3. Scale up cluster tier
4. Enable sharding if needed
```

### If High Error Rate

```bash
1. Check Sentry dashboard
2. Check API logs in Railway
3. Increase server resources
4. Enable auto-scaling
```

---

## 📊 Expected Performance

With this setup, you should achieve:

- ✅ **Response Time**: < 200ms (India), < 500ms (Global)
- ✅ **Uptime**: 99.9% SLA
- ✅ **Concurrent Users**: 10,000+
- ✅ **Daily Traffic**: 1 lakh+ easily
- ✅ **Database Queries**: < 50ms average
- ✅ **Page Load**: < 2 seconds (LCP)
- ✅ **Error Rate**: < 0.1%

---

## 💰 Cost Breakdown (Monthly)

| Traffic Level | Infrastructure Cost | Recommended Tier |
|---------------|-------------------|------------------|
| 0-50K users | $158/month | Tier 1 |
| 50K-200K users | $300/month | Tier 1 + Scale |
| 200K-500K users | $600/month | Tier 2 |
| 500K+ users | $890+/month | Tier 2 + Custom |

---

## 🎯 Next Steps

1. **Set up MongoDB Atlas** (30 minutes)
2. **Deploy Backend to Railway** (20 minutes)
3. **Deploy Frontend to Vercel** (15 minutes)
4. **Configure Cloudflare** (20 minutes)
5. **Set up Monitoring** (15 minutes)
6. **Load Testing** (30 minutes)
7. **Go Live!** 🚀

**Total Setup Time**: ~2-3 hours

---

**Ready for 1 Lakh+ Daily Traffic! 🎉**
