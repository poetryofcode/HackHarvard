import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Call ElevenLabs Text-to-Speech API
    const voiceId = "21m00Tcm4TlvDq8ikWAM" // Rachel voice - warm and engaging
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] ElevenLabs API error:", error)
      return NextResponse.json({ error: "Failed to generate audio" }, { status: response.status })
    }

    // Get audio as array buffer
    const audioBuffer = await response.arrayBuffer()

    // Convert to base64 for easy transmission
    const base64Audio = Buffer.from(audioBuffer).toString("base64")
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`

    return NextResponse.json({ audioUrl })
  } catch (error) {
    console.error("[v0] Error generating audio:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
