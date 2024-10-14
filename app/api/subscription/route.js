import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Subscription } from "@/app/models/Subscription";
import { getServerSession } from "next-auth";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function GET() {
    const userSession = await getServerSession(authOptions);
    if (!userSession) {
        return new Response('Unauthorized', { status: 401 });
    }
    
    const subscription = await Subscription.findOne({ userEmail: userSession.user.email });
    return Response.json(subscription);
}

export async function POST(req) {
    const priceId = 'price_1Q5ntKHIWsMOn2FmlXT9Wxlr'; // Убедитесь, что это правильный идентификатор цены
    const userSession = await getServerSession(authOptions);
    
    if (!userSession) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const stripeSession = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${process.env.NEXTAUTH_URL}/subscription?success=1`,
            cancel_url: `${process.env.NEXTAUTH_URL}/subscription?cancel=1`,
            metadata: { userEmail: userSession.user.email },
            subscription_data: {
                metadata: { userEmail: userSession.user.email },
            },
        });

        return Response.json({ url: stripeSession.url });
    } catch (error) {
        console.error('Ошибка при создании сессии Stripe:', error);
        return new Response('Error creating session', { status: 500 });
    }
}
