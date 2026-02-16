"use client"

// 音频管理器类
class AudioManager {
  constructor() {
    this.sounds = new Map()
    this.isEnabled = true
    this.volume = 0.5
    this.isInitialized = false

    // 从本地存储加载设置
    if (typeof window !== "undefined") {
      const savedEnabled = localStorage.getItem("yanyu-audio-enabled")
      const savedVolume = localStorage.getItem("yanyu-audio-volume")

      this.isEnabled = savedEnabled !== null ? JSON.parse(savedEnabled) : true
      this.volume = savedVolume !== null ? Number.parseFloat(savedVolume) : 0.5
    }
  }

  // 初始化音频系统
  async initialize() {
    if (this.isInitialized) return

    try {
      // 预加载音频文件
      await this.loadSounds()
      this.isInitialized = true
      console.log("🔊 YanYu Cloud³ 音频系统初始化完成")
    } catch (error) {
      console.error("音频系统初始化失败:", error)
    }
  }

  // 加载音频文件
  async loadSounds() {
    const soundFiles = {
      // 按钮交互音效
      buttonHover: this.createTone(800, 0.1, "sine"),
      buttonClick: this.createTone(1000, 0.15, "square"),
      buttonSuccess: this.createChord([523, 659, 784], 0.3), // C大调和弦

      // 消息音效
      messageReceive: this.createTone(660, 0.2, "sine"),
      messageSend: this.createTone(880, 0.15, "triangle"),
      messageError: this.createTone(220, 0.3, "sawtooth"),

      // 连接状态音效
      connected: this.createChord([440, 554, 659], 0.4),
      disconnected: this.createTone(330, 0.5, "sawtooth"),

      // 用户活动音效
      userJoin: this.createTone(523, 0.2, "sine"),
      userLeave: this.createTone(392, 0.2, "sine"),
      typing: this.createTone(1200, 0.05, "sine"),

      // UI交互音效
      cardFlip: this.createSweep(400, 800, 0.3),
      progressUpdate: this.createTone(1320, 0.1, "triangle"),
      notification: this.createChord([659, 831, 988], 0.4),

      // 特殊效果音效
      achievement: this.createMelody([523, 659, 784, 1047], 0.15),
      error: this.createTone(165, 0.4, "sawtooth"),
      success: this.createMelody([523, 659, 784], 0.2),
    }

    // 将音频添加到管理器
    for (const [name, audioBuffer] of Object.entries(soundFiles)) {
      this.sounds.set(name, audioBuffer)
    }
  }

  // 创建单音调
  createTone(frequency, duration, waveType = "sine") {
    if (typeof window === "undefined") return { type: "tone", frequency, duration }
    
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (!AudioContextClass) return { type: "tone", frequency, duration }
      
      const audioContext = new AudioContextClass()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = waveType

      // 音量包络
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)

      return { type: "tone", frequency, duration, audioContext, oscillator, gainNode }
    } catch (error) {
      console.warn("AudioContext not available:", error)
      return { type: "tone", frequency, duration }
    }
  }

  // 创建和弦
  createChord(frequencies, duration) {
    return frequencies.map((freq) => this.createTone(freq, duration, "sine"))
  }

  // 创建旋律
  createMelody(frequencies, noteDuration) {
    return frequencies.map((freq, index) => ({
      frequency: freq,
      startTime: index * noteDuration,
      duration: noteDuration,
    }))
  }

  // 创建频率扫描音效
  createSweep(startFreq, endFreq, duration) {
    if (typeof window === "undefined") return { type: "sweep", startFreq, endFreq, duration }
    
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (!AudioContextClass) return { type: "sweep", startFreq, endFreq, duration }
      
      const audioContext = new AudioContextClass()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(startFreq, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(endFreq, audioContext.currentTime + duration)
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)

      return { type: "sweep", startFreq, endFreq, duration, audioContext, oscillator, gainNode }
    } catch (error) {
      console.warn("AudioContext not available:", error)
      return { type: "sweep", startFreq, endFreq, duration }
    }
  }

  // 播放音效
  play(soundName, options = {}) {
    if (!this.isEnabled || !this.isInitialized) return

    try {
      const sound = this.sounds.get(soundName)
      if (!sound) {
        console.warn(`音效 "${soundName}" 未找到`)
        return
      }

      // 处理不同类型的音效
      if (Array.isArray(sound)) {
        // 和弦或旋律
        if (sound.every((item) => typeof item === "object" && "frequency" in item && "startTime" in item)) {
          // 旋律
          sound.forEach((note) => {
            setTimeout(() => {
              this.createTone(note.frequency, note.duration, "sine")
            }, note.startTime * 1000)
          })
        } else {
          // 和弦 - 简单地遍历音调对象
          sound.forEach((toneObj) => {
            if (toneObj && typeof toneObj === "object") {
              // 对象已经在 createTone 中处理过了
            }
          })
        }
      } else if (sound && typeof sound === "object") {
        // 单音调或扫描对象
        // 音效已在创建时播放
      }
    } catch (error) {
      console.error(`播放音效 "${soundName}" 失败:`, error)
    }
  }

  // 设置音量
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
    if (typeof window !== "undefined") {
      localStorage.setItem("yanyu-audio-volume", this.volume.toString())
    }
  }

  // 启用/禁用音效
  setEnabled(enabled) {
    this.isEnabled = enabled
    if (typeof window !== "undefined") {
      localStorage.setItem("yanyu-audio-enabled", JSON.stringify(enabled))
    }
  }

  // 获取音量
  getVolume() {
    return this.volume
  }

  // 获取启用状态
  getEnabled() {
    return this.isEnabled
  }

  // 播放按钮悬停音效
  playButtonHover() {
    this.play("buttonHover")
  }

  // 播放按钮点击音效
  playButtonClick() {
    this.play("buttonClick")
  }

  // 播放成功音效
  playSuccess() {
    this.play("success")
  }

  // 播放错误音效
  playError() {
    this.play("error")
  }

  // 播放消息接收音效
  playMessageReceive() {
    this.play("messageReceive")
  }

  // 播放消息发送音效
  playMessageSend() {
    this.play("messageSend")
  }

  // 播放连接音效
  playConnected() {
    this.play("connected")
  }

  // 播放断开连接音效
  playDisconnected() {
    this.play("disconnected")
  }

  // 播放用户加入音效
  playUserJoin() {
    this.play("userJoin")
  }

  // 播放用户离开音效
  playUserLeave() {
    this.play("userLeave")
  }

  // 播放输入音效
  playTyping() {
    this.play("typing")
  }

  // 播放卡片翻转音效
  playCardFlip() {
    this.play("cardFlip")
  }

  // 播放进度更新音效
  playProgressUpdate() {
    this.play("progressUpdate")
  }

  // 播放通知音效
  playNotification() {
    this.play("notification")
  }

  // 播放成就音效
  playAchievement() {
    this.play("achievement")
  }
}

// 创建全局音频管理器实例
const audioManager = new AudioManager()

// 导出音频管理器和便捷函数
export default audioManager

export const initAudio = () => audioManager.initialize()
export const playSound = (soundName, options) => audioManager.play(soundName, options)
export const setAudioVolume = (volume) => audioManager.setVolume(volume)
export const setAudioEnabled = (enabled) => audioManager.setEnabled(enabled)
export const getAudioVolume = () => audioManager.getVolume()
export const getAudioEnabled = () => audioManager.getEnabled()

// 便捷播放函数
export const playButtonHover = () => audioManager.playButtonHover()
export const playButtonClick = () => audioManager.playButtonClick()
export const playSuccess = () => audioManager.playSuccess()
export const playError = () => audioManager.playError()
export const playMessageReceive = () => audioManager.playMessageReceive()
export const playMessageSend = () => audioManager.playMessageSend()
export const playConnected = () => audioManager.playConnected()
export const playDisconnected = () => audioManager.playDisconnected()
export const playUserJoin = () => audioManager.playUserJoin()
export const playUserLeave = () => audioManager.playUserLeave()
export const playTyping = () => audioManager.playTyping()
export const playCardFlip = () => audioManager.playCardFlip()
export const playProgressUpdate = () => audioManager.playProgressUpdate()
export const playNotification = () => audioManager.playNotification()
export const playAchievement = () => audioManager.playAchievement()
