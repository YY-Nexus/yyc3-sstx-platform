"use client"

import { useEffect } from "react"
import { initAudio } from "@/lib/audio"
import AudioControls from "@/components/ui/AudioControls"

export default function ClientLayout({ children }) {
  useEffect(() => {
    // 初始化音频系统
    const setupAudio = async () => {
      try {
        await initAudio()
      } catch (error) {
        console.error("音频系统初始化失败:", error)
      }
    }

    // 用户首次交互后初始化音频
    const handleFirstInteraction = () => {
      setupAudio()
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("keydown", handleFirstInteraction)
    }

    document.addEventListener("click", handleFirstInteraction)
    document.addEventListener("keydown", handleFirstInteraction)

    return () => {
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("keydown", handleFirstInteraction)
    }
  }, [])

  return (
    <>
      {children}

      {/* 音频控制器 */}
      <div className="fixed top-4 right-4 z-50">
        <AudioControls />
      </div>
    </>
  )
}
