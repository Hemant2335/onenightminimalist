"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://onenightbackend-3-0.onrender.com/api";

export const TestAuth = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { refreshProfile } = useAuth();

  const handleTestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Use test login endpoint
      const response = await fetch(`${API_BASE_URL}/test/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (data.success) {
        // Store test token
        localStorage.setItem("authToken", data.token);

        // Refresh profile to update auth context
        await refreshProfile();

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError(data.error || "Test login failed");
      }
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-[#1E2022] border border-yellow-500/30 rounded-lg p-4 shadow-xl max-w-sm">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-yellow-400 mb-1">
            🧪 Test Mode
          </h3>
          <p className="text-xs text-[#C9D6DF]/60">
            Bypass Firebase OTP for testing
          </p>
        </div>

        <form onSubmit={handleTestLogin} className="space-y-3">
          <div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+911234567890 or +919876543210"
              className="w-full px-3 py-2 text-sm bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-yellow-500/50"
              required
            />
            <p className="text-xs text-[#C9D6DF]/40 mt-1">
              Test User: +911234567890
              <br />
              Test Admin: +919876543210
            </p>
          </div>

          {error && <div className="text-xs text-red-400">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-sm bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded font-semibold hover:bg-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Logging in..." : "Test Login"}
          </button>
        </form>
      </div>
    </div>
  );
};
