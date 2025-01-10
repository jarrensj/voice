import { NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    const mp3Response = await openai.audio.speech.create({
      model: "tts-1",  // or "tts-1-hd" for higher quality
      voice: "alloy",  // options: alloy, echo, fable, onyx, nova, shimmer
      input: prompt,
    });

    const buffer = Buffer.from(await mp3Response.arrayBuffer());
    
    return new Response(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });
    
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}