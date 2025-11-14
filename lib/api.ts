const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://onenightbackend-3-0.onrender.com/api";

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

// API request helper
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || error.message || "Request failed");
  }

  return response.json();
};

// Auth API
export const authAPI = {
  checkUser: (phone: string) =>
    apiRequest("/auth/check-user", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),

  register: (uid: string, phone: string, name: string) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ uid, phone, name }),
    }),

  login: () =>
    apiRequest("/auth/login", {
      method: "POST",
    }),

  profile: () =>
    apiRequest("/auth/profile", {
      method: "POST",
    }),

  checkAdmin: () =>
    apiRequest("/auth/check-admin", {
      method: "GET",
    }),
};

// Events API
export const eventsAPI = {
  // Public endpoint - no authentication required
  getAllPublicEvents: () =>
    apiRequest("/events/public", {
      method: "GET",
    }),

  getUserEvents: () =>
    apiRequest("/events", {
      method: "GET",
    }),

  getUserTickets: () =>
    apiRequest("/events/tickets", {
      method: "GET",
    }),

  addTicket: (ticket_number: string) =>
    apiRequest("/events/add-ticket", {
      method: "POST",
      body: JSON.stringify({ ticket_number }),
    }),

  bookTicket: (eventId: string) =>
    apiRequest("/events/book", {
      method: "POST",
      body: JSON.stringify({ eventId }),
    }),

  getPublicEventDetails: (eventId: string) =>
    apiRequest(`/events/public/${eventId}`, {
      method: "GET",
    }),

  getEventDetails: (eventId: string) =>
    apiRequest(`/events/${eventId}`, {
      method: "GET",
    }),

  getUserCoupons: () =>
    apiRequest("/events/coupons", {
      method: "GET",
    }),

  redeemCoupon: (couponId: string, feedback?: { ratings: Record<string, number>, comment?: string }) =>
    apiRequest(`/events/coupons/${couponId}/redeem`, {
      method: "POST",
      body: feedback ? JSON.stringify({
        overall_rating: feedback.ratings.overall,
        organization_rating: feedback.ratings.organization,
        content_rating: feedback.ratings.content,
        recommendation_rating: feedback.ratings.recommendation,
        value_rating: feedback.ratings.value,
        comment: feedback.comment
      }) : undefined,
    }),
  getWalletPass: (couponId: string) =>
    apiRequest(`/events/coupons/${couponId}/wallet`, {
      method: "GET",
    }),
};

// Admin API
export const adminAPI = {
  createEvent: (name: string, description?: string) =>
    apiRequest("/admin/events", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    }),

  getAllEvents: () =>
    apiRequest("/admin/events", {
      method: "GET",
    }),

  updateEvent: (eventId: string, name: string, description?: string) =>
    apiRequest(`/admin/events/${eventId}`, {
      method: "PUT",
      body: JSON.stringify({ name, description }),
    }),

  deleteEvent: (eventId: string) =>
    apiRequest(`/admin/events/${eventId}`, {
      method: "DELETE",
    }),

  addTicketsToEvent: (eventId: string, ticket_numbers: string[]) =>
    apiRequest(`/admin/events/${eventId}/tickets`, {
      method: "POST",
      body: JSON.stringify({ ticket_numbers }),
    }),

  autoGenerateTickets: (eventId: string, count: number, prefix?: string) =>
    apiRequest(`/admin/events/${eventId}/tickets/auto-generate`, {
      method: "POST",
      body: JSON.stringify({ count, prefix }),
    }),

  createCoupon: (
    eventId: string,
    title: string,
    description?: string,
    discount?: number,
    image_url?: string,
    valid_from?: string,
    valid_until?: string,
    terms?: string,
    templateId?: string
  ) =>
    apiRequest(`/admin/events/${eventId}/coupons`, {
      method: "POST",
      body: JSON.stringify({
        templateId,
        title,
        description,
        discount,
        image_url,
        valid_from,
        valid_until,
        terms,
      }),
    }),

  getEventCoupons: (eventId: string) =>
    apiRequest(`/admin/events/${eventId}/coupons`, {
      method: "GET",
    }),

  updateCoupon: (
    couponId: string,
    title: string,
    description?: string,
    discount?: number,
    image_url?: string,
    valid_from?: string,
    valid_until?: string,
    terms?: string
  ) =>
    apiRequest(`/admin/coupons/${couponId}`, {
      method: "PUT",
      body: JSON.stringify({
        title,
        description,
        discount,
        image_url,
        valid_from,
        valid_until,
        terms,
      }),
    }),

  deleteCoupon: (couponId: string) =>
    apiRequest(`/admin/coupons/${couponId}`, {
      method: "DELETE",
    }),

  createCouponTemplate: (
    title: string,
    description?: string,
    discount?: number,
    image_url?: string,
    valid_from?: string,
    valid_until?: string,
    terms?: string
  ) =>
    apiRequest("/admin/coupon-templates", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        discount,
        image_url,
        valid_from,
        valid_until,
        terms,
      }),
    }),

  getAllCouponTemplates: () =>
    apiRequest("/admin/coupon-templates", {
      method: "GET",
    }),

  updateCouponTemplate: (
    templateId: string,
    title: string,
    description?: string,
    discount?: number,
    image_url?: string,
    valid_from?: string,
    valid_until?: string,
    terms?: string
  ) =>
    apiRequest(`/admin/coupon-templates/${templateId}`, {
      method: "PUT",
      body: JSON.stringify({
        title,
        description,
        discount,
        image_url,
        valid_from,
        valid_until,
        terms,
      }),
    }),

  deleteCouponTemplate: (templateId: string) =>
    apiRequest(`/admin/coupon-templates/${templateId}`, {
      method: "DELETE",
    }),
};
