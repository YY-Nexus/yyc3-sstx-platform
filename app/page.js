"use client"

import { useState, useEffect } from "react"
import DropdownNavigation from "@/components/ui/DropdownNavigation"
import Logo from "@/components/ui/Logo"
import NeonButton from "@/components/ui/NeonButton"
import FloatingElements from "@/components/ui/FloatingElements"
import GlassCard from "@/components/ui/GlassCard"
import GradientText from "@/components/ui/GradientText"
import { MessageCircle, Zap, Shield, Globe, Users, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DropdownNavigation />

      {/* 浮动背景元素 */}
      <FloatingElements variant="bubbles" count={8} />

      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center">
          <div className="max-w-6xl mx-auto">
            {/* 主Logo */}
            <div className="mb-8 flex justify-center">
              <Logo size="xl" showText={true} href="#" />
            </div>

            {/* 主标题 */}
            <div className="mb-6">
              <GradientText text="YanYu Cloud³ 智能云平台" className="text-4xl md:text-6xl font-bold mb-4" />
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                下一代实时通信与云服务平台，为您提供极致的用户体验
              </p>
            </div>

            {/* CTA按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/chat">
                <NeonButton variant="primary" size="lg" glow>
                  <MessageCircle className="w-5 h-5 mr-2" />
                  开始聊天
                </NeonButton>
              </Link>
              <Link href="/modern-ui">
                <NeonButton variant="secondary" size="lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  体验UI
                </NeonButton>
              </Link>
            </div>

            {/* 特性卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <GlassCard className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">实时通信</h3>
                <p className="text-gray-600">基于WebSocket的高性能实时通信，支持多房间聊天和在线状态同步</p>
              </GlassCard>

              <GlassCard className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">安全可靠</h3>
                <p className="text-gray-600">企业级安全保障，数据加密传输，确保您的隐私和数据安全</p>
              </GlassCard>

              <GlassCard className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">全球部署</h3>
                <p className="text-gray-600">全球CDN加速，多地域部署，为用户提供最佳的访问体验</p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* 功能展示区 */}
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">强大的功能特性</h2>
              <p className="text-xl text-gray-600">为现代应用提供完整的解决方案</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">多房间聊天系统</h3>
                    <p className="text-gray-600">支持创建和管理多个聊天房间，用户可以自由切换和参与不同主题的讨论</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">在线状态管理</h3>
                    <p className="text-gray-600">实时显示用户在线状态，支持正在输入提示和最后活跃时间显示</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">现代化UI设计</h3>
                    <p className="text-gray-600">采用最新的设计趋势，玻璃态效果、霓虹按钮和流畅动画提升用户体验</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <GlassCard className="p-8">
                  <div className="text-center">
                    <Logo size="lg" showText={true} href="#" />
                    <div className="mt-6 space-y-4">
                      <div className="h-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full"></div>
                      <div className="h-2 bg-gradient-to-r from-green-200 to-blue-200 rounded-full w-3/4"></div>
                      <div className="h-2 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-1/2"></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">实时数据可视化</p>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </section>

        {/* 底部CTA */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">准备开始您的云端之旅？</h2>
            <p className="text-xl text-gray-600 mb-8">立即体验YanYu Cloud³的强大功能，开启全新的数字化体验</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <NeonButton variant="primary" size="xl" glow>
                  立即开始
                </NeonButton>
              </Link>
              <Link href="/test-socket">
                <NeonButton variant="secondary" size="xl">
                  测试连接
                </NeonButton>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
