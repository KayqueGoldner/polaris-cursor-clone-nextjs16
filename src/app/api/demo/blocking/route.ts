import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";
import { NextResponse } from "next/server";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST() {
  // const response = await generateText({
  //   model: google("gemini-2.5-flash"),
  //   prompt: "Write a vegetarian lasagna recipe for 4 people.",
  // });

  const response = await generateText({
    model: anthropic("claude-3-haiku-20240307"),
    prompt: "Write a vegetarian lasagna recipe for 4 people.",
  });

  return NextResponse.json({ response });
}
