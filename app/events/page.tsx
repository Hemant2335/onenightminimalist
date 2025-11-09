'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { eventsAPI } from '@/lib/api';

interface Event {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  status: string;
  available_tickets: number;
  total_tickets: number;
  booked_tickets: number;
}

const EventsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'sold-out'>('all');
  const [bookingEventId, setBookingEventId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await eventsAPI.getAllPublicEvents();
      setEvents(response.events || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Filter events based on selected filter
  const filteredEvents = events.filter((event) => {
    if (filter === 'upcoming') {
      return event.available_tickets > 0;
    } else if (filter === 'sold-out') {
      return event.available_tickets === 0;
    }
    return true; // 'all'
  });

  const handleBookTicket = async (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      router.push('/');
      return;
    }

    try {
      setBookingEventId(eventId);
      setError('');
      const response = await eventsAPI.bookTicket(eventId);
      if (response.success) {
        // Refresh events and navigate to dashboard
        await fetchEvents();
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to book ticket');
    } finally {
      setBookingEventId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => router.back()}
            className="mb-8 flex items-center gap-2 text-[#C9D6DF] hover:text-[#F0F5F9] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <h1 className="text-4xl lg:text-5xl font-bold text-[#F0F5F9] mb-4">
            All Events
          </h1>
          <p className="text-[#C9D6DF]/60 text-lg">
            Explore all our events and secure your spot today
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="inline-flex rounded-lg bg-[#52616B]/10 p-1 border border-[#52616B]/20">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2.5 rounded-md font-medium text-sm transition-all ${
                filter === 'all'
                  ? 'bg-[#52616B] text-[#F0F5F9]'
                  : 'text-[#C9D6DF] hover:text-[#F0F5F9]'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-2.5 rounded-md font-medium text-sm transition-all ${
                filter === 'upcoming'
                  ? 'bg-[#52616B] text-[#F0F5F9]'
                  : 'text-[#C9D6DF] hover:text-[#F0F5F9]'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('sold-out')}
              className={`px-6 py-2.5 rounded-md font-medium text-sm transition-all ${
                filter === 'sold-out'
                  ? 'bg-[#52616B] text-[#F0F5F9]'
                  : 'text-[#C9D6DF] hover:text-[#F0F5F9]'
              }`}
            >
              Sold Out
            </button>
          </div>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-[#C9D6DF]/60 text-lg">Loading events...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-[#C9D6DF]/60 text-lg mb-4">{error}</p>
            <button
              onClick={fetchEvents}
              className="px-6 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] transition-all duration-200"
            >
              Retry
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-[#C9D6DF]/60 text-lg">
              {filter === 'all' 
                ? 'No events available' 
                : filter === 'upcoming'
                ? 'No upcoming events available'
                : 'No sold out events'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className={`group rounded-lg p-6 backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
                  index === 0 && event.available_tickets > 0
                    ? 'bg-[#52616B]/20 border-[#C9D6DF]/40 hover:bg-[#52616B]/30 hover:border-[#C9D6DF]/60'
                    : 'bg-[#52616B]/10 border-[#C9D6DF]/15 hover:bg-[#52616B]/20 hover:border-[#C9D6DF]/30'
                }`}
                onClick={() => router.push(`/event/${event.id}`)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[#C9D6DF] font-semibold">
                        {formatEventDate(event.created_at)}
                      </span>
                      {index === 0 && event.available_tickets > 0 && (
                        <span className="px-2 py-1 bg-[#C9D6DF]/15 text-[#C9D6DF] text-xs font-semibold rounded-md border border-[#C9D6DF]/30">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-[#F0F5F9] mb-2 group-hover:text-[#C9D6DF] transition-colors">
                      {event.name}
                    </h3>
                    {event.description && (
                      <p className="text-[#C9D6DF]/60 text-sm mb-3 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-[#C9D6DF]/60">
                      <span>
                        {event.available_tickets} of {event.total_tickets} tickets available
                      </span>
                      {event.booked_tickets > 0 && (
                        <span>
                          {event.booked_tickets} booked
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span
                      className={`px-3 py-1.5 text-[#C9D6DF] text-xs font-medium rounded-md border ${
                        event.status === 'Booking Open'
                          ? 'bg-[#C9D6DF]/10 border-[#C9D6DF]/20'
                          : 'bg-[#ef4444]/10 border-[#ef4444]/20'
                      }`}
                    >
                      {event.status}
                    </span>
                    {event.available_tickets > 0 && user && (
                      <button
                        className="px-5 py-2.5 bg-green-500 text-white rounded-lg font-semibold text-sm hover:bg-green-600 transition-all duration-200 whitespace-nowrap disabled:opacity-50"
                        onClick={(e) => handleBookTicket(event.id, e)}
                        disabled={bookingEventId === event.id}
                      >
                        {bookingEventId === event.id ? 'Booking...' : 'Book Ticket'}
                      </button>
                    )}
                    <button
                      className="px-5 py-2.5 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold text-sm hover:bg-[#F0F5F9] transition-all duration-200 whitespace-nowrap"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/event/${event.id}`);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#52616B]/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-[#C9D6DF] mb-1">
                  {filteredEvents.length}
                </p>
                <p className="text-[#C9D6DF]/60 text-sm">
                  {filter === 'all' ? 'Total Events' : filter === 'upcoming' ? 'Upcoming Events' : 'Sold Out Events'}
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#C9D6DF] mb-1">
                  {filteredEvents.filter(e => e.available_tickets > 0).length}
                </p>
                <p className="text-[#C9D6DF]/60 text-sm">Available Now</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#C9D6DF] mb-1">
                  {filteredEvents.reduce((sum, e) => sum + e.available_tickets, 0)}
                </p>
                <p className="text-[#C9D6DF]/60 text-sm">Total Tickets Available</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;

