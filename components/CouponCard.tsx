"use client";

import React, { useState } from "react";
import ScratchCard from "./ScratchCard";
import { eventsAPI } from "@/lib/api";

interface Coupon {
  id: string;
  title: string;
  description?: string;
  code?: string;
  discount?: number;
  image_url?: string;
  valid_from?: string;
  valid_until?: string;
  terms?: string;
  created_at: string;
  is_redeemed?: boolean;
  redeemed_at?: string;
}

interface CouponCardProps {
  coupon: Coupon;
  eventName?: string;
}

const CouponCard: React.FC<CouponCardProps> = ({ coupon, eventName }) => {
  const [isRevealed, setIsRevealed] = useState(coupon.is_redeemed || false);
  const [isScratched, setIsScratched] = useState(coupon.is_redeemed || false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isAddingToWallet, setIsAddingToWallet] = useState(false);
  const [error, setError] = useState("");

  const handleReveal = () => {
    if (!coupon.is_redeemed) {
      setIsRevealed(true);
      setIsScratched(true);
    }
  };

  const handleRedeem = async () => {
    if (coupon.is_redeemed) {
      setError("This coupon has already been redeemed");
      return;
    }

    if (!coupon.code) {
      setError("Coupon code not available");
      return;
    }

    try {
      setIsRedeeming(true);
      setError("");
      await eventsAPI.redeemCoupon(coupon.id);
      setIsRevealed(true);
      setIsScratched(true);
      // Update coupon status
      (coupon as any).is_redeemed = true;
      (coupon as any).redeemed_at = new Date().toISOString();
    } catch (err: any) {
      setError(err.message || "Failed to redeem coupon");
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleAddToWallet = async (walletType: "apple" | "google") => {
    if (!coupon.code) {
      setError("Coupon code not available yet");
      return;
    }

    try {
      setIsAddingToWallet(true);
      setError("");

      // Get wallet pass data from backend
      const response = await eventsAPI.getWalletPass(coupon.id);

      if (response.success && response.walletPass) {
        const walletData = response.walletPass[walletType];

        if (walletType === "apple") {
          // Try Apple Wallet deep link first
          const appleWalletUrl = walletData.url;

          // Check if on iOS device
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

          if (isIOS) {
            // Try to open Apple Wallet app
            window.location.href = appleWalletUrl;
          } else {
            // For non-iOS, show instructions or use alternative method
            // You can also generate a .pkpass file download
            window.open(appleWalletUrl, "_blank");
          }
        } else if (walletType === "google") {
          // Google Wallet share URL (AddToWallet share URL works for both)
          const googleWalletUrl = walletData.url;
          window.open(googleWalletUrl, "_blank");
        }
      } else {
        setError("Failed to generate wallet pass. Please try again later.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to add to wallet");
    } finally {
      setIsAddingToWallet(false);
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Google Pay Style Coupon Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E2022] to-[#52616B]/30 border border-[#C9D6DF]/20 shadow-xl">
        {/* Header with Image or Gradient */}
        <div className="relative h-32 bg-gradient-to-r from-[#C9D6DF]/20 to-[#52616B]/20">
          {coupon.image_url ? (
            <img
              src={coupon.image_url}
              alt={coupon.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-4xl">🎟️</div>
            </div>
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E2022]/80 to-transparent" />

          {/* Title on header */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-[#F0F5F9] mb-1">
              {coupon.title}
            </h3>
            {eventName && (
              <p className="text-xs text-[#C9D6DF]/70">{eventName}</p>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 bg-[#1E2022]">
          {/* Description */}
          {coupon.description && (
            <p className="text-[#C9D6DF]/80 text-sm mb-4 leading-relaxed">
              {coupon.description}
            </p>
          )}

          {/* Scratch Card Section */}
          <div className="mb-4">
            <ScratchCard
              width={280}
              height={120}
              scratchColor="#52616B"
              onReveal={handleReveal}
            >
              <div className="p-4 bg-gradient-to-br from-[#52616B]/30 to-[#1E2022] border border-[#C9D6DF]/20 rounded-lg h-full flex flex-col justify-center items-center">
                {coupon.discount && (
                  <div className="text-center mb-2">
                    <p className="text-xs text-[#C9D6DF]/60 mb-1">Discount</p>
                    <p className="text-3xl font-bold text-[#C9D6DF]">
                      {coupon.discount}%
                    </p>
                  </div>
                )}
                {coupon.code && (
                  <div className="text-center">
                    <p className="text-xs text-[#C9D6DF]/60 mb-1">
                      Your Coupon Code
                    </p>
                    <p className="text-lg font-mono font-bold text-[#C9D6DF] tracking-wider">
                      {isRevealed ? coupon.code : "****"}
                    </p>
                  </div>
                )}
                {!coupon.code && !coupon.discount && (
                  <p className="text-[#C9D6DF] text-sm text-center">
                    Special Offer!
                  </p>
                )}
              </div>
            </ScratchCard>
            {!isScratched && coupon.code && (
              <p className="text-xs text-[#C9D6DF]/50 text-center mt-2">
                👆 Scratch to reveal your code
              </p>
            )}
            {coupon.is_redeemed && (
              <div className="mt-2 p-2 bg-green-500/20 border border-green-500/30 rounded text-center">
                <p className="text-xs text-green-400 font-semibold">
                  ✓ Redeemed{" "}
                  {coupon.redeemed_at
                    ? new Date(coupon.redeemed_at).toLocaleDateString()
                    : ""}
                </p>
              </div>
            )}
          </div>

          {/* Validity Dates */}
          {(coupon.valid_from || coupon.valid_until) && (
            <div className="mb-4 p-3 bg-[#52616B]/10 rounded-lg border border-[#C9D6DF]/10">
              <div className="flex items-center gap-2 text-xs text-[#C9D6DF]/70">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {coupon.valid_from && coupon.valid_until && (
                  <span>
                    Valid: {new Date(coupon.valid_from).toLocaleDateString()} -{" "}
                    {new Date(coupon.valid_until).toLocaleDateString()}
                  </span>
                )}
                {coupon.valid_until && !coupon.valid_from && (
                  <span>
                    Valid until:{" "}
                    {new Date(coupon.valid_until).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Terms */}
          {coupon.terms && (
            <div className="mb-4">
              <p className="text-xs text-[#C9D6DF]/60 mb-1 font-semibold">
                Terms & Conditions:
              </p>
              <p className="text-xs text-[#C9D6DF]/50 leading-relaxed">
                {coupon.terms}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          {/* Redeem Button */}
          {!coupon.is_redeemed && coupon.code && (
            <button
              onClick={handleRedeem}
              // disabled={isRedeeming || !isRevealed}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            >
              {isRedeeming ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Redeeming...
                </>
              ) : (
                <>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {isRevealed ? "Redeem Coupon" : "Reveal Code to Redeem"}
                </>
              )}
            </button>
          )}

          {/* Add to Wallet Section - Show when coupon exists (no need to reveal code) */}
          {coupon.code && (
            <div className="space-y-2">
              <p className="text-xs text-[#C9D6DF]/60 text-center mb-2">
                Add to Wallet
              </p>
              <div className="grid grid-cols-2 gap-2">
                {/* Apple Wallet Button */}
                <button
                  onClick={() => handleAddToWallet("apple")}
                  disabled={isAddingToWallet}
                  className="py-2.5 px-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isAddingToWallet ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.41-1.09-.49-2.08-.98-3.24-1.55-2.03-1.03-3.25-1.67-3.25-3.43 0-1.95 1.54-3.62 3.58-3.62 1.12 0 2.19.39 3.08 1.09.25.2.48.43.7.7.22-.27.45-.5.7-.7.89-.7 1.96-1.09 3.08-1.09 2.04 0 3.58 1.67 3.58 3.62 0 1.76-1.22 2.4-3.25 3.43-1.16.57-2.15 1.06-3.24 1.55-1.03.47-2.1.54-3.08-.41z" />
                      </svg>
                      Apple
                    </>
                  )}
                </button>

                {/* Google Wallet Button */}
                <button
                  onClick={() => handleAddToWallet("google")}
                  disabled={isAddingToWallet}
                  className="py-2.5 px-3 bg-gradient-to-r from-[#4285F4] to-[#34A853] text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isAddingToWallet ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-[#C9D6DF]/10">
            <p className="text-xs text-[#C9D6DF]/40 text-center">
              Added {new Date(coupon.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
