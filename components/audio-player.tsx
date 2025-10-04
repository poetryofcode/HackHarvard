"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2, Play, Pause, RotateCcw } from "lucide-react"

interface AudioPlayerProps {
  analysis: string
  audioUrl: string
}

export function AudioPlayer({ analysis, audioUrl }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleRestart = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = 0
    audio.play()
    setIsPlaying(true)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const time = Number.parseFloat(e.target.value)
    audio.currentTime = time
    setCurrentTime(time)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
          <Volume2 className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-xl font-semibold">Audio Explanation</h3>
      </div>

      <div className="space-y-4">
        {/* Custom Audio Player */}
        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Button size="icon" variant="outline" onClick={togglePlayPause} className="h-12 w-12 bg-transparent">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>

            <div className="flex-1 space-y-2">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <Button size="icon" variant="ghost" onClick={handleRestart}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Hidden native audio element */}
        <audio ref={audioRef} src={audioUrl} preload="metadata" className="hidden" />

        {/* Transcript */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Transcript</h4>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">{analysis}</p>
        </div>
      </div>
    </Card>
  )
}
