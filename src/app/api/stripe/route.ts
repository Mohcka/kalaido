import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import serverAuth from "@/lib/serverAuth";

const settingsUrl = absoluteUrl("/settings");

export async function GET() {
  try {
    const { currentUser } = await serverAuth();

    if (!currentUser.id || !currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userSubscription = await prisma.userSubscription.findUnique({
      where: {
        userId: currentUser.id,
      },
    });

    // Check if the user has a subscription
    // and if they have a Stripe customer ID
    if (userSubscription && userSubscription.stripeCustomerId) {
      // If the user has a subscription and a Stripe customer ID,
      // create a Stripe Billing Portal session
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      // Pass the URL of the Stripe Billing Portal session
      // to the client-side
      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: currentUser.email!,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Kalaido",
              description: "AI Content Generations",
            },
            unit_amount: 500,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: currentUser.id,
      },
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    console.log("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
