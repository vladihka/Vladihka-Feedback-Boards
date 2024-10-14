import { Subscription } from "@/app/models/Subscription";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    let data;
    let eventType;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Проверяем наличие webhook секретного ключа.
    if (webhookSecret) {
        let event;
        let signature = req.headers.get("stripe-signature");
        try {
            // Верификация Stripe события с использованием подписи и секретного ключа.
            event = stripe.webhooks.constructEvent(
                await req.text(),
                signature,
                webhookSecret
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed: ${err.message}`);
            return new Response(null, { status: 400 });
        }
        data = event.data;
        eventType = event.type;
    } else {
        // Если секретного ключа нет, берем данные напрямую из запроса (например, для тестов).
        data = req.body.data;
        eventType = req.body.type;
    }

    // Обработка события 'checkout.session.completed'
    if (eventType === 'checkout.session.completed') {
        const { userEmail } = data.object.metadata;
        const { customer } = data.object;

        console.log({ eventType, data });

        // Ищем подписку по email пользователя
        const sub = await Subscription.findOne({ userEmail });
        if (sub) {
            // Если подписка уже существует, обновляем customer
            sub.customer = customer;
            await sub.save();
        } else {
            // Если подписка не найдена, создаем новую запись
            await Subscription.create({ customer: customer, userEmail });
        }
    }

    // Обработка события 'customer.subscription.updated'
    if (eventType === 'customer.subscription.updated') {
        const { customer } = data.object;

        console.log({ eventType, data });

        // Ищем подписку по идентификатору клиента
        const sub = await Subscription.findOne({ customer });
        if (sub) {
            // Обновляем данные подписки
            sub.stripeSubscriptionData = data;
            await sub.save();
        } else {
            console.log('Подписка не найдена для клиента:', customer);
        }
    }

    // Возвращаем успешный ответ для Stripe
    return new Response(null, { status: 200 });
}
