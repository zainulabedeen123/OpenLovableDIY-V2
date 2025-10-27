"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { appConfig } from '@/config/app.config';
import { toast } from "sonner";

// Import shared components
import { Connector } from "@/components/shared/layout/curvy-rect";
import HeroFlame from "@/components/shared/effects/flame/hero-flame";
import AsciiExplosion from "@/components/shared/effects/flame/ascii-explosion";
import { HeaderProvider } from "@/components/shared/header/HeaderContext";

// Import hero section components
import HomeHeroBackground from "@/components/app/(home)/sections/hero/Background/Background";
import { BackgroundOuterPiece } from "@/components/app/(home)/sections/hero/Background/BackgroundOuterPiece";
import HomeHeroBadge from "@/components/app/(home)/sections/hero/Badge/Badge";
import HomeHeroPixi from "@/components/app/(home)/sections/hero/Pixi/Pixi";
import HomeHeroTitle from "@/components/app/(home)/sections/hero/Title/Title";
import HeroInputSubmitButton from "@/components/app/(home)/sections/hero-input/Button/Button";
// import Globe from "@/components/app/(home)/sections/hero-input/_svg/Globe";

// Import header components
import HeaderBrandKit from "@/components/shared/header/BrandKit/BrandKit";
import HeaderWrapper from "@/components/shared/header/Wrapper/Wrapper";
import HeaderDropdownWrapper from "@/components/shared/header/Dropdown/Wrapper/Wrapper";
import GithubIcon from "@/components/shared/header/Github/_svg/GithubIcon";
import ButtonUI from "@/components/ui/shadcn/button"

interface SearchResult {
  url: string;
  title: string;
  description: string;
  screenshot: string | null;
  markdown: string;
}

export default function HomePage() {
  const [url, setUrl] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("1");
  const [selectedModel, setSelectedModel] = useState<string>(appConfig.ai.defaultModel);
  const router = useRouter();

  const styles = [
    { id: "1", name: "Glassmorphism", icon: "✨" },
    { id: "2", name: "Neumorphism", icon: "🎨" },
    { id: "3", name: "Brutalism", icon: "⚡" },
    { id: "4", name: "Minimalist", icon: "🎯" },
    { id: "5", name: "Dark Mode", icon: "🌙" },
    { id: "6", name: "Gradient Rich", icon: "🌈" },
    { id: "7", name: "3D Depth", icon: "📦" },
    { id: "8", name: "Retro Wave", icon: "🌊" },
  ];

  const models = appConfig.ai.availableModels.map(model => ({
    id: model,
    name: appConfig.ai.modelDisplayNames[model] || model,
  }));

  const handleSubmit = async () => {
    const inputValue = url.trim();

    if (!inputValue) {
      toast.error("Please describe what you want to build");
      return;
    }

    sessionStorage.setItem('projectDescription', inputValue);
    sessionStorage.setItem('selectedStyle', selectedStyle);
    sessionStorage.setItem('selectedModel', selectedModel);
    sessionStorage.setItem('autoStart', 'true');

    router.push('/generation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#2d4a7c] to-[#e67e9f]">
      {/* Header */}
      <header className="relative z-10 px-6 py-5 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-gradient-to-br from-[#ff6b6b] to-[#ff4757] rounded-lg">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-white">OpenLovable</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm">
              <a href="#" className="text-gray-300 hover:text-white transition-colors font-medium">Community</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors font-medium">Pricing</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors font-medium">Enterprise</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <a
              href="https://github.com/zainulabedeen123/OpenLovableDIY-V2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#ff3366] to-[#ff4477] text-white rounded-xl hover:from-[#ff4477] hover:to-[#ff5588] transition-all text-sm font-semibold shadow-lg"
            >
              <span className="w-5 h-5 bg-white/20 rounded-md flex items-center justify-center text-xs font-bold">M</span>
              My Lovable
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="max-w-5xl mx-auto text-center w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-10 border border-white/20">
            <span>Introducing Lovable x Shopify</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-center">
            <span className="inline-flex items-center gap-2">
              <svg className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-[#ff6b6b]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
              OpenLovable
            </span>
            <br />
            <span className="text-3xl md:text-4xl lg:text-5xl text-white/90 font-medium">
              Lovable for Everyone
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 mb-16">
            Create apps and websites by chatting with AI
          </p>

          {/* Input Card */}
          <div className="relative bg-gradient-to-br from-[#2a2a2a] to-[#252525] rounded-3xl p-4 border border-white/20 shadow-2xl max-w-5xl mx-auto backdrop-blur-sm">
            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#ff6b6b]/20 via-transparent to-[#4ecdc4]/20 p-[1px]">
              <div className="w-full h-full rounded-3xl bg-gradient-to-br from-[#2a2a2a] to-[#252525]"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder="Ask OpenLovable to create something amazing..."
                  className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-xl py-10 px-6 font-medium"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!url.trim()}
                  className="p-6 bg-gradient-to-r from-[#ff6b6b] via-[#ff5252] to-[#ff4757] text-white rounded-2xl hover:from-[#ff5252] hover:via-[#ff3838] hover:to-[#ff3838] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-[0_20px_40px_rgba(255,107,107,0.4)] transform hover:scale-105 active:scale-95 border border-white/10"
                >
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
