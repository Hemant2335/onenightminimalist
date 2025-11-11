'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminAPI } from '@/lib/api';

interface Event {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  tickets: any[];
  coupons: any[];
}

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

const AdminPanel = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Event form state
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({ name: '', description: '' });
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  // Ticket form state
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [ticketNumbers, setTicketNumbers] = useState('');
  
  // Auto-generate tickets form state
  const [showAutoGenerateForm, setShowAutoGenerateForm] = useState(false);
  const [autoGenerateEventId, setAutoGenerateEventId] = useState('');
  const [ticketCount, setTicketCount] = useState('');
  const [ticketPrefix, setTicketPrefix] = useState('TICKET');
  const [generating, setGenerating] = useState(false);
  
  // Coupon form state
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({ 
    title: '', 
    description: '', 
    discount: '', 
    image_url: '',
    valid_from: '',
    valid_until: '',
    terms: ''
  });
  const [couponEventId, setCouponEventId] = useState('');
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [viewingCoupons, setViewingCoupons] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      return;
    }

    if (!authLoading && !isAdmin) {
      router.push('/dashboard');
      return;
    }

    if (isAdmin) {
      fetchEvents();
    }
  }, [user, isAdmin, authLoading, router]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllEvents();
      setEvents(response.events || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      const response = await adminAPI.createEvent(eventForm.name, eventForm.description || undefined);
      if (response.success) {
        setSuccess('Event created successfully!');
        setEventForm({ name: '', description: '' });
        setShowEventForm(false);
        fetchEvents();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    
    try {
      setError('');
      setSuccess('');
      const response = await adminAPI.updateEvent(
        editingEvent.id,
        eventForm.name,
        eventForm.description || undefined
      );
      if (response.success) {
        setSuccess('Event updated successfully!');
        setEventForm({ name: '', description: '' });
        setEditingEvent(null);
        setShowEventForm(false);
        fetchEvents();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      setError('');
      setSuccess('');
      const response = await adminAPI.deleteEvent(eventId);
      if (response.success) {
        setSuccess('Event deleted successfully!');
        fetchEvents();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete event');
    }
  };

  const handleAddTickets = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) return;
    
    const ticketNumbersArray = ticketNumbers
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    
    if (ticketNumbersArray.length === 0) {
      setError('Please enter at least one ticket number');
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      const response = await adminAPI.addTicketsToEvent(selectedEventId, ticketNumbersArray);
      if (response.success) {
        setSuccess(`${response.tickets.length} tickets added successfully!`);
        setTicketNumbers('');
        setShowTicketForm(false);
        setSelectedEventId('');
        fetchEvents();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add tickets');
    }
  };

  const handleAutoGenerateTickets = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!autoGenerateEventId) return;
    
    const count = parseInt(ticketCount);
    if (!count || count < 1 || count > 1000) {
      setError('Count must be between 1 and 1000');
      return;
    }
    
    try {
      setGenerating(true);
      setError('');
      setSuccess('');
      const response = await adminAPI.autoGenerateTickets(
        autoGenerateEventId,
        count,
        ticketPrefix || undefined
      );
      if (response.success) {
        setSuccess(`${response.tickets.length} tickets generated successfully!`);
        setTicketCount('');
        setTicketPrefix('TICKET');
        setShowAutoGenerateForm(false);
        setAutoGenerateEventId('');
        fetchEvents();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to auto-generate tickets');
    } finally {
      setGenerating(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponEventId) return;
    
    try {
      setError('');
      setSuccess('');
      const response = await adminAPI.createCoupon(
        couponEventId,
        couponForm.title,
        couponForm.description || undefined,
        couponForm.discount ? parseFloat(couponForm.discount) : undefined,
        couponForm.image_url || undefined,
        couponForm.valid_from || undefined,
        couponForm.valid_until || undefined,
        couponForm.terms || undefined
      );
      if (response.success) {
        setSuccess('Coupon template created successfully! Codes will be generated when users book tickets.');
        setCouponForm({ title: '', description: '', discount: '', image_url: '', valid_from: '', valid_until: '', terms: '' });
        setCouponEventId('');
        setShowCouponForm(false);
        fetchEvents();
        if (viewingCoupons === couponEventId) {
          fetchCoupons(couponEventId);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create coupon');
    }
  };

  const handleUpdateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;
    
    try {
      setError('');
      setSuccess('');
      const response = await adminAPI.updateCoupon(
        editingCoupon.id,
        couponForm.title,
        couponForm.description || undefined,
        couponForm.discount ? parseFloat(couponForm.discount) : undefined,
        couponForm.image_url || undefined,
        couponForm.valid_from || undefined,
        couponForm.valid_until || undefined,
        couponForm.terms || undefined
      );
      if (response.success) {
        setSuccess('Coupon template updated successfully!');
        setCouponForm({ title: '', description: '', discount: '', image_url: '', valid_from: '', valid_until: '', terms: '' });
        setEditingCoupon(null);
        setShowCouponForm(false);
        if (viewingCoupons) {
          fetchCoupons(viewingCoupons);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update coupon');
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      setError('');
      setSuccess('');
      const response = await adminAPI.deleteCoupon(couponId);
      if (response.success) {
        setSuccess('Coupon deleted successfully!');
        if (viewingCoupons) {
          fetchCoupons(viewingCoupons);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete coupon');
    }
  };

  const fetchCoupons = async (eventId: string) => {
    try {
      const response = await adminAPI.getEventCoupons(eventId);
      setCoupons(response.coupons || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch coupons');
    }
  };

  const openEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({ name: event.name, description: event.description || '' });
    setShowEventForm(true);
  };

  const openEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      title: coupon.title,
      description: coupon.description || '',
      discount: coupon.discount?.toString() || '',
      image_url: coupon.image_url || '',
      valid_from: coupon.valid_from ? new Date(coupon.valid_from).toISOString().split('T')[0] : '',
      valid_until: coupon.valid_until ? new Date(coupon.valid_until).toISOString().split('T')[0] : '',
      terms: coupon.terms || '',
    });
    setCouponEventId(viewingCoupons || '');
    setShowCouponForm(true);
  };

  const viewCoupons = (eventId: string) => {
    setViewingCoupons(eventId);
    fetchCoupons(eventId);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-[#C9D6DF] text-xl">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#111111] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#F0F5F9] mb-4">
            Admin Panel
          </h1>
          <p className="text-[#C9D6DF]/60">
            Manage events, tickets, and coupons
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}

        {/* Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={() => {
              setShowEventForm(true);
              setEditingEvent(null);
              setEventForm({ name: '', description: '' });
            }}
            className="px-6 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] transition-all duration-200"
          >
            + Create Event
          </button>
          <button
            onClick={() => {
              setShowTicketForm(true);
              setSelectedEventId('');
              setTicketNumbers('');
            }}
            className="px-6 py-3 bg-[#52616B] text-[#F0F5F9] rounded-lg font-semibold hover:bg-[#52616B]/80 transition-all duration-200"
          >
            + Add Tickets
          </button>
          <button
            onClick={() => {
              setShowAutoGenerateForm(true);
              setAutoGenerateEventId('');
              setTicketCount('');
              setTicketPrefix('TICKET');
            }}
            className="px-6 py-3 bg-[#52616B] text-[#F0F5F9] rounded-lg font-semibold hover:bg-[#52616B]/80 transition-all duration-200"
          >
            ⚡ Auto-Generate Tickets
          </button>
          <button
            onClick={() => {
              setShowCouponForm(true);
              setEditingCoupon(null);
              setCouponForm({ title: '', description: '', code: '', discount: '', image_url: '', valid_from: '', valid_until: '', terms: '' });
              setCouponEventId('');
            }}
            className="px-6 py-3 bg-[#52616B] text-[#F0F5F9] rounded-lg font-semibold hover:bg-[#52616B]/80 transition-all duration-200"
          >
            + Create Coupon
          </button>
        </div>

        {/* Event Form */}
        {showEventForm && (
          <div className="mb-8 p-6 bg-[#1E2022] border border-[#C9D6DF]/20 rounded-lg">
            <h2 className="text-2xl font-bold text-[#F0F5F9] mb-4">
              {editingEvent ? 'Edit Event' : 'Create Event'}
            </h2>
            <form onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={eventForm.name}
                  onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                  placeholder="Enter event name"
                  className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Enter event description"
                  rows={4}
                  className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] transition-all duration-200"
                >
                  {editingEvent ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEventForm(false);
                    setEditingEvent(null);
                    setEventForm({ name: '', description: '' });
                  }}
                  className="px-6 py-3 bg-transparent border border-[#C9D6DF]/20 text-[#C9D6DF] rounded-lg font-semibold hover:bg-[#52616B]/20 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Auto-Generate Tickets Form */}
        {showAutoGenerateForm && (
          <div className="mb-8 p-6 bg-[#1E2022] border border-[#C9D6DF]/20 rounded-lg">
            <h2 className="text-2xl font-bold text-[#F0F5F9] mb-4">Auto-Generate Tickets</h2>
            <form onSubmit={handleAutoGenerateTickets} className="space-y-4">
              <div>
                <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                  Select Event *
                </label>
                <select
                  value={autoGenerateEventId}
                  onChange={(e) => setAutoGenerateEventId(e.target.value)}
                  className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                  required
                >
                  <option value="">Select an event</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                    Number of Tickets * (1-1000)
                  </label>
                  <input
                    type="number"
                    value={ticketCount}
                    onChange={(e) => setTicketCount(e.target.value)}
                    placeholder="100"
                    min="1"
                    max="1000"
                    className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                    Prefix (optional)
                  </label>
                  <input
                    type="text"
                    value={ticketPrefix}
                    onChange={(e) => setTicketPrefix(e.target.value)}
                    placeholder="TICKET"
                    className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                  />
                </div>
              </div>
              <div className="p-3 bg-[#52616B]/10 border border-[#C9D6DF]/20 rounded-lg">
                <p className="text-xs text-[#C9D6DF]/60">
                  Tickets will be generated as: {ticketPrefix || 'TICKET'}000001, {ticketPrefix || 'TICKET'}000002, etc.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={generating}
                  className="px-6 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {generating ? 'Generating...' : 'Generate Tickets'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAutoGenerateForm(false);
                    setAutoGenerateEventId('');
                    setTicketCount('');
                    setTicketPrefix('TICKET');
                  }}
                  className="px-6 py-3 bg-transparent border border-[#C9D6DF]/20 text-[#C9D6DF] rounded-lg font-semibold hover:bg-[#52616B]/20 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Ticket Form */}
        {showTicketForm && (
          <div className="mb-8 p-6 bg-[#1E2022] border border-[#C9D6DF]/20 rounded-lg">
            <h2 className="text-2xl font-bold text-[#F0F5F9] mb-4">Add Tickets</h2>
            <form onSubmit={handleAddTickets} className="space-y-4">
              <div>
                <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                  Select Event *
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                  required
                >
                  <option value="">Select an event</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                  Ticket Numbers (one per line) *
                </label>
                <textarea
                  value={ticketNumbers}
                  onChange={(e) => setTicketNumbers(e.target.value)}
                  placeholder="TICKET001&#10;TICKET002&#10;TICKET003"
                  rows={6}
                  className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all font-mono"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] transition-all duration-200"
                >
                  Add Tickets
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTicketForm(false);
                    setSelectedEventId('');
                    setTicketNumbers('');
                  }}
                  className="px-6 py-3 bg-transparent border border-[#C9D6DF]/20 text-[#C9D6DF] rounded-lg font-semibold hover:bg-[#52616B]/20 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Coupon Form */}
        {showCouponForm && (
          <div className="mb-8 p-6 bg-[#1E2022] border border-[#C9D6DF]/20 rounded-lg">
            <h2 className="text-2xl font-bold text-[#F0F5F9] mb-4">
              {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
            </h2>
            <form onSubmit={editingCoupon ? handleUpdateCoupon : handleCreateCoupon} className="space-y-4">
              {!editingCoupon && (
                <div>
                  <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                    Select Event *
                  </label>
                  <select
                    value={couponEventId}
                    onChange={(e) => setCouponEventId(e.target.value)}
                    className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                    required={!editingCoupon}
                  >
                    <option value="">Select an event</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                  Coupon Title *
                </label>
                <input
                  type="text"
                  value={couponForm.title}
                  onChange={(e) => setCouponForm({ ...couponForm, title: e.target.value })}
                  placeholder="Enter coupon title"
                  className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={couponForm.description}
                  onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                  placeholder="Enter coupon description"
                  rows={3}
                  className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={couponForm.image_url}
                  onChange={(e) => setCouponForm({ ...couponForm, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                />
                <p className="text-xs text-[#C9D6DF]/50 mt-1">Upload image to Firebase Storage and paste URL here</p>
              </div>
              <div>
                <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  value={couponForm.discount}
                  onChange={(e) => setCouponForm({ ...couponForm, discount: e.target.value })}
                  placeholder="Enter discount percentage"
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                />
                <p className="text-xs text-[#C9D6DF]/50 mt-1">Note: Unique coupon codes will be automatically generated when users book tickets for this event.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                    Valid From
                  </label>
                  <input
                    type="date"
                    value={couponForm.valid_from}
                    onChange={(e) => setCouponForm({ ...couponForm, valid_from: e.target.value })}
                    className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={couponForm.valid_until}
                    onChange={(e) => setCouponForm({ ...couponForm, valid_until: e.target.value })}
                    className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                  Terms & Conditions
                </label>
                <textarea
                  value={couponForm.terms}
                  onChange={(e) => setCouponForm({ ...couponForm, terms: e.target.value })}
                  placeholder="Enter terms and conditions"
                  rows={3}
                  className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] transition-all duration-200"
                >
                  {editingCoupon ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCouponForm(false);
                    setEditingCoupon(null);
                    setCouponForm({ title: '', description: '', discount: '', image_url: '', valid_from: '', valid_until: '', terms: '' });
                    setCouponEventId('');
                  }}
                  className="px-6 py-3 bg-transparent border border-[#C9D6DF]/20 text-[#C9D6DF] rounded-lg font-semibold hover:bg-[#52616B]/20 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#F0F5F9]">Events</h2>
          {events.length === 0 ? (
            <div className="text-center py-20 bg-[#1E2022] border border-[#C9D6DF]/20 rounded-lg">
              <p className="text-[#C9D6DF]/60">No events yet. Create your first event!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-6 bg-[#1E2022] border border-[#C9D6DF]/20 rounded-lg"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#F0F5F9] mb-2">
                        {event.name}
                      </h3>
                      {event.description && (
                        <p className="text-[#C9D6DF]/60 text-sm mb-2">{event.description}</p>
                      )}
                      <div className="flex gap-4 text-sm text-[#C9D6DF]/60">
                        <span>{event.tickets.length} Tickets</span>
                        <span>{event.coupons.length} Coupons</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => viewCoupons(event.id)}
                        className="px-4 py-2 bg-[#52616B] text-[#F0F5F9] rounded-lg text-sm font-semibold hover:bg-[#52616B]/80 transition-all duration-200"
                      >
                        View Coupons
                      </button>
                      <button
                        onClick={() => openEditEvent(event)}
                        className="px-4 py-2 bg-[#C9D6DF] text-[#111111] rounded-lg text-sm font-semibold hover:bg-[#F0F5F9] transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-all duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coupons View */}
        {viewingCoupons && (
          <div className="mt-12 p-6 bg-[#1E2022] border border-[#C9D6DF]/20 rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#F0F5F9]">
                Coupons for {events.find(e => e.id === viewingCoupons)?.name}
              </h2>
              <button
                onClick={() => setViewingCoupons(null)}
                className="px-4 py-2 bg-transparent border border-[#C9D6DF]/20 text-[#C9D6DF] rounded-lg text-sm font-semibold hover:bg-[#52616B]/20 transition-all duration-200"
              >
                Close
              </button>
            </div>
            {coupons.length === 0 ? (
              <p className="text-[#C9D6DF]/60 text-center py-8">No coupons for this event yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="p-4 bg-[#52616B]/10 border border-[#C9D6DF]/20 rounded-lg"
                  >
                    <h4 className="text-lg font-semibold text-[#F0F5F9] mb-2">{coupon.title}</h4>
                    {coupon.description && (
                      <p className="text-[#C9D6DF]/60 text-sm mb-2">{coupon.description}</p>
                    )}
                    <p className="text-[#C9D6DF]/60 text-xs mb-1">Template - Codes generated on ticket booking</p>
                    {coupon.discount && (
                      <p className="text-[#C9D6DF] text-sm mb-2">Discount: {coupon.discount}%</p>
                    )}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => openEditCoupon(coupon)}
                        className="px-3 py-1.5 bg-[#C9D6DF] text-[#111111] rounded text-xs font-semibold hover:bg-[#F0F5F9] transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs font-semibold hover:bg-red-500/30 transition-all duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

