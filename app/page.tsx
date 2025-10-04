"use client"

import { useState } from "react"
import { ImageUpload } from "@/components/image-upload"
import { AudioPlayer } from "@/components/audio-player"
import Image from "next/image"

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const handleAnalysisComplete = (analysisText: string, audio: string) => {
    setAnalysis(analysisText)
    setAudioUrl(audio)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-12 flex flex-col items-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Image
                src="/logo.png"
                alt="Whispering Walls Logo"
                width={64}
                height={64}
                className="w-12 h-12 md:w-16 md:h-16"
              />
              <h1 className="text-4xl md:text-5xl font-bold text-balance">Whispering Walls</h1>
            </div>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl">
              Capture artwork and hear its story come alive through AI-powered audio explanations
            </p>
          </header>

          {/* Main Content */}
          <div className="space-y-8">
            <ImageUpload
              onImageUpload={setUploadedImage}
              uploadedImage={uploadedImage}
              onAnalysisComplete={handleAnalysisComplete}
            />

            {analysis && audioUrl && <AudioPlayer analysis={analysis} audioUrl={audioUrl} />}
          </div>
        </div>
      </div>
    </main>
  )
}
