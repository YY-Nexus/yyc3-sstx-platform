"use client"

import { useState, useEffect } from "react"
import DropdownNavigation from "@/components/ui/DropdownNavigation"
import Logo from "@/components/ui/Logo"
import NeonButton from "@/components/ui/NeonButton"
import GlassCard from "@/components/ui/GlassCard"
import FloatingElements from "@/components/ui/FloatingElements"
import AnimatedBackground from "@/components/ui/AnimatedBackground"
import GradientText from "@/components/ui/GradientText"
import ParallaxSection from "@/components/ui/ParallaxSection"
import MorphingCard from "@/components/ui/MorphingCard"
import ProgressRing from "@/components/ui/ProgressRing"
import { Palette, Sparkles, Zap, Heart, Star, Rocket, Code, Layers, Wand2 } from "lucide-react"

export default function ModernUIPage() {
  const [mounted, setMounted] = useState(false)
  const [activeDemo, setActiveDemo] = useState("buttons")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const demoSections = [
    { id: "buttons", name: "霓虹按钮", icon: Zap },
    { id: "cards", name: "玻璃卡片", icon: Layers },
    { id: "text", name: "渐变文字", icon: Wand2 },
    { id: "progress", name: "进度环", icon: Star },
    { id: "animations", name: "动画效果", icon: Sparkles },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      <DropdownNavigation />

      {/* 动态背景 */}
      <AnimatedBackground />
      <FloatingElements variant="bubbles" count={10} />

      <div className="pt-16 relative z-10">
        {/* Hero Section */}
        <ParallaxSection className="py-20 px-4 text-center">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex justify-center">
              <Logo size="xl" showText={true} href="#" />
            </div>

            <GradientText text="现代化UI组件展示" className="text-4xl md:text-6xl font-bold mb-6" />

            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              体验YanYu Cloud³的精美UI组件库，感受现代设计的魅力
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {demoSections.map((section) => (
                <NeonButton
                  key={section.id}
                  variant={activeDemo === section.id ? "primary" : "secondary"}
                  onClick={() => setActiveDemo(section.id)}
                  glow={activeDemo === section.id}
                >
                  <section.icon className="w-4 h-4 mr-2" />
                  {section.name}
                </NeonButton>
              ))}
            </div>
          </div>
        </ParallaxSection>

        {/* 组件展示区 */}
        <div className="px-4 pb-20">
          <div className="max-w-6xl mx-auto">
            {/* 霓虹按钮展示 */}
            {activeDemo === "buttons" && (
              <GlassCard className="p-8 mb-8">
                <h2 className="text-2xl font-bold text-center mb-8">霓虹按钮组件</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center space-y-4">
                    <h3 className="font-semibold">基础样式</h3>
                    <div className="space-y-3">
                      <NeonButton variant="primary" glow>
                        Primary
                      </NeonButton>
                      <NeonButton variant="secondary" glow>
                        Secondary
                      </NeonButton>
                      <NeonButton variant="success" glow>
                        Success
                      </NeonButton>
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <h3 className="font-semibold">不同尺寸</h3>
                    <div className="space-y-3">
                      <NeonButton variant="primary" size="sm" glow>
                        Small
                      </NeonButton>
                      <NeonButton variant="primary" size="md" glow>
                        Medium
                      </NeonButton>
                      <NeonButton variant="primary" size="lg" glow>
                        Large
                      </NeonButton>
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <h3 className="font-semibold">带图标</h3>
                    <div className="space-y-3">
                      <NeonButton variant="primary" glow>
                        <Heart className="w-4 h-4 mr-2" />
                        喜欢
                      </NeonButton>
                      <NeonButton variant="warning" glow>
                        <Star className="w-4 h-4 mr-2" />
                        收藏
                      </NeonButton>
                      <NeonButton variant="danger" glow>
                        <Rocket className="w-4 h-4 mr-2" />
                        发射
                      </NeonButton>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* 玻璃卡片展示 */}
            {activeDemo === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <GlassCard className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">开发工具</h3>
                  <p className="text-gray-600">现代化的开发环境和工具链</p>
                </GlassCard>

                <MorphingCard className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Layers className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">组件库</h3>
                  <p className="text-gray-600">丰富的UI组件和设计系统</p>
                </MorphingCard>

                <GlassCard className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Palette className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">设计系统</h3>
                  <p className="text-gray-600">统一的视觉语言和交互规范</p>
                </GlassCard>
              </div>
            )}

            {/* 渐变文字展示 */}
            {activeDemo === "text" && (
              <GlassCard className="p-8 mb-8 text-center">
                <h2 className="text-2xl font-bold mb-8">渐变文字效果</h2>
                <div className="space-y-6">
                  <GradientText text="YanYu Cloud³" className="text-5xl font-bold" />
                  <GradientText
                    text="现代化云服务平台"
                    className="text-3xl font-semibold"
                    gradient="from-green-400 to-blue-500"
                  />
                  <GradientText
                    text="创新 · 高效 · 可靠"
                    className="text-2xl font-medium"
                    gradient="from-purple-400 via-pink-500 to-red-500"
                  />
                  <GradientText
                    text="Experience the Future"
                    className="text-xl"
                    gradient="from-cyan-400 to-purple-600"
                  />
                </div>
              </GlassCard>
            )}

            {/* 进度环展示 */}
            {activeDemo === "progress" && (
              <GlassCard className="p-8 mb-8">
                <h2 className="text-2xl font-bold text-center mb-8">进度环组件</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="text-center">
                    <ProgressRing progress={75} size={120} strokeWidth={8} />
                    <p className="mt-4 font-semibold">系统性能</p>
                    <p className="text-sm text-gray-600">75%</p>
                  </div>

                  <div className="text-center">
                    <ProgressRing progress={90} size={120} strokeWidth={8} color="from-green-400 to-emerald-600" />
                    <p className="mt-4 font-semibold">连接质量</p>
                    <p className="text-sm text-gray-600">90%</p>
                  </div>

                  <div className="text-center">
                    <ProgressRing progress={60} size={120} strokeWidth={8} color="from-yellow-400 to-orange-500" />
                    <p className="mt-4 font-semibold">存储使用</p>
                    <p className="text-sm text-gray-600">60%</p>
                  </div>

                  <div className="text-center">
                    <ProgressRing progress={85} size={120} strokeWidth={8} color="from-purple-400 to-pink-600" />
                    <p className="mt-4 font-semibold">用户满意度</p>
                    <p className="text-sm text-gray-600">85%</p>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* 动画效果展示 */}
            {activeDemo === "animations" && (
              <div className="space-y-8">
                <GlassCard className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-8">浮动动画效果</h2>
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <FloatingElements variant="bubbles" count={15} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Logo size="lg" showText={true} />
                        <p className="mt-4 text-gray-600">气泡浮动效果</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-8">几何图形动画</h2>
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <FloatingElements variant="geometric" count={8} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <GradientText text="几何美学" className="text-3xl font-bold" />
                        <p className="mt-4 text-gray-600">三角形旋转效果</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}

            {/* 底部信息 */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/50 rounded-full text-sm text-gray-600">
                <Logo size="sm" showText={false} />
                <span>YanYu Cloud³ 现代UI组件库</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
