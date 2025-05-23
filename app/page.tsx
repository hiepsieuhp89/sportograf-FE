import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroCarousel } from "@/components/hero-carousel"
import { SponsorSlider } from "@/components/sponsor-slider"
import { EventGrid } from "@/components/event-grid"
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider"
import "lenis/dist/lenis.css"

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main className="bg-white">
        <Header />
        <HeroCarousel />
        <SponsorSlider />
        <div className="max-w-[1200px] mx-auto px-4">
          <EventGrid />
        </div>
        <Footer />
      </main>
    </SmoothScrollProvider>
  )
}
