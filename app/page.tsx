"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, MicrophoneIcon, PaperClipIcon } from "@heroicons/react/24/outline";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("1");

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

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0F1629]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-3.5">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
                <span className="text-white font-bold text-lg">🔥</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                OpenLovable
              </h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-6">
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {/* Menu Button */}
                <button className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Settings Button */}
                <button className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM14 9a1 1 0 100 2h2a1 1 0 100-2h-2z" />
                  </svg>
                </button>

                {/* Signup Button */}
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-lg cursor-pointer hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105">
                  <span className="text-white text-sm font-medium">Signup</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-[300px] pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Announcement Badge */}
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-600/30 rounded-full text-sm text-gray-300">
              <span className="mr-2">Introducing Lovable x Shopify</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>

          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              Build something{" "}
              <span className="inline-flex items-center">
                <span className="mr-3">🔥</span>
                <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Lovable
                </span>
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Create apps and websites by chatting with AI
            </p>
          </div>

          {/* Chat Input */}
          <div className="w-full max-w-4xl">
            <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl">
              {/* Text Area */}
              <div className="px-6 pt-6 pb-4">
                <textarea
                  value={prompt}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Lovable to create a dashboard to..."
                  rows={2}
                  className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-base font-normal leading-relaxed resize-none min-h-[60px] max-h-[200px] overflow-hidden px-4"
                />
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-between px-6 pb-4">
                {/* Left Side Controls */}
                <div className="flex items-center space-x-3">
                  {/* Plus Button */}
                  <button className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200">
                    <span className="text-lg font-light">+</span>
                  </button>

                  {/* Attach Button */}
                  <button className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200">
                    <PaperClipIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Attach</span>
                  </button>

                  {/* Public Button */}
                  <button className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200">
                    <span className="text-sm">🌐</span>
                    <span className="text-sm font-medium">Public</span>
                  </button>
                </div>

                {/* Right Side Controls */}
                <div className="flex items-center space-x-3">
                  {/* Microphone Button */}
                  <button className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                      <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
                      <path d="M12 18v4"/>
                      <path d="M8 22h8"/>
                    </svg>
                  </button>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={!prompt.trim()}
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
                  >
                    <span className="text-white text-sm font-medium">Create</span>
                    <ArrowRightIcon className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
