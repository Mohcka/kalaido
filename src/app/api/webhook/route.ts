import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  console.log("[WEBHOOK_SESSION]", "Creating subscription");
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    await prisma.userSubscription.create({
      data: {
        userId: session?.metadata?.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    console.log("[WEBHOOK_INVOICE]", "Updating subscription");

    try {
      prisma.$transaction(async (tx) => {
        const { userId } = await tx.userSubscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        });

        // does the user have an api limit?
        const userApiLimit = await tx.userApiLimit.findUnique({
          where: {
            userId: userId,
          },
        });

        // if not, create one else update it
        if (!userApiLimit) {
          await tx.userApiLimit.create({
            data: {
              userId: userId,
              textCount: 0,
              mediaCount: 0,
            },
          });
        } else {
          tx.userApiLimit.update({
            where: {
              userId: userId,
            },
            data: {
              textCount: 0,
              mediaCount: 0,
            },
          });
        }
      });
    } catch (error) {
      console.log("[WEBHOOK_ERROR]", error);

      return new NextResponse("Error updating subscription", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
