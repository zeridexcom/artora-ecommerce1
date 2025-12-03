const Redis = require('ioredis');

// Initialize Redis client
const redis = process.env.REDIS_URL
    ? new Redis(process.env.REDIS_URL)
    : null;

// Cache middleware
const cache = (duration = 300) => {
    return async (req, res, next) => {
        if (!redis) return next();

        const key = `cache:${req.originalUrl}`;

        try {
            const cached = await redis.get(key);
            if (cached) {
                console.log(`Cache HIT: ${key}`);
                return res.json(JSON.parse(cached));
            }

            console.log(`Cache MISS: ${key}`);
            res.originalJson = res.json;
            res.json = (data) => {
                redis.setex(key, duration, JSON.stringify(data));
                res.originalJson(data);
            };
            next();
        } catch (error) {
            console.error('Redis error:', error);
            next();
        }
    };
};

// Clear cache for specific pattern
const clearCache = async (pattern) => {
    if (!redis) return;

    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
            console.log(`Cleared ${keys.length} cache keys matching: ${pattern}`);
        }
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
};

module.exports = { cache, clearCache, redis };
