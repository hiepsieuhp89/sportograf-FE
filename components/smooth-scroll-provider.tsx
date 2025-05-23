"use client"

import { useEffect } from "react"
import Lenis from "lenis"

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      infinite: false,
      autoResize: true,
      syncTouch: false,
      syncTouchLerp: 0.075,
      touchInertiaMultiplier: 35,
    })

    // Listen for scroll events
    lenis.on("scroll", (e) => {
      // You can add custom scroll event handling here
      // For example, updating CSS custom properties
      document.documentElement.style.setProperty("--scroll-progress", e.progress.toString())
    })

    // Optionally expose lenis to global scope for debugging
    if (typeof window !== "undefined") {
      ;(window as any).lenis = lenis
    }

    // Cleanup function
    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
} 