"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Logo from "./Logo"
import { cn } from "@/lib/utils"
import { ChevronDown, Menu, X, Home, MessageCircle, TestTube, Palette, Info } from "lucide-react"

const navigationItems = [
  {
    category: "主要功能",
    items: [
      { name: "首页", href: "/", icon: Home, description: "平台主页" },
      { name: "聊天室", href: "/chat", icon: MessageCircle, description: "实时聊天" },
      { name: "Socket测试", href: "/test-socket", icon: TestTube, description: "连接测试" },
    ],
  },
  {
    category: "UI展示",
    items: [{ name: "现代UI", href: "/modern-ui", icon: Palette, description: "UI组件展示" }],
  },
  {
    category: "关于",
    items: [{ name: "关于我们", href: "/about", icon: Info, description: "了解更多" }],
  },
]

export default function DropdownNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // 获取当前页面信息
  const getCurrentPage = () => {
    for (const category of navigationItems) {
      for (const item of category.items) {
        if (item.href === pathname) {
          return item
        }
      }
    }
    return { name: "YanYu Cloud³", description: "智能云平台", icon: Home }
  }

  const currentPage = getCurrentPage()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo size="sm" showText={!isMobile} />

          {/* 桌面端导航 */}
          {!isMobile && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200 group"
              >
                <currentPage.icon className="w-4 h-4 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">{currentPage.name}</div>
                  <div className="text-xs text-gray-500">{currentPage.description}</div>
                </div>
                <ChevronDown
                  className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", isOpen && "rotate-180")}
                />
              </button>

              {/* 下拉菜单 */}
              {isOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-in slide-in-from-top-2 duration-200"
                  onMouseLeave={() => setIsOpen(false)}
                >
                  {navigationItems.map((category, categoryIndex) => (
                    <div key={category.category}>
                      {categoryIndex > 0 && <div className="border-t border-gray-100 my-2" />}
                      <div className="px-3 py-2">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          {category.category}
                        </div>
                        <div className="space-y-1">
                          {category.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200",
                                pathname === item.href ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700",
                              )}
                            >
                              <item.icon className="w-4 h-4" />
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-xs text-gray-500">{item.description}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 移动端菜单按钮 */}
          {isMobile && (
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>

        {/* 移动端菜单 */}
        {isMobile && isOpen && (
          <div className="border-t border-gray-200 py-4 animate-in slide-in-from-top-2 duration-200">
            {navigationItems.map((category, categoryIndex) => (
              <div key={category.category} className="mb-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                  {category.category}
                </div>
                <div className="space-y-1">
                  {category.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
                        pathname === item.href ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700",
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
