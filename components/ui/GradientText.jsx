"use client"

export default function GradientText({
  children,
  variant = "primary",
  size = "base",
  animated = false,
  className = "",
}) {
  const variants = {
    primary: "from-blue-600 via-purple-600 to-blue-800",
    secondary: "from-purple-600 via-pink-600 to-purple-800",
    success: "from-green-600 via-emerald-600 to-green-800",
    warning: "from-yellow-600 via-orange-600 to-yellow-800",
    danger: "from-red-600 via-pink-600 to-red-800",
    rainbow: "from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500",
  }

  const sizes = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
  }

  return (
    <span
      className={`
        bg-gradient-to-r ${variants[variant]} bg-clip-text text-transparent font-bold
        ${sizes[size]}
        ${animated ? "animate-gradient-x bg-[length:200%_200%]" : ""}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
