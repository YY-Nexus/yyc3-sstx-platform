"use client"

import { useState, useEffect } from "react"

export default function AnimatedBackground({ variant = "geometric", intensity = "medium" }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const intensityConfig = {
    low: { opacity: 0.3, scale: 0.8 },
    medium: { opacity: 0.5, scale: 1 },
    high: { opacity: 0.7, scale: 1.2 },
  }

  const config = intensityConfig[intensity]

  const renderGeometricPattern = () => (
    <div className="absolute inset-0 overflow-hidden">
      {/* 动态几何图形 */}
      <div
        className="absolute w-96 h-96 rounded-full border-2 border-blue-200 animate-spin"
        style={{
          top: `${20 + mousePosition.y * 0.1}%`,
          left: `${10 + mousePosition.x * 0.1}%`,
          opacity: config.opacity,
          transform: `scale(${config.scale})`,
          animationDuration: "20s",
        }}
      />
      <div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 animate-pulse"
        style={{
          top: `${60 + mousePosition.y * 0.05}%`,
          right: `${15 + mousePosition.x * 0.08}%`,
          opacity: config.opacity * 0.6,
          transform: `scale(${config.scale * 0.8})`,
        }}
      />
      <div
        className="absolute w-80 h-80 rotate-45 border border-indigo-200 animate-bounce"
        style={{
          bottom: `${20 + mousePosition.y * 0.12}%`,
          left: `${30 + mousePosition.x * 0.15}%`,
          opacity: config.opacity * 0.4,
          animationDuration: "3s",
        }}
      />

      {/* 网格背景 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
        }}
      />
    </div>
  )

  const renderWavePattern = () => (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        <path
          d={`M0,400 Q300,${300 + mousePosition.y * 2} 600,400 T1200,400 V800 H0 Z`}
          fill="url(#wave1)"
          className="animate-pulse"
        />
        <path
          d={`M0,500 Q400,${400 + mousePosition.x * 1.5} 800,500 T1200,500 V800 H0 Z`}
          fill="url(#wave2)"
          className="animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </svg>
    </div>
  )

  const renderParticlePattern = () => (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-blue-400 rounded-full animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            opacity: config.opacity * (0.3 + Math.random() * 0.4),
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        />
      ))}

      {/* 连接线 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <line
            key={i}
            x1={`${Math.random() * 100}%`}
            y1={`${Math.random() * 100}%`}
            x2={`${Math.random() * 100}%`}
            y2={`${Math.random() * 100}%`}
            stroke="rgba(59, 130, 246, 0.1)"
            strokeWidth="1"
            className="animate-pulse"
            style={{ animationDelay: `${Math.random() * 3}s` }}
          />
        ))}
      </svg>
    </div>
  )

  const patterns = {
    geometric: renderGeometricPattern,
    wave: renderWavePattern,
    particle: renderParticlePattern,
  }

  return <div className="fixed inset-0 pointer-events-none z-0">{patterns[variant]()}</div>
}
