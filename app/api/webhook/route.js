import { Subscription } from "@/app/models/Subscription";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const signature = req.headers.get("stripe-signature");
    let event;

    try {
        const body = await req.text();
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error(`⚠️  Webhook signature verification failed: ${err.message}`);
        return new Response('Webhook Error', { status: 400 });
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const checkoutSession = event.data.object;
            const { userEmail } = checkoutSession.metadata;
            const { customer } = checkoutSession;

            try {
                const sub = await Subscription.findOne({ userEmail });
                if (sub) {
                    sub.customer = customer;
                    await sub.save();
                } else {
                    await Subscription.create({ customer, userEmail });
                }
            } catch (error) {
                console.error('Error handling checkout.session.completed:', error);
                return new Response('Internal Server Error', { status: 500 });
            }
            break;

        case 'customer.subscription.updated':
            const subscription = event.data.object;
            const { customer: custId } = subscription;

            try {
                const sub = await Subscription.findOne({ customer: custId });
                if (sub) {
                    sub.stripeSubscriptionData = subscription;
                    await sub.save();
                } else {
                    console.error('Subscription not found for customer:', custId);
                }
            } catch (error) {
                console.error('Error handling customer.subscription.updated:', error);
                return new Response('Internal Server Error', { status: 500 });
            }
            break;

        default:
            console.warn(`Unhandled event type ${event.type}`);
    }

    return new Response(null, { status: 200 });
}
