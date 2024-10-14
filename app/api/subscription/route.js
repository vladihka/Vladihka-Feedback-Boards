import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {Subscription} from "@/app/models/Subscription";
import {getServerSession} from "next-auth";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function GET() {
    const userSession = await getServerSession(authOptions);
    if (!userSession) {
        return new Response('Unauthorized', {status:401});
    }
    return Response.json(
        await Subscription.findOne({userEmail:userSession.user.email})
    );
}

export async function POST(req) {
    const userSession = await getServerSession(authOptions);
    if (!userSession) {
        return new Response('Unauthorized', { status: 401 });
    }
    
    const priceId = 'price_1Q5ntKHIWsMOn2FmlXT9Wxlr'; // убедитесь, что это правильный ID
    const stripeSession = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{
            price: priceId, // убедитесь, что ID действителен
            quantity: 1,
        }],
        success_url: process.env.NEXTAUTH_URL + '/subscription?success=1',
        cancel_url: process.env.NEXTAUTH_URL + '/subscription?cancel=1',
        metadata: { userEmail: userSession?.user?.email },
    });

    return Response.json(stripeSession.url);
}