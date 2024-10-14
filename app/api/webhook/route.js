import { Subscription } from "@/app/models/Subscription";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import express from 'express';

const app = express();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    let data;
    let eventType;

    // Проверяем подпись вебхука, если есть секретный ключ
    if (webhookSecret) {
        let event;
        const signature = req.headers['stripe-signature'];
        try {
            // Проверка события Stripe с помощью подписи и секретного ключа
            event = stripe.webhooks.constructEvent(
                req.body, // для express.raw используем req.body
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
        // Если секретного ключа нет, берем данные напрямую из тела запроса (например, для тестов)
        data = req.body.data;
        eventType = req.body.type;
    }

    // Обрабатываем событие 'checkout.session.completed'
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
            return res.status(500).send('Internal Server Error');
        }
    }

    // Обрабатываем событие 'customer.subscription.updated'
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
            return res.status(500).send('Internal Server Error');
        }
    }

    // Возвращаем успешный ответ
    return res.status(200).send();
});

// Запуск сервера на порту 4242
app.listen(4242, () => console.log('Server is running on port 4242'));
