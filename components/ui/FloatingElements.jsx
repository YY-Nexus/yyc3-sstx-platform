"use client"

import { useState, useEffect } from "react"

export default function FloatingElements({ variant = "bubbles", count = 6, className = "" }) {
  const [elements, setElements] = useState([])

  useEffect(() => {
    const newElements = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
    }))
    setElements(newElements)
  }, [count])

  const renderVariant = () => {
    switch (variant) {
      case "bubbles":
        return elements.map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 backdrop-blur-sm animate-float"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
            }}
          />
        ))

      case "geometric":
        return elements.map((element) => (
          <div
            key={element.id}
            className="absolute bg-gradient-to-br from-cyan-400/30 to-blue-500/30 backdrop-blur-sm animate-spin-slow"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            }}
          />
        ))

      case "particles":
        return elements.map((element) => (
          <div
            key={element.id}
            className="absolute w-2 h-2 bg-white/40 rounded-full animate-pulse"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration / 2}s`,
            }}
          />
        ))

      default:
        return elements.map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 backdrop-blur-sm animate-float"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
            }}
          />
        ))
    }
  }

  return <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>{renderVariant()}</div>
}
