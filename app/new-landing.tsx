"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function NewLandingPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("1");
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
  const router = useRouter();

  const styles = [
    { id: "1", name: "Glassmorphism", icon: "✨", description: "Frosted glass effect" },
    { id: "2", name: "Neumorphism", icon: "🎨", description: "Soft 3D shadows" },
    { id: "3", name: "Brutalism", icon: "⚡", description: "Bold and raw" },
    { id: "4", name: "Minimalist", icon: "🎯", description: "Clean and simple" },
    { id: "5", name: "Dark Mode", icon: "🌙", description: "Dark theme design" },
    { id: "6", name: "Gradient Rich", icon: "🌈", description: "Vibrant gradients" },
    { id: "7", name: "3D Depth", icon: "📦", description: "Dimensional layers" },
    { id: "8", name: "Retro Wave", icon: "🌊", description: "80s inspired" },
  ];

  const selectedStyleData = styles.find(style => style.id === selectedStyle);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    
    // Store data in sessionStorage
    sessionStorage.setItem('projectDescription', prompt);
    sessionStorage.setItem('selectedStyle', selectedStyle);
    
    // Navigate to generation page
    router.push('/generation');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold text-white">
                OpenLovable
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-white/80 hover:text-white transition-colors">Community</a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">Pricing</a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">Enterprise</a>
              </nav>
            </div>
            <button className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-colors">
              My Lovable
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm mb-8 backdrop-blur-sm">
              <SparklesIcon className="w-4 h-4 mr-2" />
              Introducing Lovable x Shopify
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              OpenLovable
            </h1>
            
            <h2 className="text-3xl md:text-4xl text-purple-200 font-medium mb-8">
              Lovable for Everyone
            </h2>
            
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-16">
              Create amazing websites with the power of AI. Build, customize, and deploy your dream site in minutes.
            </p>
          </div>

          {/* Main Prompt Interface */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              {/* Style Selector */}
              <div className="mb-6">
                <label className="block text-white/90 text-sm font-medium mb-3 text-left">
                  Choose your style
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsStyleDropdownOpen(!isStyleDropdownOpen)}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-left text-white flex items-center justify-between hover:bg-white/20 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{selectedStyleData?.icon}</span>
                      <div>
                        <div className="font-medium">{selectedStyleData?.name}</div>
                        <div className="text-sm text-white/70">{selectedStyleData?.description}</div>
                      </div>
                    </div>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${isStyleDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isStyleDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl z-10 max-h-80 overflow-y-auto">
                      {styles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => {
                            setSelectedStyle(style.id);
                            setIsStyleDropdownOpen(false);
                          }}
                          className={`w-full px-6 py-4 text-left hover:bg-black/5 transition-colors flex items-center ${
                            selectedStyle === style.id ? 'bg-purple-100' : ''
                          }`}
                        >
                          <span className="text-xl mr-3">{style.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{style.name}</div>
                            <div className="text-sm text-gray-600">{style.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Prompt Input */}
              <div className="mb-6">
                <label className="block text-white/90 text-sm font-medium mb-3 text-left">
                  Describe your website
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask OpenLovable to create something amazing... (e.g., 'Create a modern portfolio website for a photographer with a dark theme and gallery showcase')"
                  className="w-full h-32 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!prompt.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-8 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Create My Website ✨
              </button>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-white/70">Generate complete websites in seconds with AI-powered design</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-white mb-2">Multiple Styles</h3>
              <p className="text-white/70">Choose from 8 unique design styles to match your vision</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-white mb-2">Deploy Ready</h3>
              <p className="text-white/70">Get production-ready code that you can deploy anywhere</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
