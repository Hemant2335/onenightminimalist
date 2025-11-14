"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://onenightbackend-3-0.onrender.com/api";

interface TestAuthProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestAuth: React.FC<TestAuthProps> = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { loginWithTestToken } = useAuth();

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
        // Use the context method to handle test login
        await loginWithTestToken(data.token);

        // Close the dialog and redirect to dashboard
        onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-yellow-400 flex items-center gap-2">
            🧪 Test Mode
          </DialogTitle>
          <DialogDescription className="text-[#C9D6DF]/60">
            Bypass Firebase OTP for testing purposes
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleTestLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#C9D6DF]/80 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+911234567890 or +919876543210"
              className="w-full px-3 py-2 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all"
              required
            />
            <p className="text-xs text-[#C9D6DF]/40 mt-2">
              Test User: +911234567890
              <br />
              Test Admin: +919876543210
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-[#C9D6DF]/60 hover:text-[#F0F5F9] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg font-semibold hover:bg-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Logging in..." : "Test Login"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
