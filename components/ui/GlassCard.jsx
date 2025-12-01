"use client"

import { useState } from "react"

export default function GlassCard({ children, className = "", hover = true, glow = false, variant = "default" }) {
  const [isHovered, setIsHovered] = useState(false)

  const variants = {
    default: "bg-white/10 border-white/20",
    primary: "bg-blue-500/10 border-blue-300/30",
    secondary: "bg-purple-500/10 border-purple-300/30",
    success: "bg-green-500/10 border-green-300/30",
    warning: "bg-yellow-500/10 border-yellow-300/30",
    danger: "bg-red-500/10 border-red-300/30",
  }

  const glowVariants = {
    default: "shadow-white/20",
    primary: "shadow-blue-500/30",
    secondary: "shadow-purple-500/30",
    success: "shadow-green-500/30",
    warning: "shadow-yellow-500/30",
    danger: "shadow-red-500/30",
  }

  return (
    <div
      className={`
        backdrop-blur-md border rounded-xl p-6 transition-all duration-300
        ${variants[variant]}
        ${hover ? "hover:bg-white/20 hover:border-white/30 hover:scale-105" : ""}
        ${glow && isHovered ? `shadow-2xl ${glowVariants[variant]}` : "shadow-lg"}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  )
}
