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
      className={`group perspective-1000 ${className}`}
      onClick={handleInteraction}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`
          relative w-full h-full transition-transform duration-700 transform-style-preserve-3d
          ${isFlipped ? "rotate-y-180" : ""}
        `}
      >
        {/* 正面 */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6 shadow-lg">
            {frontContent}
          </div>
        </div>

        {/* 背面 */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6 shadow-lg">
            {backContent}
          </div>
        </div>
      </div>
    </div>
  )
}
