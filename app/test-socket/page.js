"use client"

import { useState, useEffect } from "react"
import DropdownNavigation from "@/components/ui/DropdownNavigation.jsx"
import Logo from "@/components/ui/Logo.jsx"
import NeonButton from "@/components/ui/NeonButton"
import GlassCard from "@/components/ui/GlassCard"
import FloatingElements from "@/components/ui/FloatingElements"
import {
  initYanYuSocket,
  getYanYuSocket,
  isYanYuSocketConnected,
  sendChatMessage,
  onYanYuSocketEvent,
  offYanYuSocketEvent,
  disconnectYanYuSocket,
} from "@/lib/socket"
import { Wifi, WifiOff, Send, Trash2, RefreshCw, CheckCircle, XCircle, Clock, Zap } from "lucide-react"

export default function TestSocketPage() {
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [testMessage, setTestMessage] = useState("Hello from YanYu Cloud³!")
  const [connectionTime, setConnectionTime] = useState(null)
  const [latency, setLatency] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 监听连接状态
  useEffect(() => {
    const checkConnection = () => {
      setConnected(isYanYuSocketConnected())
    }

    const interval = setInterval(checkConnection, 1000)
    return () => clearInterval(interval)
  }, [])

  // 连接Socket
  const handleConnect = async () => {
    setLoading(true)
    const startTime = Date.now()

    try {
      await initYanYuSocket()
      const endTime = Date.now()
      setConnectionTime(endTime - startTime)
      setConnected(true)

      addMessage("系统", "Socket连接成功！", "success")

      // 监听消息
      onYanYuSocketEvent("chat:message", (message) => {
        addMessage(message.user || "未知用户", message.text, "received")
      })

      // 测试延迟
      testLatency()
    } catch (error) {
      console.error("连接失败:", error)
      addMessage("系统", `连接失败: ${error.message}`, "error")
      setConnected(false)
    } finally {
      setLoading(false)
    }
  }

  // 断开连接
  const handleDisconnect = () => {
    disconnectYanYuSocket()
    setConnected(false)
    setConnectionTime(null)
    setLatency(null)
    addMessage("系统", "Socket连接已断开", "warning")
  }

  // 发送测试消息
  const handleSendMessage = () => {
    if (!connected || !testMessage.trim()) return

    try {
      const startTime = Date.now()
      sendChatMessage(testMessage, "测试用户")

      addMessage("测试用户", testMessage, "sent")
      setTestMessage("")

      // 计算发送延迟
      setTimeout(() => {
        const sendLatency = Date.now() - startTime
        addMessage("系统", `消息发送延迟: ${sendLatency}ms`, "info")
      }, 100)
    } catch (error) {
      addMessage("系统", `发送失败: ${error.message}`, "error")
    }
  }

  // 测试延迟
  const testLatency = () => {
    if (!connected) return

    const startTime = Date.now()
    const socket = getYanYuSocket()

    socket.emit("ping", { timestamp: startTime })

    const handlePong = (data) => {
      const endTime = Date.now()
      const latencyMs = endTime - data.timestamp
      setLatency(latencyMs)
      addMessage("系统", `延迟测试: ${latencyMs}ms`, "info")
      offYanYuSocketEvent("pong", handlePong)
    }

    onYanYuSocketEvent("pong", handlePong)

    // 如果5秒内没有收到pong，认为超时
    setTimeout(() => {
      if (latency === null) {
        addMessage("系统", "延迟测试超时", "warning")
        offYanYuSocketEvent("pong", handlePong)
      }
    }, 5000)
  }

  // 添加消息到日志
  const addMessage = (user, text, type = "info") => {
    const message = {
      id: Date.now() + Math.random(),
      user,
      text,
      type,
      timestamp: new Date().toLocaleTimeString(),
    }
    setMessages((prev) => [...prev, message])
  }

  // 清空消息日志
  const clearMessages = () => {
    setMessages([])
  }

  // 获取消息样式
  const getMessageStyle = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "sent":
        return "bg-blue-50 border-blue-200 text-blue-800"
      case "received":
        return "bg-purple-50 border-purple-200 text-purple-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  // 获取消息图标
  const getMessageIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4" />
      case "error":
        return <XCircle className="w-4 h-4" />
      case "warning":
        return <Clock className="w-4 h-4" />
      case "sent":
        return <Send className="w-4 h-4" />
      case "received":
        return <Zap className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DropdownNavigation />

      {/* 浮动背景元素 */}
      <FloatingElements variant="geometric" count={6} />

      <div className="pt-16 p-4">
        <div className="max-w-6xl mx-auto">
          {/* 页面标题 */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Logo size="md" showText={false} />
              <h1 className="text-3xl font-bold text-gray-900">Socket连接测试</h1>
            </div>
            <p className="text-gray-600">测试WebSocket连接状态和性能指标</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 连接控制面板 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 连接状态 */}
              <GlassCard className="p-6">
                <div className="text-center">
                  <div className="mb-4">
                    {connected ? (
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Wifi className="w-8 h-8 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <WifiOff className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{connected ? "已连接" : "未连接"}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {connected ? "WebSocket连接正常" : "点击下方按钮建立连接"}
                  </p>

                  {!connected ? (
                    <NeonButton variant="primary" onClick={handleConnect} disabled={loading} className="w-full">
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          连接中...
                        </>
                      ) : (
                        <>
                          <Wifi className="w-4 h-4 mr-2" />
                          连接Socket
                        </>
                      )}
                    </NeonButton>
                  ) : (
                    <NeonButton variant="danger" onClick={handleDisconnect} className="w-full">
                      <WifiOff className="w-4 h-4 mr-2" />
                      断开连接
                    </NeonButton>
                  )}
                </div>
              </GlassCard>

              {/* 性能指标 */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">性能指标</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">连接时间</span>
                    <span className="font-medium">{connectionTime ? `${connectionTime}ms` : "-"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">延迟</span>
                    <span className="font-medium">{latency ? `${latency}ms` : "-"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">状态</span>
                    <span className={`text-sm font-medium ${connected ? "text-green-600" : "text-gray-400"}`}>
                      {connected ? "在线" : "离线"}
                    </span>
                  </div>
                </div>

                {connected && (
                  <div className="mt-4">
                    <NeonButton variant="secondary" size="sm" onClick={testLatency} className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      测试延迟
                    </NeonButton>
                  </div>
                )}
              </GlassCard>

              {/* 消息发送测试 */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">消息测试</h3>
                <div className="space-y-3">
                  <textarea
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="输入测试消息..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    disabled={!connected}
                  />
                  <NeonButton
                    variant="primary"
                    onClick={handleSendMessage}
                    disabled={!connected || !testMessage.trim()}
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    发送测试消息
                  </NeonButton>
                </div>
              </GlassCard>
            </div>

            {/* 消息日志 */}
            <div className="lg:col-span-2">
              <GlassCard className="p-6 h-[600px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">消息日志</h3>
                  <NeonButton variant="warning" size="sm" onClick={clearMessages} disabled={messages.length === 0}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    清空日志
                  </NeonButton>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <div className="text-4xl mb-4">📝</div>
                      <p className="text-center">
                        暂无消息日志
                        <br />
                        <span className="text-sm">连接Socket后开始测试</span>
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className={`p-3 rounded-lg border ${getMessageStyle(message.type)}`}>
                        <div className="flex items-start gap-2">
                          {getMessageIcon(message.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{message.user}</span>
                              <span className="text-xs opacity-75">{message.timestamp}</span>
                            </div>
                            <p className="text-sm break-words">{message.text}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </GlassCard>
            </div>
          </div>

          {/* 底部信息 */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full text-sm text-gray-600">
              <Logo size="sm" showText={false} />
              <span>YanYu Cloud³ WebSocket测试工具</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
