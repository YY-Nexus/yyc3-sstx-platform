"use client"

import { useState, useEffect } from "react"
import {
  getAudioEnabled,
  getAudioVolume,
  setAudioEnabled,
  setAudioVolume,
  playButtonClick,
  playSuccess,
} from "@/lib/audio"
import GlassCard from "./GlassCard"
import NeonButton from "./NeonButton"
import GradientText from "./GradientText"

export default function AudioControls({ className = "" }) {
  const [isEnabled, setIsEnabled] = useState(true)
  const [volume, setVolume] = useState(0.5)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    setIsEnabled(getAudioEnabled())
    setVolume(getAudioVolume())
  }, [])

  const handleToggleEnabled = () => {
    const newEnabled = !isEnabled
    setIsEnabled(newEnabled)
    setAudioEnabled(newEnabled)

    if (newEnabled) {
      playSuccess()
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    setAudioVolume(newVolume)
    playButtonClick()
  }

  const handleTestSound = () => {
    playSuccess()
  }

  return (
    <div className={`relative ${className}`}>
      {/* 音频控制按钮 */}
      <NeonButton variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="relative">
        <span className="text-lg">{isEnabled ? "🔊" : "🔇"}</span>
        {isEnabled && <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
      </NeonButton>

      {/* 音频控制面板 */}
      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 z-50">
          <GlassCard className="w-64 p-4">
            <div className="space-y-4">
              <div className="text-center">
                <GradientText variant="primary" size="lg">
                  音效设置
                </GradientText>
              </div>

              {/* 启用/禁用开关 */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">启用音效</span>
                <button
                  onClick={handleToggleEnabled}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isEnabled ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* 音量控制 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">音量</span>
                  <span className="text-sm text-gray-500">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  disabled={!isEnabled}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* 测试按钮 */}
              <div className="text-center">
                <NeonButton variant="primary" size="sm" onClick={handleTestSound} disabled={!isEnabled}>
                  测试音效
                </NeonButton>
              </div>

              {/* 音效说明 */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>• 按钮交互音效</p>
                <p>• 消息收发提示音</p>
                <p>• 连接状态音效</p>
                <p>• 用户活动提示音</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
