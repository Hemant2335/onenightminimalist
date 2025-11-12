"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthClick?: (type: "signin" | "signup") => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onAuthClick }) => {
  const router = useRouter();
  const { user, userProfile, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onClose();
    router.push("/");
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-[#1E2022] border-r border-[#C9D6DF]/20 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#C9D6DF]/10">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8">
                <Image
                  src="/Logo.png"
                  alt="EventHub Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-semibold text-[#F0F5F9]">EventHub</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#52616B]/20 transition-colors"
            >
              <svg
                className="w-5 h-5 text-[#C9D6DF]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6 space-y-2">
            {/* Main Navigation */}
            <div className="space-y-1">
              <button
                onClick={() => handleNavigation("/")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#C9D6DF] hover:bg-[#52616B]/20 rounded-lg transition-colors"
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Home
              </button>

              <button
                onClick={() => handleNavigation("/events")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#C9D6DF] hover:bg-[#52616B]/20 rounded-lg transition-colors"
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Events
              </button>

              <button
                onClick={() => handleNavigation("#contact")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#C9D6DF] hover:bg-[#52616B]/20 rounded-lg transition-colors"
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
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Contact
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-[#C9D6DF]/10 my-4"></div>

            {/* User Section */}
            {user ? (
              <div className="space-y-2">
                {/* User Profile */}
                <div className="flex items-center gap-3 px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-[#C9D6DF]/20 flex items-center justify-center border border-[#C9D6DF]/30">
                    <span className="text-sm font-semibold text-[#C9D6DF]">
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

                {/* Dashboard */}
                <button
                  onClick={() => handleNavigation("/dashboard")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#C9D6DF] hover:bg-[#52616B]/20 rounded-lg transition-colors"
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
                  Dashboard
                </button>

                {/* Admin Dashboard */}
                {isAdmin && (
                  <button
                    onClick={() => handleNavigation("/admin")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#1E2022] bg-[#C9D6DF]/90 border border-[#C9D6DF] rounded-lg hover:bg-[#C9D6DF] transition-colors"
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
                    Admin Dashboard
                  </button>
                )}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium bg-[#C9D6DF] text-[#1E2022] rounded-lg hover:bg-[#F0F5F9] transition-colors"
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
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onAuthClick?.("signin");
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#C9D6DF] border border-[#C9D6DF]/30 rounded-lg hover:bg-[#52616B]/20 transition-colors"
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
                  Sign In
                </button>

                <button
                  onClick={() => {
                    onAuthClick?.("signup");
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium bg-[#C9D6DF] text-[#1E2022] rounded-lg hover:bg-[#F0F5F9] transition-colors"
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
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};