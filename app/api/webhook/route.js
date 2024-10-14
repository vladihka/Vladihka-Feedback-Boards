import { Subscription } from "@/app/models/Subscription";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    let data;
    let eventType;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (req.method === 'POST') {
        if (webhookSecret) {
            let event;
            const signature = req.headers['stripe-signature'];
            try {
                event = stripe.webhooks.constructEvent(
                    req.body,
                    signature,
                    webhookSecret
                );
            } catch (err) {
                console.log(`⚠️  Webhook signature verification failed: ${err.message}`);
                return res.status(400).send(`Webhook Error: ${err.message}`);
            }
            data = event.data;
            eventType = event.type;
        } else {
            data = req.body.data;
            eventType = req.body.type;
        }

        if (eventType === 'checkout.session.completed') {
            const { userEmail } = data.object.metadata;
            const { customer } = data.object;
            console.log({ eventType, data });

            try {
                const sub = await Subscription.findOne({ userEmail });
                if (sub) {
                    sub.customer = customer;
                    await sub.save();
                } else {
                    await Subscription.create({ customer, userEmail });
                }
            } catch (err) {
                console.error('Ошибка при обработке подписки:', err);
                return res.status(500).send('Internal Server Error');
            }
        }

        if (eventType === 'customer.subscription.updated') {
            const { customer } = data.object;
            console.log({ eventType, data });

            try {
                const sub = await Subscription.findOne({ customer });
                if (sub) {
                    sub.stripeSubscriptionData = data;
                    await sub.save();
                } else {
                    console.error('Подписка не найдена для клиента:', customer);
                }
            } catch (err) {
                console.error('Ошибка при обновлении подписки:', err);
                return res.status(500).send('Internal Server Error');
            }
        }

        return res.status(200).send();
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
