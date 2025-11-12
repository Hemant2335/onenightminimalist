'use client';

import { useState } from 'react';

export default function Hero() {
  return (
    <section id="home" className="pt-32 pb-20 px-6 bg-gradient-to-b from-[#111111] to-[#1E2022]">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-[#F0F5F9] mb-6">
            Building The Future At The Intersection Of Tech, Capital, And Culture
          </h1>
          <p className="text-xl text-[#C9D6DF]/70 mb-8">
            Expert tech to identify your venture, with risk your future business in the UAE
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button className="bg-[#C9D6DF] hover:bg-[#F0F5F9] text-[#111111] px-8 py-3 rounded-lg text-lg font-semibold transition transform hover:scale-105">
              Get Started
            </button>
            <button className="border-2 border-[#C9D6DF] text-[#C9D6DF] hover:bg-[#C9D6DF] hover:text-[#111111] px-8 py-3 rounded-lg text-lg font-semibold transition">
              Try Demo
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-[#C9D6DF] font-semibold">5.0</span>
            <span className="text-[#C9D6DF]/60">from 200 reviews</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="relative group">
            <div className="bg-gradient-to-br from-[#52616B]/20 to-[#52616B]/10 rounded-2xl overflow-hidden h-64 transform transition group-hover:scale-105 border border-[#C9D6DF]/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-[#C9D6DF] to-[#F0F5F9] rounded-lg transform rotate-12 shadow-xl"></div>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 bg-[#C9D6DF] text-[#111111] rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>

          <div className="bg-[#1E2022] text-[#F0F5F9] rounded-2xl p-8 flex flex-col justify-between transform transition hover:scale-105 border border-[#C9D6DF]/20">
            <div>
              <div className="text-5xl font-bold mb-2">100+</div>
              <div className="text-[#C9D6DF]/60 text-sm mb-4">Active venture projects launched globally</div>
            </div>
            <div className="text-6xl font-bold">1951+</div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#52616B]/20 to-[#52616B]/10 rounded-2xl p-6 transform transition hover:scale-105 border border-[#C9D6DF]/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#C9D6DF] rounded-lg"></div>
                <div>
                  <div className="font-semibold text-[#F0F5F9]">Success</div>
                  <div className="text-2xl font-bold text-[#F0F5F9]">1951+</div>
                </div>
              </div>
              <div className="text-sm text-[#C9D6DF]/60">In total capital managed</div>
            </div>

            <div className="bg-gradient-to-br from-[#52616B]/20 to-[#52616B]/10 rounded-2xl p-6 transform transition hover:scale-105 border border-[#C9D6DF]/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#C9D6DF] rounded-lg"></div>
                <div>
                  <div className="font-semibold text-[#F0F5F9]">Rate</div>
                  <div className="text-2xl font-bold text-[#F0F5F9]">6+</div>
                </div>
              </div>
              <div className="text-sm text-[#C9D6DF]/60">
                Venture <br /> studios active
              </div>
            </div>

            <div className="bg-[#1E2022] text-[#F0F5F9] rounded-2xl p-6 transform transition hover:scale-105 border border-[#C9D6DF]/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm mb-1 text-[#C9D6DF]/60">Advices Optimize</div>
                  <div className="text-lg font-semibold">Production</div>
                </div>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}