"use client"

import { useState, useEffect } from "react"
import DropdownNavigation from "@/components/ui/DropdownNavigation.jsx"
import ChatInterface from "@/components/chat/ChatInterface"
import OnlineUsers from "@/components/chat/OnlineUsers"
import ChatRooms from "@/components/chat/ChatRooms"
import Logo from "@/components/ui/Logo.jsx"
import GlassCard from "@/components/ui/GlassCard"
import FloatingElements from "@/components/ui/FloatingElements"
import { Users, MessageSquare, Settings } from "lucide-react"

export default function ChatPage() {
  const [userName, setUserName] = useState("")
  const [currentRoom, setCurrentRoom] = useState("general")
  const [isConnected, setIsConnected] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 生成唯一用户ID
  const [userId] = useState(() => {
    return `user_${Math.random().toString(36).substring(2, 9)}`
  })

  useEffect(() => {
    setMounted(true)
    // 从localStorage获取用户名
    const savedUserName = localStorage.getItem("yanyu_username")
    if (savedUserName) {
      setUserName(savedUserName)
    } else {
      setUserName(`访客${Math.floor(Math.random() * 1000)}`)
    }
  }, [])

  // 保存用户名到localStorage
  const handleUserNameChange = (newName) => {
    setUserName(newName)
    localStorage.setItem("yanyu_username", newName)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DropdownNavigation />

      {/* 浮动背景元素 */}
      <FloatingElements variant="particles" count={12} />

      <div className="pt-16 p-4">
        <div className="max-w-7xl mx-auto">
          {/* 页面标题 */}
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Logo size="md" showText={false} />
              <h1 className="text-3xl font-bold text-gray-900">实时聊天室</h1>
            </div>
            <p className="text-gray-600">与全球用户实时交流，体验极速通信</p>
          </div>

          {/* 连接状态指示器 */}
          <div className="mb-4 flex justify-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                isConnected ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-yellow-500"}`}></div>
              {isConnected ? "已连接" : "连接中..."}
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 左侧边栏 - 房间列表 */}
            <div className="lg:col-span-1 space-y-4">
              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h2 className="font-semibold">聊天房间</h2>
                </div>
                <ChatRooms currentRoom={currentRoom} onRoomChange={setCurrentRoom} />
              </GlassCard>

              {/* 用户设置 */}
              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <h2 className="font-semibold">用户设置</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => handleUserNameChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="输入您的用户名"
                    />
                  </div>
                  <div className="text-xs text-gray-500">用户ID: {userId}</div>
                </div>
              </GlassCard>
            </div>

            {/* 中间 - 聊天界面 */}
            <div className="lg:col-span-2">
              <GlassCard className="h-[600px] overflow-hidden">
                <ChatInterface
                  userName={userName}
                  roomId={currentRoom}
                  showHeader={true}
                  height="100%"
                  onConnectionChange={setIsConnected}
                />
              </GlassCard>
            </div>

            {/* 右侧边栏 - 在线用户 */}
            <div className="lg:col-span-1">
              <GlassCard className="p-0 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <h2 className="font-semibold">在线用户</h2>
                  </div>
                </div>
                <div className="p-4">
                  <OnlineUsers roomId={currentRoom} currentUserId={userId} />
                </div>
              </GlassCard>
            </div>
          </div>

          {/* 底部信息 */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full text-sm text-gray-600">
              <Logo size="sm" showText={false} />
              <span>Powered by YanYu Cloud³</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
