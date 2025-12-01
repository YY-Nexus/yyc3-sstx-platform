"use client"

import { useEffect, useState } from "react"

export default function ParallaxSection({ children, speed = 0.5, className = "", backgroundImage = null }) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const parallaxStyle = {
    transform: `translateY(${scrollY * speed}px)`,
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            ...parallaxStyle,
          }}
        />
      )}
      <div className="relative z-10" style={parallaxStyle}>
        {children}
      </div>
    </div>
  )
}
