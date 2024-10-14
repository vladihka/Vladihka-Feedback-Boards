import { Subscription } from "@/app/models/Subscription";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    // Обработка только POST запросов
    if (req.method === 'POST') {
        let event;

        const signature = req.headers['stripe-signature'];

        try {
            // Проверяем подпись вебхука
            event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            console.error(`⚠️  Webhook signature verification failed: ${err.message}`);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        const data = event.data;
        const eventType = event.type;

        // Обрабатываем события
        if (eventType === 'checkout.session.completed') {
            const { userEmail } = data.object.metadata;
            const { customer } = data.object;

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
        } else if (eventType === 'customer.subscription.updated') {
            const { customer } = data.object;

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
