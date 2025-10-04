import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Call OpenAI Vision API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "You are an expert art historian and museum guide. Analyze this artwork and provide a rich, emotional, and engaging explanation that covers: the artistic style, historical context, the artist's technique, the emotions it evokes, and interesting details a viewer might miss. Write in a warm, conversational tone as if you're speaking directly to someone standing in front of the artwork. Keep it to 2-3 paragraphs.",
              },
              {
                type: "image_url",
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] OpenAI API error:", error)
      return NextResponse.json({ error: "Failed to analyze artwork" }, { status: response.status })
    }

    const data = await response.json()
    const analysis = data.choices[0]?.message?.content

    if (!analysis) {
      return NextResponse.json({ error: "No analysis generated" }, { status: 500 })
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("[v0] Error analyzing artwork:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
