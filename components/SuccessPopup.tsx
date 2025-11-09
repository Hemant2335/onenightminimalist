"use client";

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  title?: string;
}

export const SuccessPopup = ({ 
  isOpen, 
  onClose, 
  message = "Ticket Booked Successfully!",
  title = "Success"
}: SuccessPopupProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E2022] border border-[#C9D6DF]/20 rounded-2xl w-full max-w-md p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#52616B]/20 transition-colors"
        >
          <svg className="w-5 h-5 text-[#C9D6DF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-[#F0F5F9] mb-2">
            {title}
          </h2>
          <p className="text-[#C9D6DF]/60 text-sm">
            {message}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-[#C9D6DF] text-[#111111] rounded-lg font-semibold hover:bg-[#F0F5F9] transition-all duration-300"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

