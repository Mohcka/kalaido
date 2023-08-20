import Replicate from "replicate";

import { NextResponse } from "next/server";

import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { LimitType } from "@/project-types";
import { checkSubscription } from "@/lib/subscription";
import serverAuth from "@/lib/serverAuth";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { currentUser } = await serverAuth();
    const body = await req.json();
    const { prompt } = body;
    const isPro = await checkSubscription();

    if (!isPro) {
      return new NextResponse("You need to be a Pro user to use this feature", {
        status: 403,
      });
    }

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const isLimitSurpassed= await checkApiLimit(LimitType.Media);

    if (!isLimitSurpassed && !isPro) {
      return new NextResponse(
        "You have exceeded your, monthly Limit",
        { status: 403 }
      );
    }
    
    await incrementApiLimit(LimitType.Media);
    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt,
        },
      }
    );


    return NextResponse.json(response);
  } catch (error) {
    console.log("[MUSIC_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
