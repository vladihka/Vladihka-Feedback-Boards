import {Subscription} from "@/app/models/Subscription";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'plan.created':
      const planCreated = event.data.object;
      // Then define and call a function to handle the event plan.created
      break;
    case 'plan.deleted':
      const planDeleted = event.data.object;
      // Then define and call a function to handle the event plan.deleted
      break;
    case 'plan.updated':
      const planUpdated = event.data.object;
      // Then define and call a function to handle the event plan.updated
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
    return new Response(null, {status:200});
}