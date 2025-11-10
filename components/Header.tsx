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

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <a
                  href="/"
                  className="text-sm font-medium text-[#C9D6DF] hover:text-[#F0F5F9] transition-colors duration-300 relative group"
                >
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C9D6DF] group-hover:w-full transition-all duration-300"></span>
                </a>
                <a
                  href="/events"
                  className="text-sm font-medium text-[#C9D6DF] hover:text-[#F0F5F9] transition-colors duration-300 relative group"
                >
                  Events
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C9D6DF] group-hover:w-full transition-all duration-300"></span>
                </a>
                <a
                  href="#contact"
                  className="text-sm font-medium text-[#C9D6DF] hover:text-[#F0F5F9] transition-colors duration-300 relative group"
                >
                  Contact
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C9D6DF] group-hover:w-full transition-all duration-300"></span>
                </a>
              </div>

              {/* Auth Buttons / User Menu */}
              <div className="flex items-center gap-3">
                {user ? (
                  <>
                    {/* User Profile Display */}
                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#52616B]/30 border border-[#C9D6DF]/20 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-[#C9D6DF]/20 flex items-center justify-center border border-[#C9D6DF]/30">
                        <span className="text-sm font-semibold text-[#C9D6DF]">
                          {userProfile?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-[#C9D6DF]">
                        {userProfile?.name || "User"}
                      </span>
                    </div>

                    {/* Dashboard Button */}
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#C9D6DF] bg-[#52616B]/20 border border-[#C9D6DF]/30 rounded-lg hover:bg-[#52616B]/40 hover:border-[#C9D6DF]/50 transition-all duration-300"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                      <span>Dashboard</span>
                    </button>

                    {/* Admin Dashboard Button */}
                    {isAdmin && (
                      <button
                        onClick={() => router.push("/admin")}
                        className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1E2022] bg-[#C9D6DF]/90 border border-[#C9D6DF] rounded-lg hover:bg-[#C9D6DF] hover:shadow-lg transition-all duration-300"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#C9D6DF] text-[#1E2022] rounded-lg hover:bg-[#F0F5F9] hover:shadow-md transition-all duration-300"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleAuthClick("signin")}
                      className="hidden cursor-pointer sm:flex items-center gap-2 px-5 py-2 text-sm font-medium text-[#C9D6DF] border border-[#C9D6DF]/30 rounded-lg hover:bg-[#52616B]/20 hover:border-[#C9D6DF]/50 transition-all duration-300"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Sign In</span>
                    </button>
                    <button
                      onClick={() => handleAuthClick("signup")}
                      className="flex items-center gap-2 cursor-pointer px-5 py-2 text-sm font-medium bg-[#C9D6DF] text-[#1E2022] rounded-lg hover:bg-[#F0F5F9] hover:shadow-md transition-all duration-300"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      <span>Sign Up</span>
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
                {/* Mobile Navigation Links */}
                <a
                  href="/events"
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
                    {/* Mobile User Profile */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-[#52616B]/30 border border-[#C9D6DF]/20 rounded-lg mt-2">
                      <div className="w-10 h-10 rounded-full bg-[#C9D6DF]/20 flex items-center justify-center border border-[#C9D6DF]/30">
                        <span className="text-base font-semibold text-[#C9D6DF]">
                          {userProfile?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#C9D6DF]">
                          {userProfile?.name || "User"}
                        </span>
                        <span className="text-xs text-[#C9D6DF]/60">
                          {userProfile?.email || ""}
                        </span>
                      </div>
                    </div>

                    {/* Mobile Dashboard Button */}
                    <button
                      onClick={() => {
                        router.push("/dashboard");
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#C9D6DF] bg-[#52616B]/20 border border-[#C9D6DF]/30 rounded-lg hover:bg-[#52616B]/40 transition-all"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                      <span>Dashboard</span>
                    </button>

                    {/* Mobile Admin Dashboard Button */}
                    {isAdmin && (
                      <button
                        onClick={() => {
                          router.push("/admin");
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#1E2022] bg-[#C9D6DF]/90 border border-[#C9D6DF] rounded-lg hover:bg-[#C9D6DF] transition-all"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    {/* Mobile Logout Button */}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium bg-[#C9D6DF] text-[#1E2022] rounded-lg hover:bg-[#F0F5F9] transition-all"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        handleAuthClick("signin");
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#C9D6DF] border border-[#C9D6DF]/30 rounded-lg hover:bg-[#52616B]/20 transition-all"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Sign In</span>
                    </button>
                    <button
                      onClick={() => {
                        handleAuthClick("signup");
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium bg-[#C9D6DF] text-[#1E2022] rounded-lg hover:bg-[#F0F5F9] transition-all"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      <span>Sign Up</span>
                    </button>
                  </>
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
