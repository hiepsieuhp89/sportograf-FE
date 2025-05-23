"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslations } from "@/hooks/use-translations"
import { SearchBar } from "./search-bar"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"

const sliderImages = [
  "https://www.sportograf.com/diverse/slider/11.jpg",
  "https://www.sportograf.com/diverse/slider/0.jpg",
  "https://www.sportograf.com/diverse/slider/1.jpg",
  "https://www.sportograf.com/diverse/slider/2.jpg",
  "https://www.sportograf.com/diverse/slider/3.jpg",
  "https://www.sportograf.com/diverse/slider/4.jpg",
  "https://www.sportograf.com/diverse/slider/5.jpg",
  "https://www.sportograf.com/diverse/slider/6.jpg",
  "https://www.sportograf.com/diverse/slider/7.jpg",
  "https://www.sportograf.com/diverse/slider/8.jpg",
  "https://www.sportograf.com/diverse/slider/9.jpg",
  "https://www.sportograf.com/diverse/slider/10.jpg",
]

export function HeroCarousel() {
  const { t } = useTranslations()
  const [currentSlide, setCurrentSlide] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  // Scroll animation setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Transform values based on scroll for video section
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 15])
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, -5])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -100])

  // Parallax effect for text
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const searchY = useTransform(scrollYProgress, [0, 1], [0, -30])

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Play/pause video based on visibility
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
  }, [inView])

  return (
    <>
      {/* Video Hero Section */}
      <div
        ref={(el) => {
          // Combine refs
          containerRef.current = el
          inViewRef(el)
        }}
        className="relative h-[600px] overflow-hidden perspective-1000"
      >
        {/* Video Background with Mask */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            scale,
            rotateX,
            rotateY,
            opacity,
            translateY,
            transformOrigin: "center center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10"></div>
          <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline>
            <source
              src="https://videos.pexels.com/video-files/4274798/4274798-uhd_2560_1440_25fps.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </motion.div>

        {/* Content */}
        <div className="relative z-20 max-w-[1200px] mx-auto px-4 h-full flex flex-col justify-center items-start">
          <motion.div className="mt-20" style={{ y: titleY }}>
            <motion.h1
              className="text-white text-6xl md:text-7xl font-[900] mb-8 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}
            >
              PHOTOGRAPHY
              <br />
              FOR THE LOVE OF SPORT
            </motion.h1>

            <motion.div
              className="w-full max-w-md"
              style={{ y: searchY }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <SearchBar />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
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

      {/* Parallax Slider Images Section */}
      <div className="relative h-[300px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${sliderImages[currentSlide]})`,
                y: useTransform(scrollYProgress, [0, 1], [0, 50]),
              }}
            />
            {/* Overlay for better readability */}
            <div className="absolute inset-0 bg-black/30"></div>
          </motion.div>
        </AnimatePresence>
        
        {/* Optional content for slider section */}
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">
              Capturing Sports Moments
            </h2>
            <p className="text-white/80 text-lg max-w-2xl">
              Professional sports photography that captures the intensity, emotion, and beauty of athletic competition.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
