"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  href?: string
  className?: string
}

const sizeConfig = {
  sm: { width: 32, height: 32, textSize: "text-sm" },
  md: { width: 48, height: 48, textSize: "text-base" },
  lg: { width: 64, height: 64, textSize: "text-lg" },
  xl: { width: 80, height: 80, textSize: "text-xl" },
}

export default function Logo({ size = "md", showText = true, href = "/", className = "" }: LogoProps) {
  const config = sizeConfig[size]

  const logoContent = (
    <div className={cn("flex items-center gap-3 group", className)}>
      <div className="relative transition-transform duration-300 group-hover:scale-110">
        <Image
          src="/images/yanyu-logo.png"
          alt="YanYu Cloud³"
          width={config.width}
          height={config.height}
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-bold text-blue-600", config.textSize)}>言语云³</span>
          <span className={cn("text-gray-600 text-xs", size === "sm" ? "hidden" : "block")}>YanYu Cloud</span>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="transition-opacity hover:opacity-80">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}
