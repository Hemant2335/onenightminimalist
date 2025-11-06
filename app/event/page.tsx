'use client';

import React, { useState, useEffect } from 'react';

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'recorded'>('upcoming');
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Event date - November 14, 2025
  const eventDate = new Date('2025-11-14T00:00:00').getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = eventDate - now;

      if (difference > 0) {
        setTimeRemaining({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  // Sample event data
  const upcomingEvents = [
    {
      id: 1,
      date: 'Friday, Nov 14',
      title: 'The Global Fintech Summit 2025',
      venue: 'The Metropolitan Center',
      status: 'Booking Open',
      link: 'Register/Tickets Link',
    },
    {
      id: 2,
      date: 'Friday, Nov 14',
      title: 'The Global Fintech Summit 2025',
      venue: 'The Metropolitan Center',
      status: 'Booking Open',
      link: 'Register/Tickets Link',
    },
    {
      id: 3,
      date: 'Friday, Nov 14',
      title: 'The Global Fintech Summit 2025',
      venue: 'The Metropolitan Center',
      status: 'Booking Open',
      link: 'Register/Tickets Link',
    },
    {
      id: 4,
      date: 'Friday, Nov 14',
      title: 'The Global Fintech Summit 2025',
      venue: 'The Metropolitan Center',
      status: 'Booking Open',
      link: 'Register/Tickets Link',
    },
    {
      id: 5,
      date: 'Friday, Nov 14',
      title: 'The Global Fintech Summit 2025',
      venue: 'The Metropolitan Center',
      status: 'Booking Open',
      link: 'Register/Tickets Link',
    },
  ];

  return (
    <div className="min-h-screen bg-[#E3DBC8]">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-[#111111] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-black opacity-95"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 rounded-full px-5 py-2.5 mb-6 bg-[rgba(227,219,200,0.15)] border border-[rgba(227,219,200,0.25)]">
              <div className="w-2 h-2 rounded-full animate-pulse bg-[#E3DBC8]"></div>
              <span className="text-sm font-semibold text-[#E3DBC8]">Featured Event</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              One Night in{' '}
              <span className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] bg-clip-text text-transparent">
                Dubai
              </span>
            </h1>

            <p className="text-2xl mb-4 font-light text-[rgba(227,219,200,0.95)]">
              Musical Cultural Festival
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-lg">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">📅</span>
                <span className="text-[rgba(227,219,200,0.9)]">Artist Reveal: 14th November</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">📍</span>
                <span className="text-[rgba(227,219,200,0.9)]">Dubai Islands</span>
              </div>
            </div>

            <button className="px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-[#E3DBC8] to-[#d4c9b3] text-[#111111]">
              Find Out More
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#f7931e] opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-gradient-to-br from-[#E3DBC8] to-[#d4c9b3] opacity-10 blur-3xl"></div>
      </section>

      {/* Countdown Timer */}
      <section className="py-20 bg-gradient-to-b from-[#111111] to-[#E3DBC8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-[#E3DBC8]">
              Event Countdown
            </h2>
            <p className="text-xl text-[rgba(227,219,200,0.8)]">Time until the big reveal</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {/* Days */}
            <div className="relative group">
              <div className="backdrop-blur-lg rounded-3xl p-8 text-center shadow-2xl bg-[rgba(227,219,200,0.15)] border-2 border-[rgba(227,219,200,0.25)] hover:border-[rgba(227,219,200,0.4)] transition-all duration-300">
                <div className="text-6xl lg:text-7xl font-bold mb-2 bg-gradient-to-br from-[#E3DBC8] to-[#d4c9b3] bg-clip-text text-transparent">
                  {String(timeRemaining.days).padStart(2, '0')}
                </div>
                <div className="text-sm font-semibold uppercase tracking-wider text-[rgba(227,219,200,0.9)]">
                  Days
                </div>
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#ff6b35] to-[#f7931e] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300"></div>
            </div>

            {/* Hours */}
            <div className="relative group">
              <div className="backdrop-blur-lg rounded-3xl p-8 text-center shadow-2xl bg-[rgba(227,219,200,0.15)] border-2 border-[rgba(227,219,200,0.25)] hover:border-[rgba(227,219,200,0.4)] transition-all duration-300">
                <div className="text-6xl lg:text-7xl font-bold mb-2 bg-gradient-to-br from-[#E3DBC8] to-[#d4c9b3] bg-clip-text text-transparent">
                  {String(timeRemaining.hours).padStart(2, '0')}
                </div>
                <div className="text-sm font-semibold uppercase tracking-wider text-[rgba(227,219,200,0.9)]">
                  Hours
                </div>
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#ff6b35] to-[#f7931e] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300"></div>
            </div>

            {/* Minutes */}
            <div className="relative group">
              <div className="backdrop-blur-lg rounded-3xl p-8 text-center shadow-2xl bg-[rgba(227,219,200,0.15)] border-2 border-[rgba(227,219,200,0.25)] hover:border-[rgba(227,219,200,0.4)] transition-all duration-300">
                <div className="text-6xl lg:text-7xl font-bold mb-2 bg-gradient-to-br from-[#E3DBC8] to-[#d4c9b3] bg-clip-text text-transparent">
                  {String(timeRemaining.minutes).padStart(2, '0')}
                </div>
                <div className="text-sm font-semibold uppercase tracking-wider text-[rgba(227,219,200,0.9)]">
                  Minutes
                </div>
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#ff6b35] to-[#f7931e] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300"></div>
            </div>

            {/* Seconds */}
            <div className="relative group">
              <div className="backdrop-blur-lg rounded-3xl p-8 text-center shadow-2xl bg-[rgba(227,219,200,0.15)] border-2 border-[rgba(227,219,200,0.25)] hover:border-[rgba(227,219,200,0.4)] transition-all duration-300">
                <div className="text-6xl lg:text-7xl font-bold mb-2 bg-gradient-to-br from-[#E3DBC8] to-[#d4c9b3] bg-clip-text text-transparent">
                  {String(timeRemaining.seconds).padStart(2, '0')}
                </div>
                <div className="text-sm font-semibold uppercase tracking-wider text-[rgba(227,219,200,0.9)]">
                  Seconds
                </div>
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#ff6b35] to-[#f7931e] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Decorative Line */}
          <div className="mt-16 h-1 max-w-md mx-auto rounded-full bg-gradient-to-r from-transparent via-[rgba(227,219,200,0.4)] to-transparent"></div>
        </div>
      </section>

      {/* Event Calendar */}
      <section className="py-20 bg-[#E3DBC8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-[#111111]">
              Event{' '}
              <span className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] bg-clip-text text-transparent">
                Calendar
              </span>
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-center mb-8 border-b-2 border-[rgba(17,17,17,0.1)]">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-8 py-4 font-semibold text-lg relative transition-colors duration-300 ${
                activeTab === 'upcoming'
                  ? 'text-[#111111]'
                  : 'text-[rgba(17,17,17,0.5)] hover:text-[rgba(17,17,17,0.7)]'
              }`}
            >
              Upcoming
              {activeTab === 'upcoming' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff6b35] to-[#f7931e]"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('recorded')}
              className={`px-8 py-4 font-semibold text-lg relative transition-colors duration-300 ${
                activeTab === 'recorded'
                  ? 'text-[#111111]'
                  : 'text-[rgba(17,17,17,0.5)] hover:text-[rgba(17,17,17,0.7)]'
              }`}
            >
              Recorded
              {activeTab === 'recorded' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff6b35] to-[#f7931e]"></div>
              )}
            </button>
          </div>

          {/* Event List */}
          <div className="space-y-4">
            {activeTab === 'upcoming' ? (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 bg-white border border-[rgba(17,17,17,0.1)] hover:border-[rgba(17,17,17,0.2)]"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-sm font-semibold mb-2 text-[rgba(17,17,17,0.6)]">
                        {event.date}
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-[#111111]">
                        {event.title}
                      </h3>
                      <div className="text-sm text-[rgba(17,17,17,0.6)]">
                        {event.venue}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white">
                        {event.status}
                      </div>
                      <button className="px-6 py-2.5 rounded-full font-semibold text-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white hover:scale-105">
                        {event.link}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-xl text-[rgba(17,17,17,0.6)]">
                  No recorded events available yet
                </p>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {activeTab === 'upcoming' && (
            <div className="text-center mt-12">
              <button className="px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 bg-[#111111] text-[#E3DBC8]">
                Load More Events
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#111111] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Don't Miss Out!
          </h2>
          <p className="text-xl text-[rgba(227,219,200,0.9)] mb-8 max-w-2xl mx-auto">
            Be the first to know about upcoming events and exclusive experiences
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-[#E3DBC8] to-[#d4c9b3] text-[#111111]">
              Subscribe to Updates
            </button>
            <button className="backdrop-blur-sm px-8 py-4 rounded-full font-semibold transition-all duration-300 bg-[rgba(227,219,200,0.1)] border border-[rgba(227,219,200,0.2)] text-[#E3DBC8] hover:bg-[rgba(227,219,200,0.15)]">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default EventsPage;
