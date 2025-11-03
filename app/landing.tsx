"use client";

// useState not currently used but kept for future interactivity
import Link from "next/link";

// Import shared components
import { HeaderProvider } from "@/components/shared/header/HeaderContext";
// import HeaderBrandKit from "@/components/shared/header/BrandKit/BrandKit"; // Not used in current implementation
import HeaderWrapper from "@/components/shared/header/Wrapper/Wrapper";
import HeaderDropdownWrapper from "@/components/shared/header/Dropdown/Wrapper/Wrapper";
import ButtonUI from "@/components/ui/shadcn/button";

// Import hero section components
import HomeHeroBackground from "@/components/app/(home)/sections/hero/Background/Background";
import { BackgroundOuterPiece } from "@/components/app/(home)/sections/hero/Background/BackgroundOuterPiece";
import HomeHeroBadge from "@/components/app/(home)/sections/hero/Badge/Badge";
import HomeHeroPixi from "@/components/app/(home)/sections/hero/Pixi/Pixi";
import HomeHeroTitle from "@/components/app/(home)/sections/hero/Title/Title";
import HeroInput from "@/components/app/(home)/sections/hero-input/HeroInput";
import { Connector } from "@/components/shared/layout/curvy-rect";
import HeroFlame from "@/components/shared/effects/flame/hero-flame";
import FirecrawlIcon from "@/components/FirecrawlIcon";
import FirecrawlLogo from "@/components/FirecrawlLogo";

export default function LandingPage() {
  return (
    <HeaderProvider>
      <div className="min-h-screen bg-background-base">
        {/* Header/Navigation Section */}
        <HeaderDropdownWrapper />

        <div className="fixed top-0 left-0 w-full z-[101] bg-transparent header">
          <HeaderWrapper>
            <div className="max-w-[900px] mx-auto w-full flex justify-between items-center">
              <div className="flex gap-6 items-center">
                <Link href="/" className="flex items-center gap-2 text-white">
                  <FirecrawlIcon className="w-7 h-7 text-white" />
                  <span className="text-white font-semibold text-lg">OpenLovable</span>
                </Link>
                <nav className="flex gap-6 ml-8">
                  <Link href="#" className="text-white hover:text-white/80 transition-colors">
                    Community
                  </Link>
                  <Link href="#" className="text-white hover:text-white/80 transition-colors">
                    Pricing
                  </Link>
                  <Link href="#" className="text-white hover:text-white/80 transition-colors">
                    Enterprise
                  </Link>
                </nav>
              </div>

              <div className="flex gap-8">
                <Link
                  href="https://github.com/mendableai/open-lovable"
                  target="_blank"
                  className="contents"
                >
                  <button className="px-6 py-2 border border-white text-white rounded-full hover:bg-white/10 transition-colors">
                    My Lovable
                  </button>
                </Link>
              </div>
            </div>
          </HeaderWrapper>
        </div>

        {/* Hero Section */}
        <section className="overflow-x-clip" id="home-hero">
          <div className="pt-28 lg:pt-254 lg:-mt-100 pb-115 relative" id="hero-content">
            <HomeHeroPixi />
            <HeroFlame />
            <BackgroundOuterPiece />
            <HomeHeroBackground />

            <div className="relative container px-16">
              <HomeHeroBadge />
              <HomeHeroTitle />

              <p className="text-center text-white/80 text-lg max-w-2xl mx-auto mb-12">
                Create amazing websites with the power of AI. Build, customize, and deploy your dream site in minutes.
              </p>

              {/* Hero Input */}
              <div className="mt-24">
                <HeroInput />
              </div>
            </div>
          </div>
        </section>
      </div>
    </HeaderProvider>
  );
}