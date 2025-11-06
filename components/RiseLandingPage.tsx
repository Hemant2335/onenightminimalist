"use client";

import React, { useEffect, useRef } from "react";

const RiseLandingPage = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Smooth scroll for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (
        target.tagName === "A" &&
        target.getAttribute("href")?.startsWith("#")
      ) {
        e.preventDefault();
        const element = document.querySelector(
          target.getAttribute("href") || ""
        );
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    // Animate elements on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = "1";
          (entry.target as HTMLElement).style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    document.querySelectorAll(".card-hover").forEach((el) => {
      const element = el as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition =
        "opacity 0.6s ease-out, transform 0.6s ease-out";
      observerRef.current?.observe(element);
    });

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="text-gray-900 bg-[#E3DBC8]">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden bg-[#111111]">
        <div className="absolute inset-0 opacity-95 bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-black"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="fade-in">
              <div className="inline-flex items-center space-x-2 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 bg-[rgba(227,219,200,0.1)] border border-[rgba(227,219,200,0.2)]">
                <div className="w-2 h-2 rounded-full animate-pulse bg-[#E3DBC8]"></div>
                <span className="text-xs sm:text-sm font-medium text-[#E3DBC8]">
                  Reinventing For Tomorrow
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
                Building The{" "}
                <span className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] bg-clip-text text-transparent">
                  Future
                </span>
              </h1>

              <p className="text-lg sm:text-xl mb-3 sm:mb-4 font-light text-[rgba(227,219,200,0.9)]">
                At The Intersection Of Tech, Capital And Culture
              </p>

              <p className="mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base max-w-xl text-[rgba(227,219,200,0.7)]">
                In The Heart Of Dubai, We Integrate Strategic Insight,
                Operational Excellence, And Creative Power To Transform
                Visionary Ideas Into Lasting Global Impact.
              </p>

              <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#E3DBC8] to-[#d4c9b3]">
                    <span className="text-xl sm:text-2xl">⭐</span>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold">
                      99.9% Success Rate
                    </div>
                    <div className="text-xs text-gray-400">
                      Active Plan - 2.0
                    </div>
                  </div>
                </div>
                <div className="text-[rgba(227,219,200,0.5)]">/</div>
                <div className="flex items-center space-x-1 text-[#E3DBC8]">
                  <span className="text-base sm:text-lg">★</span>
                  <span className="font-semibold text-sm sm:text-base">5.0</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-full cursor-pointer font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-[#E3DBC8] to-[#d4c9b3] text-[#111111] text-sm sm:text-base">
                  Find Out More
                </button>
                <button className="backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all duration-300 bg-[rgba(227,219,200,0.1)] border border-[rgba(227,219,200,0.2)] text-[#E3DBC8] text-sm sm:text-base">
                  Contact Us →
                </button>
              </div>
            </div>

            {/* Right Content - Dashboard */}
            <div
              className="relative fade-in mt-8 lg:mt-0"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl bg-gradient-to-br from-[#1a1a1a] to-[#111111] border border-[rgba(227,219,200,0.1)]">
                {/* 24/7 Monitoring */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-[rgba(227,219,200,0.2)]">
                      <span className="text-xl sm:text-2xl">📊</span>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold">24/7</div>
                      <div className="text-xs sm:text-sm text-[rgba(227,219,200,0.7)]">
                        Monitoring
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shield Display */}
                <div className="relative flex justify-center mb-6 sm:mb-8">
                  <div className="relative">
                    <div className="w-36 h-44 sm:w-48 sm:h-56 rounded-t-full rounded-b-3xl flex items-center justify-center shadow-2xl bg-gradient-to-br from-[#E3DBC8] via-[#d4c9b3] to-[#E3DBC8]">
                      <div className="text-center">
                        <div className="text-5xl sm:text-6xl font-bold text-[#111111]">
                          80
                        </div>
                        <div className="text-xs sm:text-sm font-semibold mt-1 text-[#111111] opacity-90">
                          LEVEL 1
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold flex items-center space-x-1.5 sm:space-x-2 shadow-lg bg-[#E3DBC8] text-[#111111]">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse bg-[#111111]"></div>
                      <span>ACTIVE</span>
                    </div>
                  </div>
                </div>

                {/* Configuring Network */}
                <div className="rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 bg-[rgba(227,219,200,0.1)] border border-[rgba(227,219,200,0.15)]">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center animate-pulse bg-[#E3DBC8]">
                      <span className="text-base sm:text-lg">⚙️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-medium truncate">
                        Configuring Network Devices...
                      </div>
                      <div className="w-full rounded-full h-1.5 mt-2 bg-[rgba(17,17,17,0.3)]">
                        <div
                          className="h-1.5 rounded-full bg-[#E3DBC8]"
                          style={{ width: "65%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Features */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="rounded-lg p-2 sm:p-3 text-center bg-[rgba(227,219,200,0.1)] border border-[rgba(227,219,200,0.15)]">
                    <div className="text-xl sm:text-2xl mb-1">🔒</div>
                    <div className="text-xs font-medium text-[rgba(227,219,200,0.9)]">
                      Secure Coding
                    </div>
                  </div>
                  <div className="rounded-lg p-2 sm:p-3 text-center bg-[rgba(227,219,200,0.1)] border border-[rgba(227,219,200,0.15)]">
                    <div className="text-xl sm:text-2xl mb-1">🌐</div>
                    <div className="text-xs font-medium text-[rgba(227,219,200,0.9)]">
                      Network Security
                    </div>
                  </div>
                  <div className="rounded-lg p-2 sm:p-3 text-center bg-[rgba(227,219,200,0.1)] border border-[rgba(227,219,200,0.15)]">
                    <div className="text-xl sm:text-2xl mb-1">💾</div>
                    <div className="text-xs font-medium text-[rgba(227,219,200,0.9)]">
                      Data Security
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="relative py-6 sm:py-8 border-t border-[rgba(227,219,200,0.2)] bg-[rgba(0,0,0,0.2)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 items-center opacity-60">
              <div className="text-center text-lg sm:text-xl lg:text-2xl font-bold text-[#E3DBC8]">
                Rakuten
              </div>
              <div className="text-center text-lg sm:text-xl lg:text-2xl font-bold text-[#E3DBC8]">
                NCR
              </div>
              <div className="text-center text-lg sm:text-xl lg:text-2xl font-bold text-[#E3DBC8]">
                monday.com
              </div>
              <div className="text-center text-lg sm:text-xl lg:text-2xl font-bold text-[#E3DBC8]">
                Disney
              </div>
              <div className="text-center text-lg sm:text-xl lg:text-2xl font-bold text-[#E3DBC8] col-span-2 sm:col-span-1">
                Dropbox
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Event */}
      <section className="py-12 sm:py-16 bg-[#E3DBC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#111111] to-[#1a1a1a]">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 p-6 sm:p-8 lg:p-12">
              <div className="text-[#E3DBC8]">
                <div className="inline-block backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4 bg-[rgba(227,219,200,0.2)]">
                  Featured Event
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">One Night in Dubai</h2>
                <p className="text-lg sm:text-xl mb-4 sm:mb-6 text-white/90">
                  Musical Cultural Festival
                </p>
                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span className="text-xl sm:text-2xl">📅</span>
                    <span className="text-sm sm:text-base lg:text-lg">
                      Artist Reveal: 14th November
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span className="text-xl sm:text-2xl">📍</span>
                    <span className="text-sm sm:text-base lg:text-lg">Dubai Islands</span>
                  </div>
                </div>
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 bg-[#E3DBC8] text-[#111111] text-sm sm:text-base">
                  Find Out More
                </button>
              </div>
              <div className="flex items-center justify-center mt-6 md:mt-0">
                <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 backdrop-blur-lg rounded-full flex items-center justify-center bg-[rgba(227,219,200,0.1)] border-4 border-[rgba(227,219,200,0.3)]">
                  <span className="text-6xl sm:text-7xl lg:text-8xl">🎵</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Business Divisions */}
      <section id="divisions" className="py-12 sm:py-16 lg:py-20 bg-[rgba(227,219,200,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Core Business{" "}
              <span className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] bg-clip-text text-transparent">
                Divisions
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Comprehensive solutions across venture building, research, and
              deal flow
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {/* RISE Launch Pad */}
            <div className="rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg card-hover bg-[#E3DBC8] border border-[rgba(17,17,17,0.1)]">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 bg-gradient-to-br from-[#111111] to-[#1a1a1a]">
                <span className="text-2xl sm:text-3xl">🚀</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-[#111111]">
                RISE Launch Pad
              </h3>
              <p className="mb-3 sm:mb-4 font-medium text-sm sm:text-base text-[rgba(17,17,17,0.7)]">
                Venture Building
              </p>
              <p className="mb-4 sm:mb-6 text-sm sm:text-base text-[rgba(17,17,17,0.7)]">
                Full-scale venture creation from concept to market
              </p>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start space-x-2">
                  <span className="mt-0.5 sm:mt-1 text-[#111111]">✓</span>
                  <span className="text-sm sm:text-base text-[rgba(17,17,17,0.8)]">
                    Creation Meets Market Void
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-0.5 sm:mt-1 text-[#111111]">✓</span>
                  <span className="text-sm sm:text-base text-[rgba(17,17,17,0.8)]">
                    Full-scale growth and external capital support
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-0.5 sm:mt-1 text-[#111111]">✓</span>
                  <span className="text-sm sm:text-base text-[rgba(17,17,17,0.8)]">
                    Venture building from ground up
                  </span>
                </li>
              </ul>
            </div>

            {/* RISE Insights */}
            <div className="rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg card-hover bg-[#E3DBC8] border border-[rgba(17,17,17,0.1)]">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 bg-gradient-to-br from-[#111111] to-[#1a1a1a]">
                <span className="text-2xl sm:text-3xl">💡</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-[#111111]">
                RISE Insights
              </h3>
              <p className="mb-3 sm:mb-4 font-medium text-sm sm:text-base text-[rgba(17,17,17,0.7)]">
                Deep Research
              </p>
              <p className="mb-4 sm:mb-6 text-sm sm:text-base text-[rgba(17,17,17,0.7)]">
                Strategic market intelligence and forecasting
              </p>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start space-x-2">
                  <span className="mt-0.5 sm:mt-1 text-[#111111]">✓</span>
                  <span className="text-sm sm:text-base text-[rgba(17,17,17,0.8)]">
                    Meticulous, data-driven analysis
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-0.5 sm:mt-1 text-[#111111]">✓</span>
                  <span className="text-sm sm:text-base text-[rgba(17,17,17,0.8)]">
                    Market intelligence and trend forecasting
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-0.5 sm:mt-1 text-[#111111]">✓</span>
                  <span className="text-sm sm:text-base text-[rgba(17,17,17,0.8)]">
                    Built for future demand
                  </span>
                </li>
              </ul>
            </div>

            {/* RISE Connect */}
            <div className="rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg card-hover bg-[#E3DBC8] border border-[rgba(17,17,17,0.1)] sm:col-span-2 md:col-span-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 bg-gradient-to-br from-[#111111] to-[#1a1a1a]">
                <span className="text-2xl sm:text-3xl">🤝</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-[#111111]">
                RISE Connect
              </h3>
              <p className="mb-3 sm:mb-4 font-medium text-sm sm:text-base text-[rgba(17,17,17,0.7)]">
                Deal Flow & Acceleration
              </p>
              <p className="mb-4 sm:mb-6 text-sm sm:text-base text-[rgba(17,17,17,0.7)]">
                Strategic partnership facilitation and fundraising
              </p>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start space-x-2">
                  <span className="mt-0.5 sm:mt-1 text-[#111111]">✓</span>
                  <span className="text-sm sm:text-base text-[rgba(17,17,17,0.8)]">
                    Bridging CEOs with strategic partnerships
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-0.5 sm:mt-1 text-[#111111]">✓</span>
                  <span className="text-sm sm:text-base text-[rgba(17,17,17,0.8)]">
                    Facilitating Fundraising
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-0.5 sm:mt-1 text-[#111111]">✓</span>
                  <span className="text-sm sm:text-base text-[rgba(17,17,17,0.8)]">
                    Deal flow management
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* RISE Events Division */}
      <section id="events" className="py-12 sm:py-16 lg:py-20 bg-[#E3DBC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              RISE{" "}
              <span className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] bg-clip-text text-transparent">
                Events
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              The Epicentre For Community, Bringing Together Professionals And
              Audiences Through Highly Organized And Impactful Live Experiences
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Summit/Forum */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎯</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">RISE Summit / Forum</h3>
              <p className="text-xs sm:text-sm font-semibold text-orange-600 mb-3 sm:mb-4">
                PROFESSIONAL
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Premier industry-specific conferences focusing on
                future-oriented topics
              </p>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                <div>• Next-gen energy</div>
                <div>• Space technology</div>
                <div>• Private equity trends</div>
                <div>• High-level speakers</div>
              </div>
            </div>

            {/* Academy */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📚</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">RISE Academy</h3>
              <p className="text-xs sm:text-sm font-semibold text-blue-600 mb-3 sm:mb-4">
                EDUCATION & WORKSHOPS
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Short bootcamps and masterclasses for aspiring entrepreneurs
              </p>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                <div>• Early-stage entrepreneurs</div>
                <div>• Real operators & investors</div>
                <div>• Hands-on bootcamps</div>
                <div>• Practical masterclasses</div>
              </div>
            </div>

            {/* Live Entertainment */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 sm:col-span-2 md:col-span-1">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎭</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Live Entertainment</h3>
              <p className="text-xs sm:text-sm font-semibold text-purple-600 mb-3 sm:mb-4">
                PRODUCTION
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Spectacular large-scale live events and festivals
              </p>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                <div>• Concerts & music festivals</div>
                <div>• Theatrical shows</div>
                <div>• Logistics management</div>
                <div>• Cultural programming</div>
              </div>
            </div>
          </div>

          {/* Event Calendar */}
          <div className="bg-gray-900 text-white rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Upcoming Event</h3>
            <div className="bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-700">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-3 sm:gap-4">
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold mb-2">
                    The Global Fintech Summit 2025
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm sm:text-base text-gray-400 gap-2 sm:gap-0">
                    <span>📅 Friday, Nov 16</span>
                    <span>📍 The Metropolitan Center</span>
                  </div>
                </div>
                <div className="bg-green-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                  Booking Open
                </div>
              </div>
              <button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold hover:shadow-lg transition-all text-sm sm:text-base">
                Register / Get Tickets
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Model */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-[#E3DBC8]">
              Our{" "}
              <span className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] bg-clip-text text-transparent">
                Strategic Model
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto text-[rgba(227,219,200,0.8)] px-4">
              Fully Integrated Creative House: Tech And Capital Combined To
              Groundbreaking IP Execution
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="rounded-xl sm:rounded-2xl p-6 sm:p-8 bg-[rgba(227,219,200,0.1)] border border-[rgba(227,219,200,0.2)]">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎯</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-[#E3DBC8]">
                Integrated Approach
              </h3>
              <p className="mb-3 sm:mb-4 text-sm sm:text-base text-[rgba(227,219,200,0.8)]">
                We operate as a fully integrated creative house, consisting of
                tech and capital combined to groundbreaking IP execution.
              </p>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <span className="text-[#E3DBC8] mt-0.5">✓</span>
                  <span className="text-sm sm:text-base text-[rgba(227,219,200,0.9)]">
                    Technology Integration
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#E3DBC8] mt-0.5">✓</span>
                  <span className="text-sm sm:text-base text-[rgba(227,219,200,0.9)]">
                    Capital Management
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#E3DBC8] mt-0.5">✓</span>
                  <span className="text-sm sm:text-base text-[rgba(227,219,200,0.9)]">
                    IP Execution
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl sm:rounded-2xl p-6 sm:p-8 bg-[rgba(227,219,200,0.1)] border border-[rgba(227,219,200,0.2)]">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🚀</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-[#E3DBC8]">
                Unified Structure
              </h3>
              <p className="mb-3 sm:mb-4 text-sm sm:text-base text-[rgba(227,219,200,0.8)]">
                Our Structure unifies the strengths of emerging technologies
                developed within our Network Studio onto exceptional
                opportunities identified by our Investment team.
              </p>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <span className="text-[#E3DBC8] mt-0.5">✓</span>
                  <span className="text-sm sm:text-base text-[rgba(227,219,200,0.9)]">
                    Network Studio Development
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#E3DBC8] mt-0.5">✓</span>
                  <span className="text-sm sm:text-base text-[rgba(227,219,200,0.9)]">
                    Investment Team Identification
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#E3DBC8] mt-0.5">✓</span>
                  <span className="text-sm sm:text-base text-[rgba(227,219,200,0.9)]">
                    Opportunity Maximization
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Focus */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#E3DBC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Financial{" "}
              <span className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] bg-clip-text text-transparent">
                Focus
              </span>
            </h2>
          </div>

          <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl bg-[#111111] border border-[rgba(227,219,200,0.2)]">
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-[#E3DBC8]">
                  Investment Philosophy
                </h3>
                <p className="text-base sm:text-lg mb-4 sm:mb-6 text-[rgba(227,219,200,0.9)]">
                  We engage in the financing, fostering, development and
                  acceleration of early-stage projects.
                </p>
                <p className="mb-4 sm:mb-6 text-sm sm:text-base text-[rgba(227,219,200,0.8)]">
                  As a Function of RISE Solutions FZ-CO, we have access to
                  additional layers of the capitalization framework.
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="rounded-lg sm:rounded-xl p-4 sm:p-6 bg-[rgba(227,219,200,0.1)] border border-[rgba(227,219,200,0.2)]">
                  <h4 className="font-bold mb-1.5 sm:mb-2 text-sm sm:text-base text-[#E3DBC8]">
                    💰 Early-Stage Financing
                  </h4>
                  <p className="text-xs sm:text-sm text-[rgba(227,219,200,0.8)]">
                    Strategic investment in innovative ventures
                  </p>
                </div>
                <div className="rounded-lg sm:rounded-xl p-4 sm:p-6 bg-[rgba(227,219,200,0.1)] border border-[rgba(227,219,200,0.2)]">
                  <h4 className="font-bold mb-1.5 sm:mb-2 text-sm sm:text-base text-[#E3DBC8]">
                    📈 Business Development
                  </h4>
                  <p className="text-xs sm:text-sm text-[rgba(227,219,200,0.8)]">
                    Fostering growth and operational excellence
                  </p>
                </div>
                <div className="rounded-lg sm:rounded-xl p-4 sm:p-6 bg-[rgba(227,219,200,0.1)] border border-[rgba(227,219,200,0.2)]">
                  <h4 className="font-bold mb-1.5 sm:mb-2 text-sm sm:text-base text-[#E3DBC8]">
                    ⚡ Startup Acceleration
                  </h4>
                  <p className="text-xs sm:text-sm text-[rgba(227,219,200,0.8)]">
                    Multi-layered capitalization support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Divisions */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[rgba(227,219,200,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Production{" "}
              <span className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] bg-clip-text text-transparent">
                Divisions
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Full-spectrum content creation from financing to live
              entertainment
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg card-hover bg-[#E3DBC8] border border-[rgba(17,17,17,0.1)]">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💡</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-[#111111]">
                Financing Imagination
              </h3>
              <p className="text-sm sm:text-base text-[rgba(17,17,17,0.7)]">
                Strategic investment in creative and innovative ventures
              </p>
            </div>

            <div className="rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg card-hover bg-[#E3DBC8] border border-[rgba(17,17,17,0.1)]">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎨</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-[#111111]">
                Producing Culture
              </h3>
              <p className="text-sm sm:text-base text-[rgba(17,17,17,0.7)]">
                Cultural content creation and production
              </p>
            </div>

            <div className="rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg card-hover bg-[#E3DBC8] border border-[rgba(17,17,17,0.1)]">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📚</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-[#111111]">
                Novel & Music
              </h3>
              <p className="text-sm sm:text-base text-[rgba(17,17,17,0.7)]">
                High-quality, commercially viable content execution
              </p>
            </div>

            <div className="rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg card-hover bg-[#E3DBC8] border border-[rgba(17,17,17,0.1)]">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎬</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-[#111111]">
                Movie & Television
              </h3>
              <p className="text-sm sm:text-base text-[rgba(17,17,17,0.7)]">
                Film and TV content development and production
              </p>
            </div>

            <div className="rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg card-hover bg-[#E3DBC8] border border-[rgba(17,17,17,0.1)]">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎵</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-[#111111]">
                Music & Show
              </h3>
              <p className="text-sm sm:text-base text-[rgba(17,17,17,0.7)]">
                Music content creation and live show production
              </p>
            </div>

            <div className="rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg card-hover bg-[#E3DBC8] border border-[rgba(17,17,17,0.1)]">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎭</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-[#111111]">
                Live Entertainment
              </h3>
              <p className="text-sm sm:text-base text-[rgba(17,17,17,0.7)]">
                Large-scale live event production and management
              </p>
            </div>
          </div>

          <div className="rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl bg-gradient-to-br from-[#111111] to-[#1a1a1a] border border-[rgba(227,219,200,0.2)]">
            <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="text-3xl sm:text-4xl">🎯</div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold mb-2 text-[#E3DBC8]">
                  Novel & Music Division Mandate
                </h4>
                <p className="text-sm sm:text-base text-[rgba(227,219,200,0.8)]">
                  Our Novel & Music Division operates with the full mandate,
                  financing, and strategic support of RISE Venture Studio,
                  dedicated to executing high-quality, commercially viable
                  content with operational excellence and creative impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Ready to Build the Future?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Your Next Major Venture, Connection Or Cultural Movement Starts Here
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base">
              Contact Us
            </button>
            <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 text-sm sm:text-base">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        .nav-link {
          position: relative;
          transition: color 0.3s ease;
        }

        .nav-link::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #ff6b35;
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default RiseLandingPage;