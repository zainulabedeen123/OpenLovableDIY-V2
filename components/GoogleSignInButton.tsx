'use client';

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function GoogleSignInButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  if (status === "loading") {
    return (
      <button
        disabled
        className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-lg cursor-wait opacity-70"
      >
        <span className="text-white text-sm font-medium">Loading...</span>
      </button>
    );
  }

  if (session) {
    return (
      <button
        onClick={handleDashboard}
        className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-lg cursor-pointer hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105"
      >
        <span className="text-white text-sm font-medium">Dashboard</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-lg cursor-pointer hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105"
    >
      <span className="text-white text-sm font-medium">Sign in with Google</span>
    </button>
  );
}

