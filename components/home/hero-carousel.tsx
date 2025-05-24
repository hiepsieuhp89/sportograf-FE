"use client"

import { useEffect, useRef, useState } from "react"
import { useTranslations } from "@/hooks/use-translations"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"

// Video sources array
const videoSources = [
  "https://videos.pexels.com/video-files/4274798/4274798-uhd_2560_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/856132/856132-hd_1920_1080_30fps.mp4",
  "https://videos.pexels.com/video-files/4761711/4761711-uhd_2732_1440_25fps.mp4",
]

export function HeroCarousel() {
  const { t } = useTranslations()
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const previewVideoRef = useRef<HTMLVideoElement>(null)
  const parallaxSectionRef = useRef<HTMLDivElement>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showLens, setShowLens] = useState(false)
  const [lensSize, setLensSize] = useState(150)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    // Direct mouse tracking for better responsiveness
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
    }
    
    // Reduce delay for better responsiveness
    const timeout = setTimeout(() => {
      setShowLens(true)
    }, 100) // 100ms delay
    
    setHoverTimeout(timeout)
  }

  const handleMouseLeave = () => {
    // Clear timeout if user leaves before delay completes
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    
    // Immediately hide lens
    setShowLens(false)
  }

  const handleLensClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const nextIndex = (currentVideoIndex + 1) % videoSources.length
    console.log(`Switching video from ${currentVideoIndex} to ${nextIndex}`)
    setCurrentVideoIndex(nextIndex)
    
    // Add a subtle feedback effect
    setLensSize(prev => prev * 1.1)
    setTimeout(() => {
      setLensSize(150)
    }, 150)
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (showLens) {
      e.preventDefault()
      const delta = e.deltaY * -0.2
      setLensSize(prev => Math.min(Math.max(prev + delta, 150), 350))
    }
  }

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const { scrollYProgress: parallaxScrollProgress } = useScroll({
    target: parallaxSectionRef,
    offset: ["start end", "end start"],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 15])
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, -5])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const borderRadius = useTransform(scrollYProgress, [0, 1], [0, 24])

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const searchY = useTransform(scrollYProgress, [0, 1], [0, -30])
  
  // Fade out/in effects for text and input
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 0.3, 0.3, 1])
  const inputOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [1, 0.2, 0.2, 1])
  
  // 3D effects from left to right
  const titleRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -15, 0])
  const titleTranslateX = useTransform(scrollYProgress, [0, 0.5, 1], [0, -100, 0])
  const titleTranslateZ = useTransform(scrollYProgress, [0, 0.5, 1], [0, -50, 0])
  
  const inputRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -10, 0])
  const inputTranslateX = useTransform(scrollYProgress, [0, 0.5, 1], [0, -80, 0])
  const inputTranslateZ = useTransform(scrollYProgress, [0, 0.5, 1], [0, -30, 0])

  useEffect(() => {
    if (videoRef.current) {
      if (inView) {
        videoRef.current.play().catch((error) => {
          console.error("Video play failed:", error)
        })
      } else {
        videoRef.current.pause()
      }
    }
  }, [inView, currentVideoIndex])

  // Play preview video when lens is shown
  useEffect(() => {
    if (previewVideoRef.current && showLens) {
      previewVideoRef.current.play().catch(error => {
        console.error("Preview video play failed:", error)
      })
    }
  }, [showLens])

  // Get next video index for preview
  const previewVideoIndex = (currentVideoIndex + 1) % videoSources.length

  // Set up interval for lens pulse effect
  useEffect(() => {
    let pulseInterval: NodeJS.Timeout | null = null
    
    if (showLens) {
      pulseInterval = setInterval(() => {
        setLensSize(prev => {
          const variation = Math.sin(Date.now() / 800) * 5 // Slower, smaller pulse
          return 150 + variation
        })
      }, 100) // Less frequent updates
    }
    
    return () => {
      if (pulseInterval) clearInterval(pulseInterval)
    }
  }, [showLens])

  // Cleanup hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  return (
    <>
      <div
        ref={(el) => {
          containerRef.current = el
          inViewRef(el)
        }}
        className="relative h-screen overflow-hidden cursor-crosshair"
        style={{ perspective: "1000px" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      >
        <motion.div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            scale,
            rotateX,
            rotateY,
            opacity,
            translateY,
            borderRadius: useTransform(borderRadius, (value) => `${value}px`),
            transformOrigin: "center center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10"></div>
          <video 
            ref={videoRef} 
            key={currentVideoIndex} // Force re-render when video changes
            className="absolute inset-0 w-full h-full object-cover" 
            autoPlay 
            muted 
            loop 
            playsInline
            src={videoSources[currentVideoIndex]}
          >
            Your browser does not support the video tag.
          </video>
          
          {/* Lens/Mask Effect */}
          <AnimatePresence>
            {showLens && (
              <motion.div
                className="absolute z-50 rounded-sm overflow-hidden cursor-pointer"
                style={{
                  width: lensSize,
                  height: lensSize,
                  left: mousePosition.x - lensSize / 2,
                  top: mousePosition.y - lensSize / 2,
                  transformStyle: "preserve-3d",
                  perspective: "800px",
                  pointerEvents: "all"
                }}
                initial={{ 
                  scale: 0.5, 
                  opacity: 0, 
                  rotateZ: -10
                }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  rotateZ: 0
                }}
                exit={{ 
                  scale: 0.5, 
                  opacity: 0, 
                  rotateZ: 10
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 25,
                  duration: 0.4
                }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2 }
                }}
                whileTap={{
                  scale: 0.9,
                  transition: { duration: 0.1 }
                }}
                onClick={handleLensClick}
              >
                {/* Magnifying glass frame */}
                <div 
                  className="absolute inset-0 rounded-sm"
                  style={{ 
                    border: "2px solid #ffffff50",
                    background: "rgba(255,255,255,0.1)",
                    boxShadow: "0 0 0 2000px rgba(0,0,0,0.6), 0 0 20px rgba(255,255,255,0.3)"
                  }}
                />
                
                {/* Lens handle */}
                <div
                  className="absolute -bottom-4 -right-4 w-6 h-6 rounded-sm bg-white"
                  style={{
                    border: "2px solid #ffffff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                  }}
                />
                
                {/* Preview video */}
                <div 
                  className="w-full h-full rounded-sm overflow-hidden"
                >
                  <div className="w-full h-full rounded-sm overflow-hidden relative">
                    <video
                      ref={previewVideoRef}
                      key={previewVideoIndex}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      src={videoSources[previewVideoIndex]}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="relative z-20 max-w-7xl mx-auto px-8 h-full flex flex-col justify-center items-start">
          <motion.div className="mt-20" style={{ y: titleY }}>
            <motion.h1
              className="text-mainBackgroundV1 text-6xl font-[900] mb-8 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{ 
                fontFamily: "'Montserrat', sans-serif", 
                fontWeight: 900,
                opacity: textOpacity,
                rotateY: titleRotateY,
                x: titleTranslateX,
                z: titleTranslateZ,
                transformStyle: "preserve-3d",
                transformOrigin: "left center"
              }}
            >
              <span className="text-8xl">PHOTOGRAPHY</span>
              <br />
            <span className="text-mainActiveV1">FOR THE LOVE OF SPORT</span>
            </motion.h1>
            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              style={{ 
                y: searchY,
                opacity: inputOpacity,
                rotateY: inputRotateY,
                x: inputTranslateX,
                z: inputTranslateZ,
                transformStyle: "preserve-3d",
                transformOrigin: "left center"
              }}
            >
              <form className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for event"
                  className="w-full py-3 px-4 rounded-none border-0 focus:outline-none focus:ring-2 focus:ring-mainBackgroundV1 text-gray-700 placeholder-gray-500"
                />
              </form>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        >
          <div className="w-8 h-12 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-1.5 h-3 bg-white rounded-full animate-bounce"></div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
