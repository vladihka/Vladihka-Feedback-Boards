import { Subscription } from "@/app/models/Subscription";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    let data;
    let eventType;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Проверяем наличие секретного ключа
    if (webhookSecret) {
        let event;
        const signature = req.headers.get("stripe-signature");
        
        try {
            // Проверка подписи вебхука
            event = stripe.webhooks.constructEvent(
                await req.text(), // Получаем "сырые" данные из запроса
                signature,
                webhookSecret
            );
        } catch (err) {
            console.error(`⚠️  Webhook signature verification failed: ${err.message}`);
            return new Response("Webhook signature verification failed.", { status: 400 });
        }

        data = event.data;
        eventType = event.type;
    } else {
        // Если секретного ключа нет, используем данные напрямую из тела запроса (для тестирования)
        data = req.body.data;
        eventType = req.body.type;
    }

    // Обработка события 'checkout.session.completed'
    if (eventType === 'checkout.session.completed') {
        const { userEmail } = data.object.metadata;
        const { customer } = data.object;

        console.log({ eventType, data });

        try {
            // Поиск подписки по email пользователя
            const sub = await Subscription.findOne({ userEmail });
            if (sub) {
                // Обновляем customer, если подписка существует
                sub.customer = customer;
                await sub.save();
            } else {
                // Создаем новую запись, если подписка не найдена
                await Subscription.create({ customer, userEmail });
            }
        } catch (err) {
            console.error('Ошибка при обработке подписки:', err);
            return new Response("Internal Server Error", { status: 500 });
        }
    }

    // Обработка события 'customer.subscription.updated'
    if (eventType === 'customer.subscription.updated') {
        const { customer } = data.object;

        console.log({ eventType, data });

        try {
            // Поиск подписки по идентификатору клиента
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
            return new Response("Internal Server Error", { status: 500 });
        }
    }

    // Возвращаем успешный ответ
    return new Response(null, { status: 200 });
}
