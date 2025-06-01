"use client"

import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { collection, getDocs, query, orderBy, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useTranslations } from "@/hooks/use-translations"
import type { BannerImage } from "@/lib/types"

const SECTION_HEIGHT = 1500

export const HeroImages = () => {
  const { t } = useTranslations()
  const [banners, setBanners] = useState<BannerImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const bannersQuery = query(collection(db, "banners"), orderBy("order"))
        const bannersSnapshot = await getDocs(bannersQuery)
        const bannersList = bannersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BannerImage[]
        setBanners(bannersList)
      } catch (error) {
        console.error("Error fetching banners:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  const centerBanner = banners.find(banner => banner.type === "center")
  const parallaxBanners = banners.filter(banner => banner.type === "parallax")

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-mainDarkBackgroundV1">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="bg-mainDarkBackgroundV1">
      <div
        style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
        className="relative w-full"
      >
        {centerBanner && <CenterImage imageUrl={centerBanner.imageUrl} />}
        {parallaxBanners.length > 0 && <ParallaxImages banners={parallaxBanners} />}

        {/* Quote Overlay */}
        <QuoteOverlay />

        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-zinc-950/0 to-mainDarkBackgroundV1" />
      </div>
    </div>
  )
}

const QuoteOverlay = () => {
  const { t } = useTranslations()
  const { scrollY } = useScroll()

  const opacity = 1
  const y = useTransform(scrollY, [0, 800], [0, -100])

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
      style={{ opacity, y }}
    >
      <div className="text-center px-4 max-w-4xl mx-auto">
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-white text-2xl md:text-4xl lg:text-5xl font-light leading-relaxed mb-6"
          style={{
            textShadow: "2px 2px 8px rgba(0,0,0,0.7), 0 0 20px rgba(0,0,0,0.5)"
          }}
        >
          "{t("heroQuote")}"
        </motion.blockquote>
        
        <motion.cite
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-white/90 text-lg md:text-xl font-medium not-italic"
          style={{
            textShadow: "1px 1px 4px rgba(0,0,0,0.7)"
          }}
        >
          — {t("heroQuoteAuthor")}
        </motion.cite>
      </div>
    </motion.div>
  )
}

const CenterImage = ({ imageUrl }: { imageUrl: string }) => {
  const { scrollY } = useScroll()

  const clip1 = useTransform(scrollY, [0, 1500], [25, 0])
  const clip2 = useTransform(scrollY, [0, 1500], [75, 100])

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`

  const backgroundSize = useTransform(
    scrollY,
    [0, SECTION_HEIGHT + 500],
    ["170%", "100%"]
  )
  const opacity = useTransform(
    scrollY,
    [SECTION_HEIGHT, SECTION_HEIGHT + 500],
    [1, 0]
  )

  return (
    <motion.div
      className="sticky top-0 h-screen w-full"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage: `url(${imageUrl})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  )
}

const getClassNameByOrder = (order: number) => {
  const classPatterns = [
    "w-full sm:w-2/3 md:w-1/3",                // First pattern
    "mx-auto w-full sm:w-2/3",                 // Second pattern
    "ml-auto w-full sm:w-2/3 md:w-1/3",       // Third pattern
    "ml-0 md:ml-24 w-full sm:w-7/12 md:w-5/12", // Fourth pattern
  ]

  const patternIndex = (order - 1) % classPatterns.length
  return classPatterns[patternIndex]
}

const ParallaxImages = ({ banners }: { banners: BannerImage[] }) => {
  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 pt-[100px] sm:pt-[150px] md:pt-[200px]">
      {banners.map((banner) => (
        <ParallaxImg
          key={banner.id}
          src={banner.imageUrl}
          alt={banner.title}
          start={banner.startScroll || -100}
          end={banner.endScroll || 100}
          className={getClassNameByOrder(banner.order)}
        />
      ))}
    </div>
  )
}

const ParallaxImg = ({ className, alt, src, start, end }: { className: string, alt: string, src: string, start: number, end: number }) => {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  })

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85])

  const y = useTransform(scrollYProgress, [0, 1], [start, end])
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`

  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      ref={ref}
      style={{ transform, opacity }}
    />
  )
}
