const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

// Create payment intent
router.post('/create-intent', auth, async (req, res) => {
    try {
        const { amount, orderId } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            metadata: {
                orderId,
                userId: req.user.userId,
            },
        });

        // Update order with payment intent ID
        if (orderId) {
            await Order.findByIdAndUpdate(orderId, {
                paymentIntentId: paymentIntent.id,
            });
        }

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Confirm payment
router.post('/confirm', auth, async (req, res) => {
    try {
        const { paymentIntentId, orderId } = req.body;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // Update order payment status
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'paid',
                status: 'processing',
            });

            res.json({ success: true, paymentIntent });
        } else {
            res.status(400).json({
                success: false,
                error: 'Payment not completed',
                status: paymentIntent.status
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            const orderId = paymentIntent.metadata.orderId;

            if (orderId) {
                await Order.findByIdAndUpdate(orderId, {
                    paymentStatus: 'paid',
                    status: 'processing',
                });
            }
            break;

        case 'payment_intent.payment_failed':
            const failedIntent = event.data.object;
            const failedOrderId = failedIntent.metadata.orderId;

            if (failedOrderId) {
                await Order.findByIdAndUpdate(failedOrderId, {
                    paymentStatus: 'failed',
                });
            }
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

// Refund payment
router.post('/refund', auth, async (req, res) => {
    try {
        const { paymentIntentId, amount, orderId } = req.body;

        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount ? Math.round(amount * 100) : undefined,
        });

        // Update order
        if (orderId) {
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'refunded',
                status: 'refunded',
            });
        }

        res.json({ success: true, refund });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
