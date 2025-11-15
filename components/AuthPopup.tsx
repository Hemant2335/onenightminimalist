"use client";

import { useState, useEffect } from "react";
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult ,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { authAPI } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onenightbackend-3-0.onrender.com/api'; 

// --- Auth Popup Component ---
export const AuthPopup = ({
  isOpen,
  onClose,
  type: initialType = "signin"
}: {
  isOpen: boolean;
  onClose: () => void;
  type?: "signin" | "signup"
}) => {
  const [step, setStep] = useState<"phone" | "otp" | "name">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [authType, setAuthType] = useState<"signin" | "signup">(initialType);

  // Initialize reCAPTCHA with proper cleanup
  const initializeRecaptcha = () => {
    try {
      // Clear existing verifier if any
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }

      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          setError("reCAPTCHA expired. Please try again.");
          // Reinitialize on expiry
          setTimeout(() => initializeRecaptcha(), 100);
        }
      });
      
      setRecaptchaVerifier(verifier);
      return verifier;
    } catch (err) {
      console.error("reCAPTCHA initialization error:", err);
      return null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        initializeRecaptcha();
      }, 100);
      
      return () => {
        clearTimeout(timer);
      };
    }

    return () => {
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch (err) {
          console.error("Error clearing reCAPTCHA:", err);
        }
        setRecaptchaVerifier(null);
      }
    };
  }, [isOpen]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Format phone number (ensure it starts with country code)
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

      // Check if user exists in your database first
      const response = await fetch(`${API_BASE_URL}/auth/check-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhone }),
      });

      const data = await response.json();

      if (authType === "signin") {
        // For signin, only proceed if user exists
        if (!data.exists) {
          setError("User not found. Please sign up first.");
          setLoading(false);
          return;
        }
      } else {
        // For signup, only proceed if user doesn't exist
        if (data.exists) {
          setError("User already exists. Please sign in instead.");
          setLoading(false);
          return;
        }
      }

      // Initialize reCAPTCHA if needed
      let verifier = recaptchaVerifier;
      if (!verifier) {
        verifier = initializeRecaptcha();
        if (!verifier) {
          throw new Error("Failed to initialize reCAPTCHA");
        }
      }

      // Send OTP via Firebase
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        verifier
      );

      setConfirmationResult(confirmation);

      if (authType === "signin") {
        // Existing user - go straight to OTP
        setStep("otp");
      } else {
        // New user - collect name first, then OTP
        setStep("name");
      }
    } catch (err: any) {
      console.error("Phone verification error:", err);
      if (err.code === 'auth/invalid-phone-number') {
        setError("Invalid phone number format. Please include country code.");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Failed to send OTP. Please try again.");
      }

      // Reinitialize reCAPTCHA on error
      setTimeout(() => {
        initializeRecaptcha();
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Store name temporarily (will be saved after OTP verification)
      setStep("otp");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!confirmationResult) {
        throw new Error("No confirmation result available");
      }

      // Verify OTP with Firebase
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      // Get Firebase ID token
      const idToken = await user.getIdToken();

      // Store token
      localStorage.setItem("authToken", idToken);

      // Check if user exists
      const checkData = await authAPI.checkUser(user.phoneNumber || '');

      if (authType === "signin") {
        // Existing user - login
        const loginData = await authAPI.login();

        if (loginData.success) {
          // Reset form and close
          onClose();
          setStep("phone");
          setPhone("");
          setOtp("");
          setName("");
          setConfirmationResult(null);
          // Reload page to update auth state
          window.location.reload();
        } else {
          setError("Login failed. Please try again.");
        }
      } else {
        // New user - register (name should be collected)
        if (!name) {
          setError("Name is required for new users.");
          setStep("name");
          return;
        }

        const registerData = await authAPI.register(
          user.uid,
          user.phoneNumber || '',
          name
        );

        if (registerData.success) {
          // Reset form and close
          onClose();
          setStep("phone");
          setPhone("");
          setOtp("");
          setName("");
          setConfirmationResult(null);
          // Reload page to update auth state
          window.location.reload();
        } else {
          setError("Registration failed. Please try again.");
        }
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      if (err.code === 'auth/invalid-verification-code') {
        setError("Invalid OTP. Please check and try again.");
      } else if (err.code === 'auth/code-expired') {
        setError("OTP expired. Please request a new one.");
        // Reset to phone step on expired OTP
        setStep("phone");
        setOtp("");
        setConfirmationResult(null);
        // Reinitialize reCAPTCHA
        setTimeout(() => initializeRecaptcha(), 500);
      } else {
        setError("OTP verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");
    setOtp("");

    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      
      let verifier = recaptchaVerifier;
      if (!verifier) {
        verifier = initializeRecaptcha();
        if (!verifier) {
          throw new Error("Failed to initialize reCAPTCHA");
        }
        // Wait a bit for initialization
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      const confirmation = await signInWithPhoneNumber(
        auth, 
        formattedPhone, 
        verifier
      );
      
      setConfirmationResult(confirmation);
      setError("");
      
      // Show success message (optional)
      alert("OTP sent successfully!");
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      setError("Failed to resend OTP. Please try again.");
      
      // Reinitialize reCAPTCHA on error
      setTimeout(() => {
        initializeRecaptcha();
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep("phone");
    setOtp("");
    setName("");
    setError("");
    setConfirmationResult(null);
    // Reinitialize reCAPTCHA when going back
    setTimeout(() => initializeRecaptcha(), 100);
  };

  const handleClose = () => {
    // Reset all state when closing
    setStep("phone");
    setPhone("");
    setOtp("");
    setName("");
    setError("");
    setConfirmationResult(null);
    setAuthType(initialType);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E2022] border border-[#C9D6DF]/20 rounded-2xl w-full max-w-md p-8 relative">
        {/* reCAPTCHA Container */}
        <div id="recaptcha-container"></div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#52616B]/20 transition-colors"
        >
          <svg className="w-5 h-5 text-[#C9D6DF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#F0F5F9] mb-2">
            {step === "phone"
              ? (authType === "signin" ? "Welcome Back" : "Join Us")
              : step === "name"
              ? "Complete Sign Up"
              : "Verify OTP"}
          </h2>
          <p className="text-[#C9D6DF]/60 text-sm">
            {step === "phone"
              ? "Enter your phone number to continue"
              : step === "name"
              ? "Tell us your name"
              : "Enter the OTP sent to your phone"}
          </p>

          {/* Auth Type Toggle */}
          {step === "phone" && (
            <div className="flex mt-4 bg-[#52616B]/20 rounded-lg p-1">
              <button
                onClick={() => {
                  setAuthType("signin");
                  setError("");
                  setStep("phone");
                  setPhone("");
                  setOtp("");
                  setName("");
                  setConfirmationResult(null);
                }}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  authType === "signin"
                    ? "bg-[#C9D6DF] text-[#111111]"
                    : "text-[#C9D6DF]/60 hover:text-[#C9D6DF]"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthType("signup");
                  setError("");
                  setStep("phone");
                  setPhone("");
                  setOtp("");
                  setName("");
                  setConfirmationResult(null);
                }}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  authType === "signup"
                    ? "bg-[#C9D6DF] text-[#111111]"
                    : "text-[#C9D6DF]/60 hover:text-[#C9D6DF]"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Phone Step */}
        {step === "phone" && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                required
              />
              <p className="text-[#C9D6DF]/40 text-xs mt-2">
                Include country code (e.g., +91 for India)
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </form>
        )}

        {/* Name Step */}
        {step === "name" && (
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div>
              <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? "Processing..." : "Continue to OTP"}
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="w-full px-4 py-3 bg-transparent border border-[#C9D6DF]/20 text-[#C9D6DF] rounded-lg font-semibold hover:bg-[#52616B]/10 transition-all duration-300"
            >
              Back
            </button>
          </form>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label className="block text-[#C9D6DF] text-sm font-medium mb-2">
                OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:border-[#C9D6DF]/50 focus:ring-1 focus:ring-[#C9D6DF]/20 transition-all tracking-widest text-center text-2xl font-semibold"
                required
              />
            </div>
            <p className="text-[#C9D6DF]/60 text-xs text-center">
              Didn't receive? {' '}
              <button 
                type="button" 
                onClick={handleResendOTP}
                disabled={loading}
                className="text-[#C9D6DF] hover:underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            </p>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full px-4 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="w-full px-4 py-3 bg-transparent border border-[#C9D6DF]/20 text-[#C9D6DF] rounded-lg font-semibold hover:bg-[#52616B]/10 transition-all duration-300"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};