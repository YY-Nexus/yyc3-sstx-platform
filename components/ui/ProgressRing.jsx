"use client"

import { useEffect, useState } from "react"
import { playProgressUpdate } from "@/lib/audio"

export default function ProgressRing({
  progress = 0,
  size = 120,
  strokeWidth = 8,
  color = "blue",
  animated = true,
  showPercentage = true,
  className = "",
  playSound = false,
}) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const [lastProgress, setLastProgress] = useState(0)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress)

        // 播放进度更新音效
        if (playSound && progress !== lastProgress && progress > 0) {
          playProgressUpdate()
        }
        setLastProgress(progress)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setAnimatedProgress(progress)
    }
  }, [progress, animated, playSound, lastProgress])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference

  const colors = {
    blue: "stroke-blue-500",
    purple: "stroke-purple-500",
    green: "stroke-green-500",
    red: "stroke-red-500",
    yellow: "stroke-yellow-500",
    pink: "stroke-pink-500",
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />

        {/* 进度圆环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${colors[color]} transition-all duration-1000 ease-out`}
        />
      </svg>

      {/* 中心文字 */}
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-700">{Math.round(animatedProgress)}%</span>
        </div>
      )}
    </div>
  )
}
