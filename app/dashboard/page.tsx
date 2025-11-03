'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import DatabaseManager from "@/components/DatabaseManager";
import { Toaster } from "sonner";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/');
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Toaster position="top-right" richColors />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0F1629]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 group cursor-pointer"
              onClick={() => router.push('/')}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
                <span className="text-white font-bold text-lg">🔥</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                OpenLovable
              </h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="flex items-center space-x-3">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-white text-sm font-medium">
                  {session.user?.name}
                </span>
              </div>

              {/* Sign Out Button */}
              <button 
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg cursor-pointer transition-all hover:scale-105"
              >
                <span className="text-white text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, {session.user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-300 text-lg">
              Ready to build something amazing?
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Projects Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📁</span>
                </div>
                <h3 className="text-xl font-semibold text-white">My Projects</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                View and manage all your projects
              </p>
              <div className="text-3xl font-bold text-white">0</div>
              <p className="text-gray-400 text-xs mt-1">Total projects</p>
            </div>

            {/* Templates Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-xl font-semibold text-white">Templates</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Browse available templates
              </p>
              <div className="text-3xl font-bold text-white">8</div>
              <p className="text-gray-400 text-xs mt-1">Available styles</p>
            </div>

            {/* Account Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h3 className="text-xl font-semibold text-white">Settings</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Manage your account settings
              </p>
              <p className="text-gray-400 text-xs">{session.user?.email}</p>
            </div>
          </div>

          {/* Database Manager Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Database Management</h2>
            <DatabaseManager />
          </div>

          {/* Quick Actions */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">✨</span>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Create New Project</h3>
                    <p className="text-gray-200 text-sm">Start building with AI</p>
                  </div>
                </div>
              </button>

              <button className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all hover:scale-105 text-left">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">📚</span>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Documentation</h3>
                    <p className="text-gray-300 text-sm">Learn how to use OpenLovable</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

