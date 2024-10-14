import { Subscription } from "@/app/models/Subscription";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    let data;
    let eventType;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret) {
        let event;
        let signature = req.headers.get("stripe-signature");
        try {
            event = stripe.webhooks.constructEvent(
                await req.text(), // Для получения "сырых" данных из запроса
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
        // Если секретного ключа нет, используем данные напрямую из тела запроса
        data = req.body.data;
        eventType = req.body.type;
    }

    if (eventType === 'checkout.session.completed') {
        const { userEmail } = data.object.metadata;
        const { customer } = data.object;

        console.log({ eventType, data });

        try {
            // Ищем подписку по email пользователя
            const sub = await Subscription.findOne({ userEmail });
            if (sub) {
                // Если подписка существует, обновляем customer
                sub.customer = customer;
                await sub.save();
            } else {
                // Если подписка не найдена, создаем новую запись
                await Subscription.create({ customer, userEmail });
            }
        } catch (err) {
            console.error('Ошибка при обработке подписки:', err);
            return new Response(null, { status: 500 });
        }
    }

    if (eventType === 'customer.subscription.updated') {
        const { customer } = data.object;

        console.log({ eventType, data });

        try {
            // Ищем подписку по идентификатору клиента
            const sub = await Subscription.findOne({ customer });
            if (sub) {
                // Обновляем данные подписки
                sub.stripeSubscriptionData = data;
                await sub.save();
            } else {
                console.error('Подписка не найдена для клиента:', customer);
            }
        } catch (err) {
            console.error('Ошибка при обновлении подписки:', err);
            return new Response(null, { status: 500 });
        }
    }

    // Возвращаем успешный ответ
    return new Response(null, { status: 200 });
}