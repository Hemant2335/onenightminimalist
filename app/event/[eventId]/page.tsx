"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { eventsAPI } from "@/lib/api";
import CouponCard from "@/components/CouponCard";
import { AuthPopup } from "@/components/AuthPopup";
import { SuccessPopup } from "@/components/SuccessPopup";
import { LoadingSpinner } from "@/components/LoadingSpinner";

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

interface Event {
  id: string;
  name: string;
  description?: string;
  coupons: Coupon[];
  available_tickets?: number;
  total_tickets?: number;
  status?: string;
}

const EventDetailsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [booking, setBooking] = useState(false);
  const [authPopupOpen, setAuthPopupOpen] = useState(false);
  const [authType, setAuthType] = useState<"signin" | "signup">("signin");
  const [successPopupOpen, setSuccessPopupOpen] = useState(false);
  const [userHasTicket, setUserHasTicket] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId, user]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError("");

      // Try to get public event details first
      try {
        const publicResponse = await eventsAPI.getPublicEventDetails(eventId);
        setEvent(publicResponse.event);
        setHasAccess(false);

        // Check if user already has a ticket for this event
        if (user) {
          try {
            const ticketsResponse = await eventsAPI.getUserTickets();
            const hasTicket = ticketsResponse.tickets?.some(
              (ticket: any) => ticket.event?.id === eventId
            );
            setUserHasTicket(hasTicket || false);
            if (hasTicket) {
              // User has ticket, fetch full event details
              try {
                const authResponse = await eventsAPI.getEventDetails(eventId);
                setEvent(authResponse.event);
                setHasAccess(true);
              } catch (authErr: any) {
                // User might not have access yet, keep public view
              }
            }
          } catch (ticketErr) {
            // Could not check tickets, assume no ticket
            setUserHasTicket(false);
          }
        }
      } catch (publicErr: any) {
        // If public fails, try authenticated endpoint (user has ticket)
        if (user) {
          try {
            const authResponse = await eventsAPI.getEventDetails(eventId);
            setEvent(authResponse.event);
            setHasAccess(true);
            setUserHasTicket(true);
          } catch (authErr: any) {
            setError(authErr.message || "Failed to fetch event details");
          }
        } else {
          setError(publicErr.message || "Failed to fetch event details");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch event details");
    } finally {
      setLoading(false);
    }
  };

  const handleBookTicket = async () => {
    // If user is not logged in, open auth popup
    if (!user) {
      setAuthType("signup");
      setAuthPopupOpen(true);
      return;
    }

    // Check if user already has a ticket
    if (userHasTicket) {
      setError("You have already booked a ticket for this event.");
      return;
    }

    try {
      setBooking(true);
      setError("");
      const response = await eventsAPI.bookTicket(eventId);
      if (response.success) {
        // Show success popup
        setSuccessPopupOpen(true);
        // Refresh event details to show coupons
        await fetchEventDetails();
      }
    } catch (err: any) {
      setError(err.message || "Failed to book ticket");
    } finally {
      setBooking(false);
    }
  };

  // Handle auth popup close - refresh event details if user logged in
  const handleAuthClose = () => {
    setAuthPopupOpen(false);
    // Wait a bit for auth state to update, then refresh
    setTimeout(() => {
      fetchEventDetails();
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111]">
        <LoadingSpinner
          size="lg"
          text="Loading event details..."
          fullScreen={true}
        />
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-[#111111] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-xl text-red-400 mb-4">{error}</p>
            <button
              onClick={() => router.push("/events")}
              className="px-6 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] transition-all duration-200"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#111111] py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <button
          onClick={() => {
            // Go back to previous page or events page
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push("/events");
            }
          }}
          className="mb-8 flex items-center gap-2 text-[#C9D6DF] hover:text-[#F0F5F9] transition-colors"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Events
        </button>

        {/* Event Header */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#F0F5F9] mb-4">
            {event.name}
          </h1>
          {event.description && (
            <p className="text-[#C9D6DF]/60 text-lg mb-4">
              {event.description}
            </p>
          )}

          {/* Event Status and Booking Info */}
          {event.available_tickets !== undefined && (
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span
                className={`px-3 py-1.5 text-[#C9D6DF] text-sm font-medium rounded-md border ${
                  event.status === "Booking Open"
                    ? "bg-[#C9D6DF]/10 border-[#C9D6DF]/20"
                    : "bg-[#ef4444]/10 border-[#ef4444]/20"
                }`}
              >
                {event.status || "Booking Open"}
              </span>
              <span className="text-[#C9D6DF]/60 text-sm">
                {event.available_tickets} of {event.total_tickets} tickets
                available
              </span>
            </div>
          )}

          {/* Book Ticket Button */}
          {!hasAccess &&
            !userHasTicket &&
            event.available_tickets !== undefined &&
            event.available_tickets > 0 && (
              <div className="mt-6">
                <button
                  onClick={handleBookTicket}
                  disabled={booking}
                  className="px-8 py-4 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  {booking ? (
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
                      Booking...
                    </>
                  ) : (
                    <>🎫 Book Tickets</>
                  )}
                </button>
              </div>
            )}

          {/* User already has ticket message */}
          {userHasTicket && !hasAccess && (
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400">
                ✓ You have already booked a ticket for this event. View your
                ticket in the dashboard.
              </p>
            </div>
          )}

          {/* Sold out message */}
          {!hasAccess &&
            !userHasTicket &&
            event.available_tickets !== undefined &&
            event.available_tickets === 0 && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400">
                  This event is sold out. No tickets available.
                </p>
              </div>
            )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Coupons Section - Only show if user has access */}
        {hasAccess ? (
          <div>
            <h2 className="text-2xl font-bold text-[#F0F5F9] mb-6">
              Available Coupons
            </h2>

            {event.coupons.length === 0 ? (
              <div className="text-center py-20 bg-[#1E2022] border border-[#C9D6DF]/20 rounded-lg">
                <div className="text-6xl mb-4">🎟️</div>
                <p className="text-xl text-[#C9D6DF]/60 mb-2">
                  No coupons available yet
                </p>
                <p className="text-[#C9D6DF]/40 text-sm">
                  Check back later for exclusive offers
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {event.coupons.map((coupon) => (
                  <CouponCard
                    key={coupon.id}
                    coupon={coupon}
                    eventName={event.name}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#1E2022] border border-[#C9D6DF]/20 rounded-lg">
            <div className="text-6xl mb-4">🎟️</div>
            <p className="text-xl text-[#C9D6DF]/60 mb-2">
              Book a ticket to unlock coupons
            </p>
            <p className="text-[#C9D6DF]/40 text-sm">
              {user
                ? "Click 'Book Ticket Now' above to get started"
                : "Please log in and book a ticket to view coupons"}
            </p>
          </div>
        )}
      </div>

      {/* Auth Popup */}
      <AuthPopup
        isOpen={authPopupOpen}
        onClose={handleAuthClose}
        type={authType}
      />

      {/* Success Popup */}
      <SuccessPopup
        isOpen={successPopupOpen}
        onClose={() => {
          setSuccessPopupOpen(false);
          // Optionally redirect to dashboard
          // router.push('/dashboard');
        }}
        message="Ticket Booked Successfully! Your ticket has been saved to your account."
        title="🎉 Success!"
      />
    </div>
  );
};

export default EventDetailsPage;
