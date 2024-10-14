import { Subscription } from "@/app/models/Subscription"; // Импорт модели подписки
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Инициализация Stripe

const express = require('express');
const app = express();

// Секретный ключ для вебхука Stripe
const endpointSecret = "we_1Q9nlfHIWsMOn2FmObaXtKRK";

app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
    const sig = request.headers['stripe-signature']; // Получение подписи из заголовков

    let event;

    try {
        // Проверка подписи и создание события
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Обработка события
    switch (event.type) {
        case 'checkout.session.completed':
            const checkoutSessionCompleted = event.data.object;
            const { userEmail } = checkoutSessionCompleted.metadata; // Извлечение email пользователя из метаданных
            const { customer } = checkoutSessionCompleted; // Извлечение идентификатора клиента
            
            console.log({ eventType: event.type, data: event.data });

            try {
                // Поиск подписки по email пользователя
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
                console.error('Ошибка при обработке checkout.session.completed:', err);
                response.status(500).send('Internal Server Error');
                return;
            }
            break;

        case 'customer.subscription.updated':
            const customerSubscriptionUpdated = event.data.object;
            const { customer: updatedCustomer } = customerSubscriptionUpdated; // Извлечение идентификатора клиента из события
            
            console.log({ eventType: event.type, data: event.data });

            try {
                // Поиск подписки по идентификатору клиента
                const sub = await Subscription.findOne({ customer: updatedCustomer });
                if (sub) {
                    // Обновление данных подписки
                    sub.stripeSubscriptionData = customerSubscriptionUpdated;
                    await sub.save();
                } else {
                    console.error('Подписка не найдена для клиента:', updatedCustomer);
                }
            } catch (err) {
                console.error('Ошибка при обновлении подписки:', err);
                response.status(500).send('Internal Server Error');
                return;
            }
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Возвращаем 200 ответ, чтобы подтвердить получение события
    response.status(200).send();
});

// Запуск сервера на порту 4242
app.listen(4242, () => console.log('Running on port 4242'));

