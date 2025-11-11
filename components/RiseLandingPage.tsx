"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { eventsAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "./LoadingSpinner";
import { EventSkeleton, EventSkeletonGrid } from "./EventSkeleton";

// --- Interfaces and Types ---
interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

interface Event {
  id: string;
  name: string;
  description?: string;
  status: string;
  available_tickets: number;
  total_tickets: number;
  created_at: string;
}

interface EventsAPIResponse {
  success: boolean;
  events: Event[];
}

interface EventCountdownProps {
  targetDate: string;
}

interface RiseLandingPageProps {
  onSignIn?: () => void;
  onSignUp?: () => void;
}

// --- Event Countdown Timer Component ---
const EventCountdown: React.FC<EventCountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const calculateTimeLeft = useCallback(() => {
    try {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

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
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
      }
    } catch (error) {
      console.error("Error calculating countdown:", error);
    }
  }, [targetDate]);

  useEffect(() => {
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

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

// Custom hook for fetching events
const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Fetching events...");

      const response =
        (await eventsAPI.getAllPublicEvents()) as EventsAPIResponse;
      console.log("Raw API Response:", response);

      let eventsData: Event[] = [];

      if (response && response.success && Array.isArray(response.events)) {
        eventsData = response.events;
        console.log("Events data found:", eventsData.length);
      } else {
        console.warn("Unexpected API response structure:", response);
        setError("Unexpected response format");
      }

      // Validate events have required fields
      const validEvents = eventsData.filter(
        (event) => event && event.id && event.name
      );

      setEvents(validEvents);

      if (validEvents.length === 0) {
        console.warn("No valid events found in response");
        setError("No events available at the moment");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError((err as Error).message || "Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
};

const RiseLandingPage: React.FC<RiseLandingPageProps> = ({
  onSignIn,
  onSignUp,
}) => {
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  // Use custom hook for events
  const { events, loading, error, refetch } = useEvents();

  // Format event date - memoized
  const formatEventDate = useCallback((dateString: string): string => {
    try {
      if (!dateString) return "Date TBD";

      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Date TBD";
      }

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${
        months[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date TBD";
    }
  }, []);

  // Get events to display - memoized
  const { featuredEvent, displayedEvents } = useMemo(() => {
    console.log("Getting events to display, total events:", events.length);

    if (!events || events.length === 0) {
      return { featuredEvent: null, displayedEvents: [] };
    }

    // Sort events by created_at (newest first)
    const sortedEvents = [...events].sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    // Featured event: first event
    const featuredEvent = sortedEvents[0];
    // Other events: exclude featured event
    const displayedEvents = sortedEvents.slice(1);
    console.log("Featured event:", featuredEvent);
    return { featuredEvent, displayedEvents };
  }, [events]);

  // Handle event click - memoized
  const handleEventClick = useCallback(
    (eventId: string) => {
      router.push(`/event/${eventId}`);
    },
    [router]
  );

  // Handle newsletter submit - memoized
  const handleNewsletterSubmit = useCallback(() => {
    if (email && email.includes("@")) {
      console.log("Newsletter subscription:", email);
      // Add your newsletter subscription logic here
      setEmail("");
      alert("Thanks for subscribing!");
    } else {
      alert("Please enter a valid email address");
    }
  }, [email]);

  // Handle email input change - memoized
  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    },
    []
  );

  // Scroll animations setup
  useEffect(() => {
    // Smooth scroll for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
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
    const observerOptions: IntersectionObserverInit = {
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

  console.log("Render state:", {
    loading,
    error,
    eventsCount: events.length,
    hasFeaturedEvent: !!featuredEvent,
    displayedEventsCount: displayedEvents.length,
  });

  return (
    <div className="min-h-screen  bg-[#111111] font-sans">
      {/* Hero Section - Featured Event Banner */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#111111] overflow-hidden pt-20 pb-20">
        {/* Fixed Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#C9D6DF]/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#52616B]/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-0 left-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#C9D6DF]/20 to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full">
          {loading ? (
            <div className="text-center py-20">
              <LoadingSpinner
                size="lg"
                text="Loading featured event..."
                fullScreen={false}
              />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-[#C9D6DF]/60 text-lg mb-4">{error}</p>
              <button
                onClick={refetch}
                className="px-6 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] transition-all duration-200"
              >
                Retry
              </button>
            </div>
          ) : featuredEvent ? (
            <div className="scroll-animate">
              {/* Featured Event Banner */}
              <div className="relative group rounded-2xl p-8 lg:p-12 bg-gradient-to-br from-[#52616B]/20 to-[#1E2022]/40 backdrop-blur-xl border border-[#C9D6DF]/30 hover:border-[#C9D6DF]/50 transition-all duration-300">
                {/* Featured Badge */}
                <div className="absolute top-6 right-6">
                  <span className="px-3 py-1.5 bg-[#C9D6DF]/15 text-[#C9D6DF] text-xs font-semibold rounded-md border border-[#C9D6DF]/30">
                    Featured Event
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  {/* Left Content */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F0F5F9] leading-tight">
                        {featuredEvent.name}
                      </h1>
                      {featuredEvent.description && (
                        <p className="text-base sm:text-lg text-[#C9D6DF]/70 font-light max-w-md">
                          {featuredEvent.description}
                        </p>
                      )}
                    </div>

                    {/* Event Info */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <span className="px-3 py-1.5 bg-[#C9D6DF]/10 border border-[#C9D6DF]/20 text-[#C9D6DF] text-sm font-medium rounded-md">
                        {featuredEvent.status}
                      </span>
                      <span className="text-[#C9D6DF]/60 text-sm">
                        {featuredEvent.available_tickets} of{" "}
                        {featuredEvent.total_tickets} tickets available
                      </span>
                      <span className="text-[#C9D6DF]/60 text-sm">
                        {formatEventDate(featuredEvent.created_at)}
                      </span>
                    </div>

                    {/* View Details Button */}
                    <div className="pt-4">
                      <button
                        onClick={() => handleEventClick(featuredEvent.id)}
                        className="group px-8 py-4 bg-gradient-to-r from-[#C9D6DF] to-[#F0F5F9] text-[#111111] rounded-lg font-semibold hover:shadow-xl hover:shadow-[#C9D6DF]/20 transition-all duration-300 flex items-center gap-2"
                      >
                        View Details
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Right Side - Countdown & Stats */}
                  <div className="space-y-6">
                    {/* Countdown Card */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#C9D6DF]/20 to-[#52616B]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                      <div className="relative bg-[#1E2022]/40 backdrop-blur-xl border border-[#C9D6DF]/20 rounded-2xl p-6 hover:border-[#C9D6DF]/40 transition-all duration-300">
                        <p className="text-[#C9D6DF]/60 text-sm font-semibold tracking-wide mb-4">
                          EVENT CREATED
                        </p>
                        <EventCountdown targetDate={featuredEvent.created_at} />
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="group p-4 bg-[#52616B]/10 border border-[#C9D6DF]/15 rounded-xl hover:bg-[#52616B]/20 hover:border-[#C9D6DF]/30 transition-all duration-300">
                        <p className="text-2xl font-bold text-[#C9D6DF] mb-1">
                          {featuredEvent.total_tickets}
                        </p>
                        <p className="text-[#C9D6DF]/60 text-xs">
                          Total Tickets
                        </p>
                      </div>
                      <div className="group p-4 bg-[#52616B]/10 border border-[#C9D6DF]/15 rounded-xl hover:bg-[#52616B]/20 hover:border-[#C9D6DF]/30 transition-all duration-300">
                        <p className="text-2xl font-bold text-[#C9D6DF] mb-1">
                          {featuredEvent.available_tickets}
                        </p>
                        <p className="text-[#C9D6DF]/60 text-xs">Available</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-[#C9D6DF]/60 text-lg mb-4">
                No events available
              </p>
              <p className="text-[#C9D6DF]/40 text-sm mb-6">
                Check back later for exciting events!
              </p>
              <button
                onClick={refetch}
                className="px-6 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Events Section - Show if we have other events */}
      {displayedEvents.length > 0 && (
        <section id="events" className="py-24 bg-[#111111]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            {/* Section Header */}
            <div className="text-center mb-20 scroll-animate">
              <h2 className="text-5xl sm:text-6xl font-bold text-[#F0F5F9] mb-4">
                More <span className="text-[#C9D6DF]">Events</span>
                
              </h2>
              <p className="text-base text-[#C9D6DF]/60 max-w-2xl mx-auto">
                Explore our upcoming events and secure your spot today
              </p>
            </div>

            {/* Events Grid */}
            <div className="space-y-4">
              {displayedEvents.map((event) => (
                <div
                  key={event.id}
                  className="scroll-animate group rounded-lg p-6 backdrop-blur-sm border transition-all duration-300 cursor-pointer bg-[#52616B]/10 border-[#C9D6DF]/15 hover:bg-[#52616B]/20 hover:border-[#C9D6DF]/30"
                  onClick={() => handleEventClick(event.id)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[#C9D6DF] font-semibold">
                          {formatEventDate(event.created_at)}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-md border ${
                            event.available_tickets > 0
                              ? "bg-[#C9D6DF]/15 text-[#C9D6DF] border-[#C9D6DF]/30"
                              : "bg-red-500/15 text-red-400 border-red-500/30"
                          }`}
                        >
                          {event.available_tickets > 0
                            ? "Available"
                            : "Sold Out"}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-[#F0F5F9] mb-2 group-hover:text-[#C9D6DF] transition-colors">
                        {event.name}
                      </h3>
                      {event.description && (
                        <p className="text-[#C9D6DF]/60 text-sm mb-1 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                      <p className="text-[#C9D6DF]/60 text-sm">
                        {event.available_tickets} of {event.total_tickets}{" "}
                        tickets available • {event.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <button
                        className="px-5 py-2.5 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold text-sm hover:bg-[#F0F5F9] transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event.id);
                        }}
                        disabled={event.available_tickets === 0}
                      >
                        {event.available_tickets === 0
                          ? "Sold Out"
                          : "View Details"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="your@email.com"
                className="flex-1 px-5 py-3.5 bg-[#52616B]/15 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                aria-label="Email address"
              />
              <button
                onClick={handleNewsletterSubmit}
                className="px-6 py-3.5 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] transition-all duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Styles */}
      
    </div>
  );
};

export default RiseLandingPage;
