import { prisma } from "@/lib/db";
import { MAX_FREE_COUNTS, MAX_TEXT_GENERATION } from "@/constants";
import serverAuth from "./serverAuth";
import { UserApiLimit } from "@prisma/client";

import { LimitType } from "@/project-types";

export const incrementApiLimit = async (type: LimitType) => {
  const { currentUser } = await serverAuth();

  if (!currentUser) {
    return;
  }

  const userApiLimit = await prisma.userApiLimit.findUnique({
    where: { userId: currentUser.id },
  });

  if (userApiLimit) {
    const limitToIncrement =
      type === LimitType.Text
        ? { textCount: userApiLimit.textCount + 1 }
        : { mediaCount: userApiLimit.mediaCount + 1 };
    await prisma.userApiLimit.update({
      where: { userId: currentUser.id },
      data: limitToIncrement,
    });
  } else {
    type === LimitType.Text
      ? await prisma.userApiLimit.create({
          data: { userId: currentUser.id, textCount: 1 },
        })
      : await prisma.userApiLimit.create({
          data: { userId: currentUser.id, mediaCount: 1 },
        });
  }
};

export const checkApiLimit = async (type: LimitType) => {
  const { currentUser } = await serverAuth();
  if (!currentUser) {
    return false;
  }

  const userApiLimit = await prisma.userApiLimit.findUnique({
    where: { userId: currentUser.id },
  });

  return (
    !userApiLimit ||
    (userApiLimit.textCount < MAX_TEXT_GENERATION && type === LimitType.Text) ||
    (userApiLimit.mediaCount < MAX_FREE_COUNTS && type === LimitType.Media)
  );
};

export const getApiLimitCount = async () => {
  const { currentUser } = await serverAuth();

  if (!currentUser) {
    return {
      textCount: 0,
      mediaCount: 0,
    };
  }

  const userApiLimit = await prisma.userApiLimit.findUnique({
    where: {
      userId: currentUser.id,
    },
  });

  if (!userApiLimit) {
    return {
      textCount: 0,
      mediaCount: 0,
    };
  }

  return {
    textCount: userApiLimit.textCount,
    mediaCount: userApiLimit.mediaCount,
  };
};
