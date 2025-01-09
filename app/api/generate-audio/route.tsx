import { NextResponse } from 'next/server';
import { writeFileSync } from "node:fs";
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
    
    const timestamp = Date.now();
    const filename = `audio-${timestamp}.mp3`;
    const filepath = `public/audio/${filename}`;
    
    writeFileSync(filepath, buffer);
    
    return NextResponse.json({ 
      success: true,
      audioUrl: `/audio/${filename}`
    });
    
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}