"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  onImageUpload: (imageUrl: string | null) => void
  uploadedImage: string | null
  onAnalysisComplete: (analysis: string, audioUrl: string) => void
}

export function ImageUpload({ onImageUpload, uploadedImage, onAnalysisComplete }: ImageUploadProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState<"analyzing" | "generating-audio" | null>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onImageUpload(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleCameraCapture = () => {
    cameraInputRef.current?.click()
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    onImageUpload(null)
    if (cameraInputRef.current) {
      cameraInputRef.current.value = ""
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAnalyze = async () => {
    if (!uploadedImage) return

    setIsAnalyzing(true)
    setAnalysisStep("analyzing")

    try {
      // Step 1: Analyze artwork with OpenAI Vision
      const analysisResponse = await fetch("/api/analyze-artwork", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: uploadedImage }),
      })

      if (!analysisResponse.ok) {
        throw new Error("Failed to analyze artwork")
      }

      const analysisData = await analysisResponse.json()
      const analysis = analysisData.analysis

      // Step 2: Generate audio with ElevenLabs
      setAnalysisStep("generating-audio")

      const audioResponse = await fetch("/api/generate-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: analysis }),
      })

      if (!audioResponse.ok) {
        throw new Error("Failed to generate audio")
      }

      const audioData = await audioResponse.json()

      // Pass both analysis and audio URL to parent
      onAnalysisComplete(analysis, audioData.audioUrl)
    } catch (error) {
      console.error("[v0] Error processing artwork:", error)
      alert("Failed to process artwork. Please try again.")
    } finally {
      setIsAnalyzing(false)
      setAnalysisStep(null)
    }
  }

  const getLoadingText = () => {
    if (analysisStep === "analyzing") return "Analyzing Artwork..."
    if (analysisStep === "generating-audio") return "Generating Audio..."
    return "Processing..."
  }

  return (
    <div className="space-y-6">
      {!uploadedImage ? (
        <Card
          className={`relative border-2 border-dashed transition-colors ${
            isDragging ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                <Camera className="w-10 h-10 text-accent" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Capture or Upload Artwork</h3>
              <p className="text-muted-foreground text-pretty">
                Take a photo or upload an image of any artwork to receive an AI-generated audio explanation
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" onClick={handleCameraCapture} className="gap-2">
                <Camera className="w-5 h-5" />
                Take Photo
              </Button>
              <Button size="lg" variant="outline" onClick={handleFileUpload} className="gap-2 bg-transparent">
                <Upload className="w-5 h-5" />
                Upload Image
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">or drag and drop an image here</p>
          </div>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileInput}
            className="hidden"
          />
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="relative">
            <div className="relative aspect-video w-full bg-muted">
              <Image src={uploadedImage || "/placeholder.svg"} alt="Uploaded artwork" fill className="object-contain" />
            </div>
            <Button size="icon" variant="destructive" className="absolute top-4 right-4" onClick={handleRemoveImage}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Camera className="w-4 h-4" />
              <span>Artwork captured successfully</span>
            </div>
            <Button size="lg" className="w-full" onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {getLoadingText()}
                </>
              ) : (
                "Generate Audio Explanation"
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
