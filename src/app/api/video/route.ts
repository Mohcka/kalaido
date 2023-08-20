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
      "anotherjesse/zeroscope-v2-xl:71996d331e8ede8ef7bd76eba9fae076d31792e4ddf4ad057779b443d6aea62f",
      {
        input: {
          prompt,
        },
      }
    );


    return NextResponse.json(response);
  } catch (error) {
    console.log("[VIDEO_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
