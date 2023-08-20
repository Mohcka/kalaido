//
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
    console.log("[CONVERSATION_REQUEST]");
    const { currentUser } = await serverAuth();
    const body = await req.json();
    const { messages } = body;
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

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const isLimitSurpassed = await checkApiLimit(LimitType.Text);

    if (!isLimitSurpassed && !isPro) {
      return new NextResponse("You have exceeded your, monthly Limit", {
        status: 403,
      });
    }
    
    await incrementApiLimit(LimitType.Text);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });


    return NextResponse.json(response.data.choices[0].message);
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
