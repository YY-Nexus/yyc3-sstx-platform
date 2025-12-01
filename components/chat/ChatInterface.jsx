"use client"

import { useState, useEffect, useRef } from "react"
import MessageBubble from "./MessageBubble"
import ChatInput from "./ChatInput"
import {
  initYanYuSocket,
  getYanYuSocket,
  isYanYuSocketConnected,
  sendChatMessage,
  onYanYuSocketEvent,
  offYanYuSocketEvent,
  updateUserStatus,
  joinRoom,
  leaveRoom,
} from "@/lib/socket"
import {
  playConnected,
  playDisconnected,
  playMessageReceive,
  playUserJoin,
  playUserLeave,
  playNotification,
} from "@/lib/audio"

export default function ChatInterface({
  userName = "访客用户",
  roomId = "general",
  showHeader = true,
  height = "600px",
  onConnectionChange = () => {},
}) {
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState({})
  const [replyTo, setReplyTo] = useState(null)
  const [isTyping, setIsTyping] = useState({})
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  // 生成唯一用户ID
  const [userId] = useState(() => {
    return `user_${Math.random().toString(36).substring(2, 9)}`
  })

  // 初始化Socket连接
  useEffect(() => {
    const setupSocket = async () => {
      try {
        setLoading(true)
        await initYanYuSocket()

        // 加入房间
        if (isYanYuSocketConnected()) {
          joinRoom(roomId)

          // 发送系统消息通知加入
          const socket = getYanYuSocket()
          socket.emit("chat:message", {
            id: `system_${Date.now()}`,
            text: `${userName} 加入了聊天室`,
            type: "system",
            timestamp: new Date().toISOString(),
            room: roomId,
          })

          // 更新用户状态为在线
          updateUserStatus("online")
        }

        setLoading(false)
      } catch (error) {
        console.error("聊天组件初始化失败:", error)
        setLoading(false)
      }
    }

    setupSocket()

    // 组件卸载时离开房间
    return () => {
      if (isYanYuSocketConnected()) {
        // 发送系统消息通知离开
        const socket = getYanYuSocket()
        socket.emit("chat:message", {
          id: `system_${Date.now()}`,
          text: `${userName} 离开了聊天室`,
          type: "system",
          timestamp: new Date().toISOString(),
          room: roomId,
        })

        // 离开房间
        leaveRoom(roomId)

        // 更新用户状态为离线
        updateUserStatus("offline")
      }
    }
  }, [roomId, userName, userId])

  // 监听Socket事件
  useEffect(() => {
    // 连接状态处理
    const handleConnect = () => {
      setConnected(true)
      onConnectionChange(true)
      playConnected()

      // 连接后加入房间
      joinRoom(roomId)

      // 更新用户状态
      updateUserStatus("online")
    }

    const handleDisconnect = () => {
      setConnected(false)
      onConnectionChange(false)
      playDisconnected()
    }

    // 消息处理
    const handleChatMessage = (message) => {
      // 只处理当前房间的消息
      if (message.room && message.room !== roomId) return

      setMessages((prev) => [...prev, message])

      // 播放消息接收音效（如果不是自己发送的消息）
      if (message.clientId !== userId && message.type !== "system") {
        playMessageReceive()
      }

      // 如果是用户消息，更新用户列表
      if (message.user && message.clientId && message.type !== "system") {
        setUsers((prev) => ({
          ...prev,
          [message.clientId]: {
            name: message.user,
            status: "online",
            lastActive: new Date().toISOString(),
          },
        }))
      }

      // 如果有人正在输入，取消输入状态
      if (message.clientId && isTyping[message.clientId]) {
        setIsTyping((prev) => ({
          ...prev,
          [message.clientId]: false,
        }))
      }
    }

    // 用户状态处理
    const handleUserStatus = (data) => {
      if (data.userId && data.status) {
        setUsers((prev) => ({
          ...prev,
          [data.userId]: {
            ...prev[data.userId],
            status: data.status,
            lastActive: new Date().toISOString(),
          },
        }))
      }
    }

    // 用户输入状态处理
    const handleUserTyping = (data) => {
      if (data.userId && data.room === roomId) {
        setIsTyping((prev) => ({
          ...prev,
          [data.userId]: data.isTyping,
        }))

        // 3秒后自动清除输入状态
        if (data.isTyping) {
          setTimeout(() => {
            setIsTyping((prev) => ({
              ...prev,
              [data.userId]: false,
            }))
          }, 3000)
        }
      }
    }

    // 房间用户加入处理
    const handleUserJoined = (data) => {
      if (data.room === roomId) {
        playUserJoin()

        // 添加系统消息
        setMessages((prev) => [
          ...prev,
          {
            id: `system_${Date.now()}`,
            text: `新用户加入了聊天室`,
            type: "system",
            timestamp: new Date().toISOString(),
          },
        ])
      }
    }

    // 房间用户离开处理
    const handleUserLeft = (data) => {
      if (data.room === roomId) {
        playUserLeave()

        // 添加系统消息
        setMessages((prev) => [
          ...prev,
          {
            id: `system_${Date.now()}`,
            text: `有用户离开了聊天室`,
            type: "system",
            timestamp: new Date().toISOString(),
          },
        ])

        // 更新用户状态
        if (data.userId) {
          setUsers((prev) => ({
            ...prev,
            [data.userId]: {
              ...prev[data.userId],
              status: "offline",
              lastActive: new Date().toISOString(),
            },
          }))
        }
      }
    }

    // 服务器广播处理
    const handleServerBroadcast = (data) => {
      playNotification()

      setMessages((prev) => [
        ...prev,
        {
          id: `broadcast_${Date.now()}`,
          text: data.message || "服务器广播消息",
          type: "system",
          timestamp: new Date().toISOString(),
        },
      ])
    }

    // 注册事件监听
    onYanYuSocketEvent("connect", handleConnect)
    onYanYuSocketEvent("disconnect", handleDisconnect)
    onYanYuSocketEvent("chat:message", handleChatMessage)
    onYanYuSocketEvent("user:status", handleUserStatus)
    onYanYuSocketEvent("user:typing", handleUserTyping)
    onYanYuSocketEvent("room:user-joined", handleUserJoined)
    onYanYuSocketEvent("room:user-left", handleUserLeft)
    onYanYuSocketEvent("server:broadcast", handleServerBroadcast)

    // 检查初始连接状态
    setConnected(isYanYuSocketConnected())
    onConnectionChange(isYanYuSocketConnected())

    // 清理函数
    return () => {
      offYanYuSocketEvent("connect", handleConnect)
      offYanYuSocketEvent("disconnect", handleDisconnect)
      offYanYuSocketEvent("chat:message", handleChatMessage)
      offYanYuSocketEvent("user:status", handleUserStatus)
      offYanYuSocketEvent("user:typing", handleUserTyping)
      offYanYuSocketEvent("room:user-joined", handleUserJoined)
      offYanYuSocketEvent("room:user-left", handleUserLeft)
      offYanYuSocketEvent("server:broadcast", handleServerBroadcast)
    }
  }, [roomId, onConnectionChange, isTyping, userId])

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 发送消息
  const handleSendMessage = (text) => {
    if (!text.trim() || !connected) return

    try {
      // 构建消息对象
      const messageData = {
        text,
        user: userName,
        clientId: userId,
        room: roomId,
        replyTo: replyTo
          ? {
              id: replyTo.id,
              text: replyTo.text,
              user: replyTo.user,
            }
          : null,
      }

      // 发送消息
      sendChatMessage(text, userName)

      // 清除回复状态
      setReplyTo(null)
    } catch (error) {
      console.error("发送消息失败:", error)

      // 添加错误消息
      setMessages((prev) => [
        ...prev,
        {
          id: `error_${Date.now()}`,
          text: "消息发送失败，请检查网络连接",
          type: "system",
          timestamp: new Date().toISOString(),
        },
      ])
    }
  }

  // 处理回复消息
  const handleReply = (message) => {
    setReplyTo(message)
  }

  // 处理删除消息
  const handleDeleteMessage = (message) => {
    // 在实际应用中，这里应该发送删除请求到服务器
    // 这里仅做本地删除演示
    setMessages((prev) => prev.filter((msg) => msg.id !== message.id))
  }

  // 处理输入状态
  const handleTypingStart = () => {
    if (connected) {
      const socket = getYanYuSocket()
      socket.emit("user:typing", {
        userId,
        room: roomId,
        isTyping: true,
      })
    }
  }

  const handleTypingEnd = () => {
    if (connected) {
      const socket = getYanYuSocket()
      socket.emit("user:typing", {
        userId,
        room: roomId,
        isTyping: false,
      })
    }
  }

  // 获取正在输入的用户列表
  const getTypingUsers = () => {
    return Object.entries(isTyping)
      .filter(([id, isTyping]) => isTyping && id !== userId && users[id])
      .map(([id]) => users[id]?.name || "某用户")
  }

  const typingUsers = getTypingUsers()

  return (
    <div
      className="flex flex-col rounded-lg overflow-hidden border border-gray-200 shadow-md bg-white"
      style={{ height }}
    >
      {/* 聊天头部 */}
      {showHeader && (
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">{roomId === "general" ? "公共聊天室" : `聊天室: ${roomId}`}</h2>
            <div className="text-xs bg-blue-700 px-2 py-0.5 rounded-full">
              {Object.keys(users).filter((id) => users[id]?.status === "online").length} 人在线
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-400" : "bg-red-500"}`}></div>
            <span className="text-sm">{loading ? "连接中..." : connected ? "已连接" : "未连接"}</span>
          </div>
        </div>
      )}

      {/* 聊天内容区 */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <div className="text-5xl mb-4">💬</div>
            <div className="text-center">
              <p className="mb-1">暂无消息</p>
              <p className="text-sm">成为第一个发言的人吧！</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              // 确定是否显示头像（如果连续消息来自同一用户，只在第一条显示）
              const showAvatar =
                index === 0 ||
                messages[index - 1].user !== msg.user ||
                new Date(msg.timestamp) - new Date(messages[index - 1].timestamp) > 60000

              return (
                <MessageBubble
                  key={msg.id || index}
                  message={msg}
                  isCurrentUser={msg.user === userName || msg.clientId === userId}
                  showAvatar={showAvatar}
                  status="delivered"
                  onReply={handleReply}
                  onDelete={handleDeleteMessage}
                />
              )
            })}

            {/* 用户输入状态提示 */}
            {typingUsers.length > 0 && (
              <div className="text-xs text-gray-500 italic ml-10 mb-2">
                {typingUsers.length === 1 ? `${typingUsers[0]} 正在输入...` : `${typingUsers.length}人正在输入...`}
              </div>
            )}

            {/* 用于自动滚动的引用元素 */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 聊天输入区 */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={!connected}
        placeholder={connected ? "输入消息..." : "等待连接..."}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        onTypingStart={handleTypingStart}
        onTypingEnd={handleTypingEnd}
      />
    </div>
  )
}
