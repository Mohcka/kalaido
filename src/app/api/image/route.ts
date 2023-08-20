import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { LimitType } from "@/project-types";
import serverAuth from "@/lib/serverAuth";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  try {
    const { currentUser } = await serverAuth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;
    const isPro = await checkSubscription();

    if (!isPro) {
      return new NextResponse("You need to be a Pro user to use this feature", {
        status: 403,
      });
    }
    

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", {
        status: 500,
      });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }

    const isLimitSurpassed= await checkApiLimit(LimitType.Media);

    if (!isLimitSurpassed && !isPro) {
      return new NextResponse(
        "You have exceeded your, monthly Limit",
        { status: 403 }
      );
    }

    await incrementApiLimit(LimitType.Media);
    const response = await openai.createImage({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });


    return NextResponse.json(response.data.data);
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
