"use client";

import React, { useEffect, useRef, useState } from "react";

// --- Event Countdown Timer Component ---
const EventCountdown = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: String(days).padStart(2, "0"),
          hours: String(hours).padStart(2, "0"),
          minutes: String(minutes).padStart(2, "0"),
          seconds: String(seconds).padStart(2, "0"),
        });
      } else {
        clearInterval(timer);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-4">
      {[
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hours" },
        { value: timeLeft.minutes, label: "Minutes" },
        { value: timeLeft.seconds, label: "Seconds" },
      ].map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#52616B]/20 backdrop-blur-sm border border-[#C9D6DF]/15 hover:border-[#C9D6DF]/30 transition-all duration-300"
        >
          <div className="text-2xl sm:text-3xl font-bold text-[#C9D6DF] mb-1">
            {item.value}
          </div>
          <div className="text-xs text-[#C9D6DF]/60 tracking-widest">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- MOCK DATA for the event cards ---
const upcomingEvents = [
  {
    date: "Nov 14",
    title: "The Global Fintech Summit 2025",
    location: "The Metropolitan Center",
    status: "Booking Open",
    linkText: "Register",
    isFeatured: true,
  },
  {
    date: "Nov 22",
    title: "Innovate & Create Workshop",
    location: "Online (Zoom)",
    status: "Booking Open",
    linkText: "Register",
    isFeatured: false,
  },
  {
    date: "Dec 05",
    title: "Winter Melodies Music Fest",
    location: "City Park Amphitheater",
    status: "Booking Open",
    linkText: "Register",
    isFeatured: false,
  },
  {
    date: "Dec 12",
    title: "Startup Pitch Night Dubai",
    location: "Rise Innovation Hub",
    status: "Booking Open",
    linkText: "Register",
    isFeatured: false,
  },
  {
    date: "Jan 10",
    title: "Future of AI Conference",
    location: "Grand Convention Hall",
    status: "Booking Open",
    linkText: "Register",
    isFeatured: false,
  },
  {
    date: "Jan 28",
    title: "Local Artisan Market",
    location: "Downtown Plaza",
    status: "Booking Open",
    linkText: "Register",
    isFeatured: false,
  },
];

const ModernEventLandingPage = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Smooth scroll for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (
        target.tagName === "A" &&
        target.getAttribute("href")?.startsWith("#")
      ) {
        e.preventDefault();
        const id = target.getAttribute("href")?.substring(1);
        const element = document.getElementById(id || "");
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
        setIsMenuOpen(false);
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
          entry.target.classList.add("animate-fade-in");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".scroll-animate").forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      observerRef.current?.disconnect();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen bg-[#111111] font-sans">

      {/* Hero Section - Enhanced Design */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#111111] overflow-hidden pt-20 pb-20">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#C9D6DF]/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#52616B]/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-0 left-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#C9D6DF]/20 to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              {/* Featured Badge */}
              

              {/* Main Title */}
              <div className="scroll-animate space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#F0F5F9] leading-tight">
                  One Night
                  <br />
                  <span className="bg-gradient-to-r from-[#C9D6DF] to-[#52616B] bg-clip-text text-transparent">
                    in Dubai
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-[#C9D6DF]/70 font-light max-w-md">
                  Experience the most anticipated musical cultural festival of the year. Join thousands of music lovers for an unforgettable night.
                </p>
              </div>

              {/* Key Highlights */}
              <div className="scroll-animate grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-[#C9D6DF]"></div>
                  <div>
                    <p className="text-[#C9D6DF]/60 text-xs tracking-wide">LOCATION</p>
                    <p className="text-[#F0F5F9] font-medium">Dubai Arena</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-[#C9D6DF]"></div>
                  <div>
                    <p className="text-[#C9D6DF]/60 text-xs tracking-wide">DATE</p>
                    <p className="text-[#F0F5F9] font-medium">Dec 14, 2025</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="scroll-animate flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="#events"
                  className="group px-8 py-4 bg-gradient-to-r from-[#C9D6DF] to-[#F0F5F9] text-[#111111] rounded-lg font-semibold hover:shadow-xl hover:shadow-[#C9D6DF]/20 transition-all duration-300 text-center flex items-center justify-center gap-2"
                >
                  Explore Events
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <button className="px-8 py-4 bg-transparent border-2 border-[#C9D6DF]/30 text-[#C9D6DF] rounded-lg font-semibold hover:bg-[#52616B]/20 hover:border-[#C9D6DF]/60 transition-all duration-300">
                  Get Tickets
                </button>
              </div>
            </div>

            {/* Right Side - Countdown & Stats */}
            <div className="scroll-animate space-y-8">
              {/* Countdown Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#C9D6DF]/20 to-[#52616B]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-[#1E2022]/40 backdrop-blur-xl border border-[#C9D6DF]/20 rounded-2xl p-8 hover:border-[#C9D6DF]/40 transition-all duration-300">
                  <p className="text-[#C9D6DF]/60 text-sm font-semibold tracking-wide mb-6">EVENT STARTS IN</p>
                  <EventCountdown targetDate="2025-12-14T20:00:00" />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group p-6 bg-[#52616B]/10 border border-[#C9D6DF]/15 rounded-xl hover:bg-[#52616B]/20 hover:border-[#C9D6DF]/30 transition-all duration-300">
                  <p className="text-3xl font-bold text-[#C9D6DF] mb-1">15K+</p>
                  <p className="text-[#C9D6DF]/60 text-sm">Attendees</p>
                </div>
                <div className="group p-6 bg-[#52616B]/10 border border-[#C9D6DF]/15 rounded-xl hover:bg-[#52616B]/20 hover:border-[#C9D6DF]/30 transition-all duration-300">
                  <p className="text-3xl font-bold text-[#C9D6DF] mb-1">50+</p>
                  <p className="text-[#C9D6DF]/60 text-sm">Artists</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-24 bg-[#111111]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-20 scroll-animate">
            <h2 className="text-5xl sm:text-6xl font-bold text-[#F0F5F9] mb-4">
              Event <span className="text-[#C9D6DF]">Calendar</span>
            </h2>
            <p className="text-base text-[#C9D6DF]/60 max-w-2xl mx-auto">
              Explore our upcoming events and secure your spot today
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-16 scroll-animate">
            <div className="inline-flex rounded-lg bg-[#52616B]/10 p-1 border border-[#52616B]/20">
              <button className="px-6 py-2.5 bg-[#52616B] text-[#F0F5F9] rounded-md font-medium text-sm transition-all">
                Upcoming
              </button>
              <button className="px-6 py-2.5 text-[#C9D6DF] font-medium text-sm hover:text-[#F0F5F9] transition-all">
                Attending
              </button>
            </div>
          </div>

          {/* Events Grid */}
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className={`scroll-animate group rounded-lg p-6 backdrop-blur-sm border transition-all duration-300 ${
                  event.isFeatured
                    ? "bg-[#52616B]/20 border-[#C9D6DF]/40 hover:bg-[#52616B]/30 hover:border-[#C9D6DF]/60"
                    : "bg-[#52616B]/10 border-[#C9D6DF]/15 hover:bg-[#52616B]/20 hover:border-[#C9D6DF]/30"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[#C9D6DF] font-semibold">
                        {event.date}
                      </span>
                      {event.isFeatured && (
                        <span className="px-2 py-1 bg-[#C9D6DF]/15 text-[#C9D6DF] text-xs font-semibold rounded-md border border-[#C9D6DF]/30">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-[#F0F5F9] mb-2 group-hover:text-[#C9D6DF] transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-[#C9D6DF]/60 text-sm">{event.location}</p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="px-3 py-1.5 bg-[#C9D6DF]/10 text-[#C9D6DF] text-xs font-medium rounded-md border border-[#C9D6DF]/20">
                      {event.status}
                    </span>
                    <button className="px-5 py-2.5 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold text-sm hover:bg-[#F0F5F9] transition-all duration-200 whitespace-nowrap">
                      {event.linkText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="contact" className="py-24 bg-[#111111]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="scroll-animate">
            <h2 className="text-5xl sm:text-6xl font-bold text-[#F0F5F9] mb-6">
              Stay <span className="text-[#C9D6DF]">Updated</span>
            </h2>
            <p className="text-base text-[#C9D6DF]/70 mb-12 max-w-2xl mx-auto">
              Get notified about new events and exclusive updates
            </p>
            
            <form 
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-5 py-3.5 bg-[#52616B]/15 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                aria-label="Email address"
                required
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] transition-all duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#111111] border-t border-[#52616B]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#C9D6DF]/50 text-sm">
            ©️ 2024 EventHub. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
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
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .scroll-animate {
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default ModernEventLandingPage;