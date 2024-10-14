// server.js

// Устанавливаем Stripe библиотеку с вашим секретным ключом.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const mongoose = require('mongoose');
const Subscription = require('./models/Subscription'); // Ваша модель для подписок
const app = express();

// Это ваш Stripe Webhook Secret для тестирования локально.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Подключаемся к MongoDB (убедитесь, что у вас настроена MongoDB).
mongoose.connect('mongodb://localhost:27017/yourDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    // Проверяем подлинность вебхука с использованием секретного ключа вебхука.
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed: ${err.message}`);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Обрабатываем тип события.
  const data = event.data.object;
  switch (event.type) {
    case 'checkout.session.completed':
      {
        const { userEmail } = data.metadata;
        const { customer } = data;

        // Логика для обработки завершенной сессии оформления заказа.
        console.log({ eventType: event.type, data });
        try {
          const sub = await Subscription.findOne({ userEmail });
          if (sub) {
            sub.customer = customer;
            await sub.save();
          } else {
            await Subscription.create({ customer: customer, userEmail: userEmail });
          }
        } catch (err) {
          console.error('Ошибка при сохранении подписки:', err);
        }
      }
      break;

    case 'customer.subscription.updated':
      {
        const { customer } = data;

        // Логика для обновления информации о подписке клиента.
        console.log({ eventType: event.type, data });
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
        }
      }
      break;

    // Обработка других типов событий.
    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }

  // Отправляем ответ 200, чтобы подтвердить получение события.
  response.status(200).send();
});

app.listen(4242, () => console.log('Server is running on port 4242'));
