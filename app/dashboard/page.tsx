'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { eventsAPI } from '@/lib/api';
import CouponCard from '@/components/CouponCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';

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

interface Ticket {
  id: string;
  ticket_id: string;
  ticket_number: string;
  event: {
    id: string;
    name: string;
    description?: string;
    created_at: string;
  };
  created_at: string;
}

interface Event {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  ticket_count: number;
  coupons: Coupon[];
}

const DashboardPage = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddTicket, setShowAddTicket] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [addingTicket, setAddingTicket] = useState(false);
  const [activeTab, setActiveTab] = useState<'tickets' | 'coupons' | 'events'>('events');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      fetchEvents();
    }
  }, [user, authLoading, router]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const [eventsResponse, ticketsResponse] = await Promise.all([
        eventsAPI.getUserEvents(),
        eventsAPI.getUserTickets(),
      ]);
      setEvents(eventsResponse.events || []);
      setTickets(ticketsResponse.tickets || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketNumber.trim()) {
      setError('Please enter a ticket number');
      return;
    }

    try {
      setAddingTicket(true);
      setError('');
      const response = await eventsAPI.addTicket(ticketNumber.trim());
      
      if (response.success) {
        setTicketNumber('');
        setShowAddTicket(false);
        // Navigate to event details or refresh events
        if (response.event) {
          router.push(`/event/${response.event.id}`);
        } else {
          fetchEvents();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add ticket');
    } finally {
      setAddingTicket(false);
    }
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  if (authLoading || (loading && events.length === 0)) {
    return (
      <div className="min-h-screen bg-[#111111]">
        <LoadingSpinner
          size="lg"
          text="Loading dashboard..."
          overlay={true}
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#111111] pt-32 pb-20 relative">
      {loading && (
        <LoadingSpinner size="lg" text="Refreshing data..." overlay={true} />
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#F0F5F9] mb-4">
            My Dashboard
          </h1>
          <p className="text-[#C9D6DF]/60">
            Welcome back, {userProfile?.name || 'User'}! Manage your tickets, coupons, and events.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="mb-8 flex space-x-4">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'tickets'
                ? 'bg-[#C9D6DF] text-[#111111]'
                : 'bg-[#1E2022] text-[#C9D6DF] border border-[#C9D6DF]/20 hover:border-[#C9D6DF]/40'
            }`}
          >
            My Tickets
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'coupons'
                ? 'bg-[#C9D6DF] text-[#111111]'
                : 'bg-[#1E2022] text-[#C9D6DF] border border-[#C9D6DF]/20 hover:border-[#C9D6DF]/40'
            }`}
          >
            My Coupons
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'events'
                ? 'bg-[#C9D6DF] text-[#111111]'
                : 'bg-[#1E2022] text-[#C9D6DF] border border-[#C9D6DF]/20 hover:border-[#C9D6DF]/40'
            }`}
          >
            My Events
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'tickets' && (
          <>
            {/* Add Ticket Button */}
            <div className="mb-8">
              <button
                onClick={() => setShowAddTicket(!showAddTicket)}
                className="px-6 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] transition-all duration-200"
              >
                {showAddTicket ? 'Cancel' : '+ Add Ticket'}
              </button>
            </div>

            {/* Add Ticket Form */}
            {showAddTicket && (
              <div className="mb-8 p-6 bg-[#1E2022] border border-[#C9D6DF]/20 rounded-lg">
                <form onSubmit={handleAddTicket} className="space-y-4">
                  <div>
                    <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                      Ticket Number
                    </label>
                    <input
                      type="text"
                      value={ticketNumber}
                      onChange={(e) => setTicketNumber(e.target.value)}
                      placeholder="Enter ticket number"
                      className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={addingTicket}
                    className="px-6 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {addingTicket ? 'Adding...' : 'Add Ticket'}
                  </button>
                </form>
              </div>
            )}

            {/* Tickets Section */}
            {tickets.length > 0 ? (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#F0F5F9] mb-6">
                  My Tickets ({tickets.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-6 bg-[#1E2022] border border-[#C9D6DF]/20 rounded-lg hover:border-[#C9D6DF]/40 transition-all duration-300"
                    >
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-[#C9D6DF]/60">Ticket Number</span>
                          <span className="px-2 py-1 bg-[#C9D6DF]/15 text-[#C9D6DF] text-xs font-semibold rounded-md border border-[#C9D6DF]/30">
                            #{ticket.ticket_number}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-[#F0F5F9] mb-2">
                          {ticket.event.name}
                        </h3>
                        {ticket.event.description && (
                          <p className="text-[#C9D6DF]/60 text-sm mb-2 line-clamp-2">
                            {ticket.event.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-[#C9D6DF]/10">
                        <p className="text-xs text-[#C9D6DF]/40">
                          Booked {new Date(ticket.created_at).toLocaleDateString()}
                        </p>
                        <button
                          onClick={() => router.push(`/event/${ticket.event.id}`)}
                          className="px-4 py-2 bg-[#C9D6DF] text-[#111111] rounded-lg text-xs font-semibold hover:bg-[#F0F5F9] transition-all duration-200"
                        >
                          View Event
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎫</div>
                <p className="text-xl text-[#C9D6DF]/60 mb-4">
                  No tickets yet
                </p>
                <p className="text-[#C9D6DF]/40 mb-6">
                  Add a ticket number to get started
                </p>
                <button
                  onClick={() => setShowAddTicket(true)}
                  className="px-6 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] transition-all duration-200"
                >
                  Add Your First Ticket
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'coupons' && (
          <>
            {/* Coupons Section */}
            {events.some(e => e.coupons && e.coupons.length > 0) ? (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#F0F5F9] mb-6">
                  My Coupons
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {events.flatMap((event) =>
                    event.coupons?.map((coupon) => (
                      <CouponCard
                        key={coupon.id}
                        coupon={coupon}
                        eventName={event.name}
                      />
                    )) || []
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎁</div>
                <p className="text-xl text-[#C9D6DF]/60 mb-4">
                  No coupons available
                </p>
                <p className="text-[#C9D6DF]/40">
                  Coupons will appear here when available for your events
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'events' && (
          <>
            {/* Events List */}
            {events.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎫</div>
                <p className="text-xl text-[#C9D6DF]/60 mb-4">
                  No events yet
                </p>
                <p className="text-[#C9D6DF]/40 mb-6">
                  Add a ticket number to unlock your first event
                </p>
                <button
                  onClick={() => setShowAddTicket(true)}
                  className="px-6 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] transition-all duration-200"
                >
                  Add Your First Ticket
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event.id)}
                    className="group rounded-lg p-6 backdrop-blur-sm border border-[#C9D6DF]/15 hover:border-[#C9D6DF]/40 hover:bg-[#52616B]/10 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-[#C9D6DF] font-semibold text-sm">
                            {new Date(event.created_at).toLocaleDateString()}
                          </span>
                          <span className="px-2 py-1 bg-[#C9D6DF]/15 text-[#C9D6DF] text-xs font-semibold rounded-md border border-[#C9D6DF]/30">
                            {event.ticket_count} {event.ticket_count === 1 ? 'Ticket' : 'Tickets'}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-[#F0F5F9] mb-2 group-hover:text-[#C9D6DF] transition-colors">
                          {event.name}
                        </h3>
                        {event.description && (
                          <p className="text-[#C9D6DF]/60 text-sm mb-2">{event.description}</p>
                        )}
                        <p className="text-[#C9D6DF]/40 text-xs">
                          {event.coupons?.length || 0} {event.coupons?.length === 1 ? 'Coupon' : 'Coupons'} available
                        </p>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <button className="px-5 py-2.5 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold text-sm hover:bg-[#F0F5F9] transition-all duration-200 whitespace-nowrap">
                          View Event
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

