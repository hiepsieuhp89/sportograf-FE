import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroCarousel } from "@/components/home/hero-carousel"
import { SponsorSlider } from "@/components/sponsor-slider"
import { EventGrid } from "@/components/home/event-grid"
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider"
import "lenis/dist/lenis.css"
import { HeroImages } from "@/components/home/hero-images"

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main className="bg-mainBackgroundV1">
        <Header />
        <HeroCarousel />
        <HeroImages />
        <div className="max-w-7xl mx-auto px-16">
          <EventGrid />
        </div>
        <Footer />
      </main>
    </SmoothScrollProvider>
  )
}
