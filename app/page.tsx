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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">🔥</span>
            </div>
            <span className="text-2xl font-bold text-white">Open Lovable <span className="text-orange-400">DIY</span></span>
          </div>
          <a
            href="https://github.com/zainulabedeen123/OpenLovableDIY-V2"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all border border-white/20"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Source Code
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-2xl">✨</span>
              <span className="text-white/90 text-sm font-medium">AI-Powered Website Builder</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-center mb-6">
            <span className="text-white">Open Lovable </span>
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-transparent bg-clip-text">DIY</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-center text-white/80 mb-4 max-w-3xl mx-auto">
            Build any website with AI, in seconds.
          </p>
          <p className="text-center text-white/60 mb-16 max-w-2xl mx-auto">
            Describe your vision, choose a style, and watch as AI creates a fully functional React application with modern design and clean code.
          </p>

          {/* Input Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              {/* Main Input */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">💡</div>
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
                    placeholder="Describe the website you want to build..."
                    className="w-full pl-14 pr-4 py-5 bg-white/90 rounded-2xl text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!url.trim()}
                  className="px-8 py-5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  Generate →
                </button>
              </div>

              {/* Style Selector */}
              {url.trim() && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-4 gap-3">
                    {styles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`p-4 rounded-xl transition-all ${
                          selectedStyle === style.id
                            ? 'bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-lg scale-105'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <div className="text-2xl mb-1">{style.icon}</div>
                        <div className="text-xs font-medium">{style.name}</div>
                      </button>
                    ))}
                  </div>

                  {/* Model & Instructions */}
                  <div className="flex gap-3">
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="px-4 py-3 bg-white/90 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                    >
                      {models.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Additional instructions (optional)"
                      onChange={(e) => sessionStorage.setItem('additionalInstructions', e.target.value)}
                      className="flex-1 px-4 py-3 bg-white/90 rounded-xl text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">
            Why Choose Open Lovable DIY?
          </h2>
          <p className="text-center text-white/60 mb-16 max-w-2xl mx-auto text-lg">
            Experience the future of web development with our AI-powered platform
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
              <p className="text-white/70">
                Generate complete React applications in seconds. No more hours of setup and configuration.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-white mb-3">Multiple Styles</h3>
              <p className="text-white/70">
                Choose from 8 modern design styles including Glassmorphism, Neumorphism, and more.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-semibold text-white mb-3">Clean Code</h3>
              <p className="text-white/70">
                Production-ready React code with Tailwind CSS, proper component structure, and best practices.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
              <div className="text-4xl mb-4">👁️</div>
              <h3 className="text-xl font-semibold text-white mb-3">Live Preview</h3>
              <p className="text-white/70">
                See your website come to life in real-time with our integrated StackBlitz preview.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Chat</h3>
              <p className="text-white/70">
                Refine your website through natural conversation. Ask for changes and watch them happen.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
              <div className="text-4xl mb-4">📥</div>
              <h3 className="text-xl font-semibold text-white mb-3">Download & Deploy</h3>
              <p className="text-white/70">
                Export your project as a ZIP file and deploy anywhere. Full ownership of your code.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join developers who are building faster with AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
              >
                Start Building Now →
              </a>
              <a
                href="https://github.com/zainulabedeen123/OpenLovableDIY-V2"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/30"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/60">
            Built with ❤️ by the Open Source Community
          </p>
          <p className="text-white/40 text-sm mt-2">
            Powered by AI • React • Tailwind CSS • StackBlitz
          </p>
        </div>
      </footer>
    </div>
  );
}
