// 

import { prisma } from "@/lib/db";
import serverAuth from "./serverAuth";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const { currentUser } = await serverAuth();

  if (!currentUser) {
    return false;
  }

  const userSubscription = await prisma.userSubscription.findUnique({
    where: {
      userId: currentUser.id,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!userSubscription) {
    return false;
  }

  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
      Date.now();

  return !!isValid;
};
