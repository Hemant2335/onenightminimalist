"use client";

import Image from "next/image";
import { useState } from "react";
import { AuthPopup } from "./AuthPopup";
import { Sidebar } from "./Sidebar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authPopupType, setAuthPopupType] = useState<"signin" | "signup">(
    "signin"
  );
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const router = useRouter();
  const { user, userProfile, isAdmin, logout } = useAuth();

  const handleAuthClick = (type: "signin" | "signup") => {
    setAuthPopupType(type);
    setShowAuthPopup(true);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 w-full flex justify-center px-4 py-4 z-40">
        <nav className="backdrop-blur-xl bg-[#1E2022]/60 border border-[#C9D6DF]/20 rounded-xl max-w-6xl w-full hover:border-[#C9D6DF]/30 transition-all duration-300 shadow-xl shadow-black/20">
          <div className="px-4 py-2 lg:px-6 lg:py-2.5">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div
                  className="w-20 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => router.push("/")}
                >
                  <Image
                    src="/Logo.png"
                    alt="EventHub Logo"
                    width={200}
                    height={70}
                    className="object-contain"
                  />
                </div>
              </div>


              {/* Hamburger Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#52616B]/20 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-[#C9D6DF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      sidebarOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>

          </div>
        </nav>
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onAuthClick={handleAuthClick}
      />

      {/* Auth Popup */}
      <AuthPopup
        isOpen={showAuthPopup}
        onClose={() => setShowAuthPopup(false)}
        type={authPopupType}
      />
    </>
  );
}
