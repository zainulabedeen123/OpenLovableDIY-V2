'use client';

import { signIn } from "next-auth/react";

export default function GoogleSignInButton() {
  const handleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <button 
      onClick={handleSignIn}
      className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-lg cursor-pointer hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105"
    >
      <span className="text-white text-sm font-medium">Sign in with Google</span>
    </button>
  );
}

