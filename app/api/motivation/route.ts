import { NextResponse } from "next/server";
import { getMotivationalContent } from "@/lib/mistral";

export async function POST(req: Request) {
  try {
    const { mood, goal, focusArea } = await req.json();

    // Generate AI-powered motivation content
    const content = await getMotivationalContent(mood, goal, focusArea);

    if (!content) {
      throw new Error("AI response is undefined");
    }

    return NextResponse.json({ content });

  } catch (error) {
    console.error("❌ Error in API Route:", error);
    return NextResponse.json(
      { content: "⚠️ Oops! Something went wrong on our end. Please try again later." },
      { status: 500 }
    );
  }
}
