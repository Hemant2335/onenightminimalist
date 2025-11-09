'use client';

import React, { useState } from 'react';
import ScratchCard from './ScratchCard';

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
}

interface CouponCardProps {
  coupon: Coupon;
  eventName?: string;
}

const CouponCard: React.FC<CouponCardProps> = ({ coupon, eventName }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratched, setIsScratched] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
    setIsScratched(true);
  };

  const handleAddToWallet = () => {
    // Placeholder for future wallet integration
    alert('Add to wallet functionality will be implemented soon!');
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
                    <p className="text-xs text-[#C9D6DF]/60 mb-1">Coupon Code</p>
                    <p className="text-lg font-mono font-bold text-[#C9D6DF] tracking-wider">
                      {coupon.code}
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
            {!isScratched && (
              <p className="text-xs text-[#C9D6DF]/50 text-center mt-2">
                👆 Scratch to reveal
              </p>
            )}
          </div>

          {/* Validity Dates */}
          {(coupon.valid_from || coupon.valid_until) && (
            <div className="mb-4 p-3 bg-[#52616B]/10 rounded-lg border border-[#C9D6DF]/10">
              <div className="flex items-center gap-2 text-xs text-[#C9D6DF]/70">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {coupon.valid_from && coupon.valid_until && (
                  <span>
                    Valid: {new Date(coupon.valid_from).toLocaleDateString()} - {new Date(coupon.valid_until).toLocaleDateString()}
                  </span>
                )}
                {coupon.valid_until && !coupon.valid_from && (
                  <span>Valid until: {new Date(coupon.valid_until).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          )}

          {/* Terms */}
          {coupon.terms && (
            <div className="mb-4">
              <p className="text-xs text-[#C9D6DF]/60 mb-1 font-semibold">Terms & Conditions:</p>
              <p className="text-xs text-[#C9D6DF]/50 leading-relaxed">{coupon.terms}</p>
            </div>
          )}

          {/* Add to Wallet Button */}
          <button
            onClick={handleAddToWallet}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#C9D6DF] to-[#F0F5F9] text-[#111111] rounded-lg font-semibold hover:shadow-lg hover:shadow-[#C9D6DF]/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add to Wallet
          </button>

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

