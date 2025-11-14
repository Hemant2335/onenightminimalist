'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminAPI } from '@/lib/api';
import { Modal } from '@/components/Modal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

interface CouponTemplate {
  id: string;
  title: string;
  description?: string;
  discount?: number;
  image_url?: string;
  valid_from?: string;
  valid_until?: string;
  terms?: string;
  created_at: string;
  _count: {
    coupons: number;
  };
}

interface WizardData {
  event: {
    name: string;
    description: string;
  };
  tickets: {
    method: 'auto' | 'manual';
    auto: {
      count: string;
      prefix: string;
    };
    manual: {
      numbers: string;
    };
  };
  coupons: Array<{
    title: string;
    description: string;
    discount: string;
    image_url: string;
    valid_from: string;
    valid_until: string;
    terms: string;
  }>;
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
  const [couponsDialogOpen, setCouponsDialogOpen] = useState(false);

  // Coupon template state
  const [couponTemplates, setCouponTemplates] = useState<CouponTemplate[]>([]);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    title: '',
    description: '',
    discount: '',
    image_url: '',
    valid_from: '',
    valid_until: '',
    terms: ''
  });
  const [editingTemplate, setEditingTemplate] = useState<CouponTemplate | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState('custom');

  // Wizard state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    event: { name: '', description: '' },
    tickets: { method: 'auto', auto: { count: '', prefix: 'TICKET' }, manual: { numbers: '' } },
    coupons: []
  });
  const [creatingWizard, setCreatingWizard] = useState(false);

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
      fetchCouponTemplates();
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
        couponForm.terms || undefined,
        selectedTemplateId === 'custom' ? undefined : selectedTemplateId
      );
      if (response.success) {
        setSuccess('Coupon template created successfully! Codes will be generated when users book tickets.');
        setCouponForm({ title: '', description: '', discount: '', image_url: '', valid_from: '', valid_until: '', terms: '' });
        setCouponEventId('');
        setSelectedTemplateId('custom');
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

  const handleCreateCouponTemplate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError('');
      setSuccess('');
      const response = await adminAPI.createCouponTemplate(
        templateForm.title,
        templateForm.description || undefined,
        templateForm.discount ? parseFloat(templateForm.discount) : undefined,
        templateForm.image_url || undefined,
        templateForm.valid_from || undefined,
        templateForm.valid_until || undefined,
        templateForm.terms || undefined
      );
      if (response.success) {
        setSuccess('Coupon template created successfully!');
        setTemplateForm({ title: '', description: '', discount: '', image_url: '', valid_from: '', valid_until: '', terms: '' });
        setShowTemplateForm(false);
        fetchCouponTemplates();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create coupon template');
    }
  };

  const handleUpdateCouponTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    try {
      setError('');
      setSuccess('');
      const response = await adminAPI.updateCouponTemplate(
        editingTemplate.id,
        templateForm.title,
        templateForm.description || undefined,
        templateForm.discount ? parseFloat(templateForm.discount) : undefined,
        templateForm.image_url || undefined,
        templateForm.valid_from || undefined,
        templateForm.valid_until || undefined,
        templateForm.terms || undefined
      );
      if (response.success) {
        setSuccess('Coupon template updated successfully!');
        setTemplateForm({ title: '', description: '', discount: '', image_url: '', valid_from: '', valid_until: '', terms: '' });
        setEditingTemplate(null);
        setShowTemplateForm(false);
        fetchCouponTemplates();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update coupon template');
    }
  };

  const handleDeleteCouponTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this coupon template?')) return;

    try {
      setError('');
      setSuccess('');
      const response = await adminAPI.deleteCouponTemplate(templateId);
      if (response.success) {
        setSuccess('Coupon template deleted successfully!');
        fetchCouponTemplates();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete coupon template');
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

  const fetchCouponTemplates = async () => {
    try {
      const response = await adminAPI.getAllCouponTemplates();
      setCouponTemplates(response.couponTemplates || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch coupon templates');
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

  const openEditTemplate = (template: CouponTemplate) => {
    setEditingTemplate(template);
    setTemplateForm({
      title: template.title,
      description: template.description || '',
      discount: template.discount?.toString() || '',
      image_url: template.image_url || '',
      valid_from: template.valid_from ? new Date(template.valid_from).toISOString().split('T')[0] : '',
      valid_until: template.valid_until ? new Date(template.valid_until).toISOString().split('T')[0] : '',
      terms: template.terms || '',
    });
    setShowTemplateForm(true);
  };

  const viewCoupons = (eventId: string) => {
    setViewingCoupons(eventId);
    fetchCoupons(eventId);
    setCouponsDialogOpen(true);
  };

  const handleWizardSubmit = async () => {
    try {
      setCreatingWizard(true);
      setError('');
      setSuccess('');

      // Step 1: Create Event
      const eventResponse = await adminAPI.createEvent(
        wizardData.event.name,
        wizardData.event.description || undefined
      );
      if (!eventResponse.success) throw new Error('Failed to create event');

      const eventId = eventResponse.event.id;

      // Step 2: Add Tickets
      if (wizardData.tickets.method === 'auto') {
        const count = parseInt(wizardData.tickets.auto.count);
        if (count > 0) {
          await adminAPI.autoGenerateTickets(eventId, count, wizardData.tickets.auto.prefix || undefined);
        }
      } else {
        const ticketNumbers = wizardData.tickets.manual.numbers
          .split('\n')
          .map(t => t.trim())
          .filter(t => t.length > 0);
        if (ticketNumbers.length > 0) {
          await adminAPI.addTicketsToEvent(eventId, ticketNumbers);
        }
      }

      // Step 3: Create Coupons
      for (const coupon of wizardData.coupons) {
        await adminAPI.createCoupon(
          eventId,
          coupon.title,
          coupon.description || undefined,
          coupon.discount ? parseFloat(coupon.discount) : undefined,
          coupon.image_url || undefined,
          coupon.valid_from || undefined,
          coupon.valid_until || undefined,
          coupon.terms || undefined,
          undefined
        );
      }

      setSuccess('Event created successfully with tickets and coupons!');
      setWizardOpen(false);
      fetchEvents();
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
    } finally {
      setCreatingWizard(false);
    }
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
              setWizardOpen(true);
              setWizardStep(1);
              setWizardData({
                event: { name: '', description: '' },
                tickets: { method: 'auto', auto: { count: '', prefix: 'TICKET' }, manual: { numbers: '' } },
                coupons: []
              });
            }}
            className="px-6 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] transition-all duration-200"
          >
            🚀 Create Event Wizard
          </button>
          <button
            onClick={() => {
              setShowEventForm(true);
              setEditingEvent(null);
              setEventForm({ name: '', description: '' });
            }}
            className="px-6 py-3 bg-[#52616B] text-[#F0F5F9] rounded-lg font-semibold hover:bg-[#52616B]/80 transition-all duration-200"
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
              setCouponForm({ title: '', description: '', discount: '', image_url: '', valid_from: '', valid_until: '', terms: '' });
              setCouponEventId('');
              setSelectedTemplateId('custom');
            }}
            className="px-6 py-3 bg-[#52616B] text-[#F0F5F9] rounded-lg font-semibold hover:bg-[#52616B]/80 transition-all duration-200"
          >
            + Create Coupon
          </button>
          <button
            onClick={() => {
              setShowTemplateForm(true);
              setEditingTemplate(null);
              setTemplateForm({ title: '', description: '', discount: '', image_url: '', valid_from: '', valid_until: '', terms: '' });
            }}
            className="px-6 py-3 bg-[#52616B] text-[#F0F5F9] rounded-lg font-semibold hover:bg-[#52616B]/80 transition-all duration-200"
          >
            🎨 Manage Templates
          </button>
        </div>

        {/* Event Form Dialog */}
        <Dialog open={showEventForm} onOpenChange={(open) => {
          if (!open) {
            setShowEventForm(false);
            setEditingEvent(null);
            setEventForm({ name: '', description: '' });
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingEvent ? 'Edit Event' : 'Create Event'}</DialogTitle>
              <DialogDescription>
                {editingEvent ? 'Update the event details below.' : 'Create a new event for ticket management.'}
              </DialogDescription>
            </DialogHeader>
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
          </DialogContent>
        </Dialog>

        {/* Auto-Generate Tickets Form Dialog */}
        <Dialog open={showAutoGenerateForm} onOpenChange={(open) => {
          if (!open) {
            setShowAutoGenerateForm(false);
            setAutoGenerateEventId('');
            setTicketCount('');
            setTicketPrefix('TICKET');
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Auto-Generate Tickets</DialogTitle>
              <DialogDescription>
                Generate multiple tickets automatically for an event.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAutoGenerateTickets} className="space-y-4">
            <div>
              <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                Select Event *
              </label>
              <Select value={autoGenerateEventId} onValueChange={setAutoGenerateEventId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            </DialogContent>
          </Dialog>

        {/* Ticket Form Dialog */}
        <Dialog open={showTicketForm} onOpenChange={(open) => {
          if (!open) {
            setShowTicketForm(false);
            setSelectedEventId('');
            setTicketNumbers('');
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Tickets</DialogTitle>
              <DialogDescription>
                Add multiple ticket numbers to an event.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTickets} className="space-y-4">
            <div>
              <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                Select Event *
              </label>
              <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </DialogContent>
        </Dialog>

        {/* Coupon Template Form Dialog */}
        <Dialog open={showTemplateForm} onOpenChange={(open) => {
          if (!open) {
            setShowTemplateForm(false);
            setEditingTemplate(null);
            setTemplateForm({ title: '', description: '', discount: '', image_url: '', valid_from: '', valid_until: '', terms: '' });
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTemplate ? 'Edit Coupon Template' : 'Create Coupon Template'}</DialogTitle>
              <DialogDescription>
                {editingTemplate ? 'Update the coupon template details below.' : 'Create a reusable coupon template that can be used across multiple events.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={editingTemplate ? handleUpdateCouponTemplate : handleCreateCouponTemplate} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#F0F5F9] border-b border-[#C9D6DF]/20 pb-2">Basic Information</h3>

                <div className="space-y-2">
                  <label className="block text-[#C9D6DF] text-sm font-medium">
                    Template Title *
                  </label>
                  <input
                    type="text"
                    value={templateForm.title}
                    onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                    placeholder="e.g., Early Bird Discount"
                    className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[#C9D6DF] text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    value={templateForm.description}
                    onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                    placeholder="Brief description of the coupon offer"
                    rows={2}
                    className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Discount & Image */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#F0F5F9] border-b border-[#C9D6DF]/20 pb-2">Discount Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[#C9D6DF] text-sm font-medium">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      value={templateForm.discount}
                      onChange={(e) => setTemplateForm({ ...templateForm, discount: e.target.value })}
                      placeholder="20"
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[#C9D6DF] text-sm font-medium">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={templateForm.image_url}
                      onChange={(e) => setTemplateForm({ ...templateForm, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                    />
                  </div>
                </div>

                <p className="text-xs text-[#C9D6DF]/60 bg-[#52616B]/10 p-3 rounded-lg">
                  💡 Templates can be reused across multiple events. Upload images to Firebase Storage and paste the URL here.
                </p>
              </div>

              {/* Validity Period */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#F0F5F9] border-b border-[#C9D6DF]/20 pb-2">Validity Period</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[#C9D6DF] text-sm font-medium">
                      Valid From
                    </label>
                    <input
                      type="date"
                      value={templateForm.valid_from}
                      onChange={(e) => setTemplateForm({ ...templateForm, valid_from: e.target.value })}
                      className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[#C9D6DF] text-sm font-medium">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      value={templateForm.valid_until}
                      onChange={(e) => setTemplateForm({ ...templateForm, valid_until: e.target.value })}
                      className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#F0F5F9] border-b border-[#C9D6DF]/20 pb-2">Terms & Conditions</h3>

                <div className="space-y-2">
                  <label className="block text-[#C9D6DF] text-sm font-medium">
                    Terms & Conditions
                  </label>
                  <textarea
                    value={templateForm.terms}
                    onChange={(e) => setTemplateForm({ ...templateForm, terms: e.target.value })}
                    placeholder="Specify any terms and conditions for using this coupon"
                    rows={3}
                    className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#C9D6DF]/20">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] transition-all duration-200"
                >
                  {editingTemplate ? 'Update Template' : 'Create Template'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTemplateForm(false);
                    setEditingTemplate(null);
                    setTemplateForm({ title: '', description: '', discount: '', image_url: '', valid_from: '', valid_until: '', terms: '' });
                  }}
                  className="px-6 py-3 bg-transparent border border-[#C9D6DF]/20 text-[#C9D6DF] rounded-lg font-semibold hover:bg-[#52616B]/20 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Coupon Form Dialog */}
        <Dialog open={showCouponForm} onOpenChange={(open) => {
          if (!open) {
            setShowCouponForm(false);
            setEditingCoupon(null);
            setCouponForm({ title: '', description: '', discount: '', image_url: '', valid_from: '', valid_until: '', terms: '' });
            setCouponEventId('');
            setSelectedTemplateId('custom');
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
              <DialogDescription>
                {editingCoupon ? 'Update the coupon details below.' : 'Create a new coupon template for ticket bookings.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={editingCoupon ? handleUpdateCoupon : handleCreateCoupon} className="space-y-6">
             {/* Event Selection */}
             {!editingCoupon && (
               <div className="space-y-2">
                 <label className="block text-[#C9D6DF] text-sm font-medium">
                   Select Event *
                 </label>
                 <Select value={couponEventId} onValueChange={setCouponEventId}>
                   <SelectTrigger>
                     <SelectValue placeholder="Select an event" />
                   </SelectTrigger>
                   <SelectContent>
                     {events.map((event) => (
                       <SelectItem key={event.id} value={event.id}>
                         {event.name}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
             )}

             {/* Template Selection */}
             {!editingCoupon && (
               <div className="space-y-2">
                 <label className="block text-[#C9D6DF] text-sm font-medium">
                   Use Template (Optional)
                 </label>
                 <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                   <SelectTrigger>
                     <SelectValue placeholder="Create custom coupon" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="custom">Create custom coupon</SelectItem>
                     {couponTemplates.map((template) => (
                       <SelectItem key={template.id} value={template.id}>
                         {template.title} ({template._count.coupons} used)
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
                 <p className="text-xs text-[#C9D6DF]/60">
                   Select a template to pre-fill the form, or leave blank to create a custom coupon.
                 </p>
               </div>
             )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#F0F5F9] border-b border-[#C9D6DF]/20 pb-2">Basic Information</h3>

              <div className="space-y-2">
                <label className="block text-[#C9D6DF] text-sm font-medium">
                  Coupon Title *
                </label>
                <input
                  type="text"
                  value={couponForm.title}
                  onChange={(e) => setCouponForm({ ...couponForm, title: e.target.value })}
                  placeholder="e.g., Early Bird Discount"
                  className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[#C9D6DF] text-sm font-medium">
                  Description
                </label>
                <textarea
                  value={couponForm.description}
                  onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                  placeholder="Brief description of the coupon offer"
                  rows={2}
                  className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all resize-none"
                />
              </div>
            </div>

            {/* Discount & Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#F0F5F9] border-b border-[#C9D6DF]/20 pb-2">Discount Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[#C9D6DF] text-sm font-medium">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={couponForm.discount}
                    onChange={(e) => setCouponForm({ ...couponForm, discount: e.target.value })}
                    placeholder="20"
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[#C9D6DF] text-sm font-medium">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={couponForm.image_url}
                    onChange={(e) => setCouponForm({ ...couponForm, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                  />
                </div>
              </div>

              <p className="text-xs text-[#C9D6DF]/60 bg-[#52616B]/10 p-3 rounded-lg">
                💡 Unique coupon codes will be automatically generated when users book tickets for this event.
                Upload images to Firebase Storage and paste the URL here.
              </p>
            </div>

            {/* Validity Period */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#F0F5F9] border-b border-[#C9D6DF]/20 pb-2">Validity Period</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[#C9D6DF] text-sm font-medium">
                    Valid From
                  </label>
                  <input
                    type="date"
                    value={couponForm.valid_from}
                    onChange={(e) => setCouponForm({ ...couponForm, valid_from: e.target.value })}
                    className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[#C9D6DF] text-sm font-medium">
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
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#F0F5F9] border-b border-[#C9D6DF]/20 pb-2">Terms & Conditions</h3>

              <div className="space-y-2">
                <label className="block text-[#C9D6DF] text-sm font-medium">
                  Terms & Conditions
                </label>
                <textarea
                  value={couponForm.terms}
                  onChange={(e) => setCouponForm({ ...couponForm, terms: e.target.value })}
                  placeholder="Specify any terms and conditions for using this coupon"
                  rows={3}
                  className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#C9D6DF]/20">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] transition-all duration-200"
              >
                {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
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
          </DialogContent>
        </Dialog>

        {/* Event Creation Wizard */}
        <Dialog open={wizardOpen} onOpenChange={(open) => {
          if (!open) {
            setWizardOpen(false);
            setWizardStep(1);
            setWizardData({
              event: { name: '', description: '' },
              tickets: { method: 'auto', auto: { count: '', prefix: 'TICKET' }, manual: { numbers: '' } },
              coupons: []
            });
          }
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Event Wizard</DialogTitle>
              <DialogDescription>
                Step {wizardStep} of 4: {
                  wizardStep === 1 ? 'Event Details' :
                  wizardStep === 2 ? 'Ticket Setup' :
                  wizardStep === 3 ? 'Coupon Setup' :
                  'Review & Create'
                }
              </DialogDescription>
            </DialogHeader>

            {/* Step 1: Event Details */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[#C9D6DF] text-sm font-medium">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    value={wizardData.event.name}
                    onChange={(e) => setWizardData(prev => ({
                      ...prev,
                      event: { ...prev.event, name: e.target.value }
                    }))}
                    placeholder="Enter event name"
                    className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[#C9D6DF] text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    value={wizardData.event.description}
                    onChange={(e) => setWizardData(prev => ({
                      ...prev,
                      event: { ...prev.event, description: e.target.value }
                    }))}
                    placeholder="Enter event description"
                    rows={3}
                    className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Tickets */}
            {wizardStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="block text-[#C9D6DF] text-sm font-medium">
                    Ticket Generation Method
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="ticketMethod"
                        value="auto"
                        checked={wizardData.tickets.method === 'auto'}
                        onChange={(e) => setWizardData(prev => ({
                          ...prev,
                          tickets: { ...prev.tickets, method: e.target.value as 'auto' }
                        }))}
                        className="text-[#C9D6DF] focus:ring-[#C9D6DF]/20"
                      />
                      <span className="text-[#C9D6DF]">Auto-Generate</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="ticketMethod"
                        value="manual"
                        checked={wizardData.tickets.method === 'manual'}
                        onChange={(e) => setWizardData(prev => ({
                          ...prev,
                          tickets: { ...prev.tickets, method: e.target.value as 'manual' }
                        }))}
                        className="text-[#C9D6DF] focus:ring-[#C9D6DF]/20"
                      />
                      <span className="text-[#C9D6DF]">Manual Entry</span>
                    </label>
                  </div>
                </div>

                {wizardData.tickets.method === 'auto' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[#C9D6DF] text-sm font-medium">
                        Number of Tickets
                      </label>
                      <input
                        type="number"
                        value={wizardData.tickets.auto.count}
                        onChange={(e) => setWizardData(prev => ({
                          ...prev,
                          tickets: {
                            ...prev.tickets,
                            auto: { ...prev.tickets.auto, count: e.target.value }
                          }
                        }))}
                        placeholder="100"
                        min="1"
                        max="1000"
                        className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[#C9D6DF] text-sm font-medium">
                        Prefix
                      </label>
                      <input
                        type="text"
                        value={wizardData.tickets.auto.prefix}
                        onChange={(e) => setWizardData(prev => ({
                          ...prev,
                          tickets: {
                            ...prev.tickets,
                            auto: { ...prev.tickets.auto, prefix: e.target.value }
                          }
                        }))}
                        placeholder="TICKET"
                        className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                      />
                    </div>
                  </div>
                )}

                {wizardData.tickets.method === 'manual' && (
                  <div className="space-y-2">
                    <label className="block text-[#C9D6DF] text-sm font-medium">
                      Ticket Numbers (one per line)
                    </label>
                    <textarea
                      value={wizardData.tickets.manual.numbers}
                      onChange={(e) => setWizardData(prev => ({
                        ...prev,
                        tickets: {
                          ...prev.tickets,
                          manual: { numbers: e.target.value }
                        }
                      }))}
                      placeholder="TICKET001&#10;TICKET002&#10;TICKET003"
                      rows={6}
                      className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all font-mono"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Coupons */}
            {wizardStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#F0F5F9]">Coupons (Optional)</h3>
                  <button
                    onClick={() => setWizardData(prev => ({
                      ...prev,
                      coupons: [...prev.coupons, {
                        title: '',
                        description: '',
                        discount: '',
                        image_url: '',
                        valid_from: '',
                        valid_until: '',
                        terms: ''
                      }]
                    }))}
                    className="px-4 py-2 bg-[#C9D6DF] text-[#111111] rounded-lg text-sm font-semibold hover:bg-[#F0F5F9] transition-all duration-200"
                  >
                    + Add Coupon
                  </button>
                </div>

                {wizardData.coupons.length === 0 ? (
                  <div className="text-center py-8 text-[#C9D6DF]/60">
                    No coupons added yet. Click "Add Coupon" to create coupon templates.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {wizardData.coupons.map((coupon, index) => (
                      <div key={index} className="p-4 bg-[#52616B]/10 border border-[#C9D6DF]/20 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-[#F0F5F9] font-semibold">Coupon {index + 1}</h4>
                          <button
                            onClick={() => setWizardData(prev => ({
                              ...prev,
                              coupons: prev.coupons.filter((_, i) => i !== index)
                            }))}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Coupon Title"
                              value={coupon.title}
                              onChange={(e) => setWizardData(prev => ({
                                ...prev,
                                coupons: prev.coupons.map((c, i) =>
                                  i === index ? { ...c, title: e.target.value } : c
                                )
                              }))}
                              className="px-3 py-2 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50"
                            />
                            <input
                              type="text"
                              placeholder="Discount %"
                              value={coupon.discount}
                              onChange={(e) => setWizardData(prev => ({
                                ...prev,
                                coupons: prev.coupons.map((c, i) =>
                                  i === index ? { ...c, discount: e.target.value } : c
                                )
                              }))}
                              className="px-3 py-2 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review */}
            {wizardStep === 4 && (
              <div className="space-y-6">
                <div className="p-4 bg-[#52616B]/10 border border-[#C9D6DF]/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-[#F0F5F9] mb-2">Event Details</h3>
                  <p className="text-[#C9D6DF]"><strong>Name:</strong> {wizardData.event.name}</p>
                  {wizardData.event.description && (
                    <p className="text-[#C9D6DF]"><strong>Description:</strong> {wizardData.event.description}</p>
                  )}
                </div>

                <div className="p-4 bg-[#52616B]/10 border border-[#C9D6DF]/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-[#F0F5F9] mb-2">Tickets</h3>
                  {wizardData.tickets.method === 'auto' ? (
                    <p className="text-[#C9D6DF]">
                      Auto-generate {wizardData.tickets.auto.count} tickets with prefix "{wizardData.tickets.auto.prefix}"
                    </p>
                  ) : (
                    <p className="text-[#C9D6DF]">
                      Manual tickets: {wizardData.tickets.manual.numbers.split('\n').filter(n => n.trim()).length} tickets
                    </p>
                  )}
                </div>

                <div className="p-4 bg-[#52616B]/10 border border-[#C9D6DF]/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-[#F0F5F9] mb-2">Coupons</h3>
                  {wizardData.coupons.length === 0 ? (
                    <p className="text-[#C9D6DF]">No coupons</p>
                  ) : (
                    <p className="text-[#C9D6DF]">{wizardData.coupons.length} coupon template(s)</p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-[#C9D6DF]/20">
              <button
                onClick={() => setWizardStep(prev => Math.max(1, prev - 1))}
                disabled={wizardStep === 1}
                className="px-6 py-3 bg-transparent border border-[#C9D6DF]/20 text-[#C9D6DF] rounded-lg font-semibold hover:bg-[#52616B]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Previous
              </button>

              {wizardStep < 4 ? (
                <button
                  onClick={() => setWizardStep(prev => Math.min(4, prev + 1))}
                  disabled={wizardStep === 1 && !wizardData.event.name.trim()}
                  className="px-6 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleWizardSubmit}
                  disabled={creatingWizard}
                  className="px-6 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {creatingWizard ? 'Creating...' : 'Create Event'}
                </button>
              )}
            </div>
          </DialogContent>
        </Dialog>

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

        {/* Coupon Templates List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#F0F5F9]">Coupon Templates</h2>
            <button
              onClick={() => {
                setShowTemplateForm(true);
                setEditingTemplate(null);
                setTemplateForm({ title: '', description: '', discount: '', image_url: '', valid_from: '', valid_until: '', terms: '' });
              }}
              className="px-4 py-2 bg-[#C9D6DF] text-[#111111] rounded-lg text-sm font-semibold hover:bg-[#F0F5F9] transition-all duration-200"
            >
              + New Template
            </button>
          </div>
          {couponTemplates.length === 0 ? (
            <div className="text-center py-20 bg-[#1E2022] border border-[#C9D6DF]/20 rounded-lg">
              <p className="text-[#C9D6DF]/60">No coupon templates yet. Create your first template!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {couponTemplates.map((template) => (
                <div
                  key={template.id}
                  className="p-6 bg-[#1E2022] border border-[#C9D6DF]/20 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#F0F5F9] mb-2">
                        {template.title}
                      </h3>
                      {template.description && (
                        <p className="text-[#C9D6DF]/60 text-sm mb-2">{template.description}</p>
                      )}
                      <div className="flex gap-4 text-sm text-[#C9D6DF]/60">
                        <span>{template.discount}% off</span>
                        <span>{template._count.coupons} used</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditTemplate(template)}
                      className="px-3 py-1.5 bg-[#C9D6DF] text-[#111111] rounded text-xs font-semibold hover:bg-[#F0F5F9] transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCouponTemplate(template.id)}
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


        {/* Coupons Dialog */}
        <Dialog open={couponsDialogOpen} onOpenChange={(open) => {
          setCouponsDialogOpen(open);
          if (!open) {
            setViewingCoupons(null);
            setCoupons([]);
          }
        }}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Coupons for {events.find(e => e.id === viewingCoupons)?.name}</DialogTitle>
              <DialogDescription>
                Manage coupon templates for this event
              </DialogDescription>
            </DialogHeader>
            {coupons.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-4">🎁</div>
                <p className="text-lg text-[#C9D6DF]/60 mb-2">
                  No coupons for this event yet
                </p>
                <p className="text-[#C9D6DF]/40 text-sm">
                  Create coupon templates that will generate unique codes when users book tickets
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        onClick={() => {
                          openEditCoupon(coupon);
                          setCouponsDialogOpen(false);
                        }}
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
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPanel;

