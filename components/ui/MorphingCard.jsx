"use client"

import { useState } from "react"
import { playCardFlip } from "@/lib/audio"

export default function MorphingCard({ frontContent, backContent, trigger = "hover", className = "" }) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleInteraction = () => {
    if (trigger === "click") {
      setIsFlipped(!isFlipped)
      playCardFlip()
    }
  }

  const handleMouseEnter = () => {
    if (trigger === "hover") {
      setIsFlipped(true)
      playCardFlip()
    }
  }

  const handleMouseLeave = () => {
    if (trigger === "hover") {
      setIsFlipped(false)
    }
  }

  return (
    <div
      className={`group ${className}`}
      onClick={handleInteraction}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front side */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6 shadow-lg">
            {frontContent}
          </div>
        </div>

        {/* Back side */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6 shadow-lg">
            {backContent}
          </div>
        </div>
      </div>
    </div>
  )
}
