"use client"

import { cn } from "@/lib/utils"

const variants = {
  primary: {
    base: "bg-blue-600 text-white border-blue-600 shadow-blue-500/50",
    hover: "hover:bg-blue-700 hover:shadow-blue-500/75 hover:shadow-lg",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.5)]",
  },
  secondary: {
    base: "bg-purple-600 text-white border-purple-600 shadow-purple-500/50",
    hover: "hover:bg-purple-700 hover:shadow-purple-500/75 hover:shadow-lg",
    glow: "shadow-[0_0_20px_rgba(147,51,234,0.5)]",
  },
  success: {
    base: "bg-green-600 text-white border-green-600 shadow-green-500/50",
    hover: "hover:bg-green-700 hover:shadow-green-500/75 hover:shadow-lg",
    glow: "shadow-[0_0_20px_rgba(34,197,94,0.5)]",
  },
  warning: {
    base: "bg-yellow-600 text-white border-yellow-600 shadow-yellow-500/50",
    hover: "hover:bg-yellow-700 hover:shadow-yellow-500/75 hover:shadow-lg",
    glow: "shadow-[0_0_20px_rgba(234,179,8,0.5)]",
  },
  danger: {
    base: "bg-red-600 text-white border-red-600 shadow-red-500/50",
    hover: "hover:bg-red-700 hover:shadow-red-500/75 hover:shadow-lg",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.5)]",
  },
}

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
  xl: "px-8 py-4 text-xl",
}

export default function NeonButton({
  children,
  variant = "primary",
  size = "md",
  glow = true,
  disabled = false,
  className = "",
  onClick,
  ...props
}) {
  const currentVariant = variants[variant] || variants.primary
  const currentSize = sizes[size] || sizes.md

  return (
    <button
      className={cn(
        // Base styles
        "relative font-semibold rounded-lg border-2 transition-all duration-300 transform",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        "active:scale-95",

        // Variant styles
        currentVariant.base,
        currentVariant.hover,

        // Glow effect
        glow && currentVariant.glow,

        // Size
        currentSize,

        // Disabled state
        disabled && "opacity-50 cursor-not-allowed hover:transform-none",

        className,
      )}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <span className="relative z-10">{children}</span>

      {/* Animated background */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 animate-pulse" />
    </button>
  )
}
