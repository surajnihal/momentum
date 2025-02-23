import { NextResponse } from "next/server";
import { generateSpeech } from "@/lib/generatespeech";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    // Generate AI-powered speech content
    const content = await generateSpeech(text);

    if (!content) {
      throw new Error("AI response is undefined");
    }

    const contentType = 'audio/mpeg';
    // converting blob to raw buffer for transferring
    // (other formats including blob was not working)
    const arrayBuffer = await content.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);


      return new Response(buffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
        },
      });

  } catch (error) {
    console.error("❌ Error in API Route:", error);
    return NextResponse.json(
      { content: "⚠️ Oops! Something went wrong on our end. Please try again later." },
      { status: 500 }
    );
  }
}
