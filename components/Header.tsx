"use client";

import Image from "next/image";
import { useState } from "react";
import { AuthPopup } from "./AuthPopup";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
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
      <div className="fixed top-0 left-0 right-0 w-full flex justify-center px-4 pt-4 z-40">
        <nav className="backdrop-blur-xl bg-[#1E2022]/40 border border-[#C9D6DF]/15 rounded-xl max-w-6xl w-full hover:border-[#C9D6DF]/25 transition-all duration-300">
          <div className="px-4 py-3 lg:px-8 lg:py-4">
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

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <a
                  href="/events"
                  className="text-sm font-medium text-[#C9D6DF] hover:text-[#F0F5F9] transition-colors duration-300"
                >
                  Events
                </a>
                <a
                  href="#contact"
                  className="text-sm font-medium text-[#C9D6DF] hover:text-[#F0F5F9] transition-colors duration-300"
                >
                  Contact
                </a>
              </div>

              {/* Auth Buttons / User Menu */}
              <div className="flex items-center space-x-3">
                {user ? (
                  <>
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="hidden sm:block px-5 py-2 text-sm font-medium text-[#C9D6DF] border border-[#C9D6DF]/30 rounded-lg hover:bg-[#52616B]/20 hover:border-[#C9D6DF]/50 transition-all duration-300"
                    >
                      Dashboard
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => router.push("/admin")}
                        className="hidden sm:block px-5 py-2 text-sm font-medium text-[#C9D6DF] border border-[#C9D6DF]/30 rounded-lg hover:bg-[#52616B]/20 hover:border-[#C9D6DF]/50 transition-all duration-300"
                      >
                        Admin
                      </button>
                    )}
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg">
                      <span className="text-sm text-[#C9D6DF]">
                        {userProfile?.name || "User"}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-5 py-2 text-sm font-medium bg-[#C9D6DF] text-[#111111] rounded-lg hover:bg-[#F0F5F9] transition-all duration-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleAuthClick("signin")}
                      className="hidden cursor-pointer sm:block px-5 py-2 text-sm font-medium text-[#C9D6DF] border border-[#C9D6DF]/30 rounded-lg hover:bg-[#52616B]/20 hover:border-[#C9D6DF]/50 transition-all duration-300"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleAuthClick("signup")}
                      className="px-5 cursor-pointer py-2 text-sm font-medium bg-[#C9D6DF] text-[#111111] rounded-lg hover:bg-[#F0F5F9] transition-all duration-300"
                    >
                      Sign Up
                    </button>
                  </>
                )}

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#52616B]/20 transition-colors"
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
                        isOpen
                          ? "M6 18L18 6M6 6l12 12"
                          : "M4 6h16M4 12h16M4 18h16"
                      }
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
              <div className="md:hidden mt-4 pt-4 border-t border-[#C9D6DF]/10 space-y-3">
                <a
                  href="#events"
                  className="block text-sm font-medium text-[#C9D6DF] hover:text-[#F0F5F9] transition-colors py-2"
                >
                  Events
                </a>
                <a
                  href="#contact"
                  className="block text-sm font-medium text-[#C9D6DF] hover:text-[#F0F5F9] transition-colors py-2"
                >
                  Contact
                </a>
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        router.push("/dashboard");
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-2 text-sm font-medium text-[#C9D6DF] border border-[#C9D6DF]/30 rounded-lg hover:bg-[#52616B]/20 transition-all"
                    >
                      Dashboard
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          router.push("/admin");
                          setIsOpen(false);
                        }}
                        className="w-full px-4 py-2 text-sm font-medium text-[#C9D6DF] border border-[#C9D6DF]/30 rounded-lg hover:bg-[#52616B]/20 transition-all"
                      >
                        Admin
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-2 text-sm font-medium bg-[#C9D6DF] text-[#111111] rounded-lg hover:bg-[#F0F5F9] transition-all"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      handleAuthClick("signin");
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-[#C9D6DF] border border-[#C9D6DF]/30 rounded-lg hover:bg-[#52616B]/20 transition-all"
                  >
                    Sign In
                  </button>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Auth Popup */}
      <AuthPopup
        isOpen={showAuthPopup}
        onClose={() => setShowAuthPopup(false)}
        type={authPopupType}
      />
    </>
  );
}
