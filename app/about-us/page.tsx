"use client"

import { StaticPageLayout } from "@/components/static-page-layout"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useState, useEffect } from "react"
import { useTranslations } from "@/hooks/use-translations"

// Loading skeleton component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-300 rounded ${className}`} />
)

// Counter animation component
const CountUpAnimation = ({ end, suffix = "" }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView) {
      let start = 0
      const duration = 2000
      const increment = end / (duration / 16)
      
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [inView, end])

  return (
    <div ref={ref} className="text-4xl md:text-6xl font-bold text-mainActiveV1 mb-2">
      {count}{suffix}
    </div>
  )
}

// Image component with loading state
const ImageWithSkeleton = ({ src, alt, className, width, height }: {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && !hasError && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <Image
        src={hasError ? "/placeholder.svg?height=400&width=600" : src}
        alt={alt}
        width={width || 600}
        height={height || 400}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
      />
    </div>
  )
}

export default function AboutUsPage() {
  const { scrollYProgress } = useScroll()
  const { t } = useTranslations()
  
  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100])
  const historyY = useTransform(scrollYProgress, [0.2, 0.6], [100, -50])
  const numbersY = useTransform(scrollYProgress, [0.4, 0.8], [50, -100])

  return (
    <StaticPageLayout>
      <div className="min-h-screen bg-mainBackgroundV1">
        <motion.section 
          className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-mainDarkBackgroundV1 via-gray-900 to-mainDarkBackgroundV1 overflow-hidden"
          style={{ 
            y: heroY, 
            backgroundImage: "url('https://www.sportograf.com/c5288368a5230954e964c4c9450e2ca1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <motion.div
            className="relative z-10 max-w-4xl mx-auto px-6 text-center"
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-6xl font-bold text-mainBackgroundV1 mb-6 lg:mb-8 leading-tight"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {t("aboutSportograf")}
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl lg:text-2xl text-mainBackgroundV1/90 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {t("aboutSportografDescription")}
            </motion.p>
          </motion.div>
          
          {/* Animated background elements */}
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-mainActiveV1/20 rounded-full blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-24 h-24 bg-mainSecondaryActiveV1/20 rounded-full blur-xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.section>

        {/* History Section */}
        <motion.section 
          className="min-h-[370px] py-20 pt-0"
          style={{ y: historyY }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -100, rotateY: -15 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
                className="perspective-1000"
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 10,
                    rotateX: 5,
                    z: 50
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="transform-gpu"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <ImageWithSkeleton
                    src="https://www.sportograf.com/63b7c7e52781f2baed03aafcbd613353.jpg"
                    alt="Sportograf founders"
                    className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
                    width={600}
                    height={400}
                  />
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 100, rotateY: 15 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="perspective-1000"
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.02,
                    rotateY: -5,
                    z: 30
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="border-mainBackgroundV1/20"
                >
                  <h2 className="text-3xl font-bold text-mainDarkBackgroundV1 mb-6">{t("ourStory")}</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {t("ourStoryDescription")}
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Numbers Section */}
        <motion.section 
          className="min-h-[370px] py-20 bg-gradient-to-br from-mainDarkBackgroundV1 to-gray-900 relative overflow-hidden"
          style={{ y: numbersY }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-mainActiveV1/5 to-mainSecondaryActiveV1/5" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            {/* Stats Grid */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12 lg:mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                { number: 550, label: t("eventsWorldwide") },
                { number: 500, label: t("freelancePhotographers") },
                { number: 10, label: t("photographedAthletes"), suffix: " mio." },
                { number: 50, label: t("imagesPerYear"), suffix: " mio." }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center h-32 relative"
                  initial={{ opacity: 0, y: 30, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotateY: 10,
                    z: 50
                  }}
                  viewport={{ once: true }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Image src="/nhanh-cay.svg" alt="Logo" width={1000} height={1000} className="w-full absolute bottom-0 z-10" quality={100} draggable={false} />
                 <div className="absolute z-20 w-full">
                 <CountUpAnimation end={stat.number} suffix={stat.suffix || ""} />
                  <div className="text-mainBackgroundV1 text-sm md:text-base font-medium">
                    {stat.label}
                  </div>
                 </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Description Text */}
            <motion.div
              className="max-w-4xl mx-auto text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.p 
                className="text-lg md:text-2xl text-mainBackgroundV1 leading-relaxed"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {t("aboutUsCommitment")}
              </motion.p>
            </motion.div>

            {/* Image Grid */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              {[
                "https://www.sportograf.com/5e9234b25308ec9e9031062a7c66fefc.jpg",
                "https://www.sportograf.com/1bca915d3f55da73ef92d01e2c684058.jpg",
                "https://www.sportograf.com/7c967f820cc692a7470bededad1fc630.jpg",
                "https://www.sportograf.com/6e19a1327457dedc7eb3280995dd5187.jpg",
                "https://www.sportograf.com/2efaa7cefecac519996c3c25cb73c42d.jpg",
                "https://www.sportograf.com/f55e9bd8fcf9ddf780751ec5fb88231c.jpg",
                "https://www.sportograf.com/f7aac68f5fd8b7d684a907348424cbe9.jpg",
                "https://www.sportograf.com/e036dfbccb96be91a08369fbcfeb4cda.jpg"
              ].map((src, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotateY: 10,
                    rotateX: 5,
                    z: 50
                  }}
                  viewport={{ once: true }}
                  className="perspective-1000"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <ImageWithSkeleton
                    src={src}
                    alt={`Sports photography ${index + 1}`}
                    className="rounded-sm shadow-lg w-full h-32 md:h-40 object-cover"
                    width={200}
                    height={160}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Floating elements */}
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 bg-mainActiveV1/10 rounded-full blur-xl"
            animate={{ 
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-16 h-16 bg-mainSecondaryActiveV1/10 rounded-full blur-xl"
            animate={{ 
              y: [0, 20, 0],
              scale: [1.1, 1, 1.1],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.section>

        {/* Additional Features Section */}
        <motion.section className="py-20 px-6 bg-mainBackgroundV1 pt-0">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center text-mainDarkBackgroundV1 mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {t("whatMakesUsDifferent")}
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  title: t("professionalQuality"),
                  description: t("professionalQualityDescription"),
                  icon: "📸"
                },
                {
                  title: t("completeCoverage"),
                  description: t("completeCoverageDescription"),
                  icon: "🎯"
                },
                {
                  title: t("advancedTechnology"),
                  description: t("advancedTechnologyDescription"),
                  icon: "🤖"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-xl border border-mainBackgroundV1/20"
                  initial={{ opacity: 0, y: 50, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    z: 30
                  }}
                  viewport={{ once: true }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-mainDarkBackgroundV1 mb-4">{feature.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </StaticPageLayout>
  )
}
