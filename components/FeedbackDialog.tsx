"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface FeedbackQuestion {
  id: string;
  question: string;
  rating: number;
}

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ratings: Record<string, number>, comment?: string) => void;
  eventName?: string;
  isSubmitting?: boolean;
}

const questions = [
  {
    id: "overall",
    question: "How would you rate the overall event experience?",
  },
  {
    id: "organization",
    question: "How satisfied were you with the event organization?",
  },
  {
    id: "content",
    question: "How would you rate the event content and quality?",
  },
  {
    id: "recommendation",
    question: "How likely are you to recommend this event to others?",
  },
  {
    id: "value",
    question: "How would you rate the value for money?",
  },
];

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  eventName,
  isSubmitting = false,
}) => {
  const [feedback, setFeedback] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");

  const handleRatingChange = (questionId: string, rating: number) => {
    setFeedback(prev => ({
      ...prev,
      [questionId]: rating
    }));
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    const allAnswered = questions.every(q => feedback[q.id] !== undefined);
    if (!allAnswered) return;

    onSubmit(feedback, comment.trim() || undefined);
    // Reset form
    setFeedback({});
    setComment("");
  };

  const handleClose = () => {
    setFeedback({});
    setComment("");
    onClose();
  };

  const allQuestionsAnswered = questions.every(q => feedback[q.id] !== undefined);

  return (
    <>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #C9D6DF;
          cursor: pointer;
          border: 2px solid #1E2022;
          box-shadow: 0 0 0 2px #52616B;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #C9D6DF;
          cursor: pointer;
          border: 2px solid #1E2022;
          box-shadow: 0 0 0 2px #52616B;
        }
      `}</style>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
          <DialogTitle className="text-[#F0F5F9]">
            How was your experience?
          </DialogTitle>
          <DialogDescription className="text-[#C9D6DF]/60">
            {eventName
              ? `Please rate your experience at "${eventName}" before redeeming your coupon.`
              : "Please rate your experience before redeeming your coupon."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 max-h-96 overflow-y-auto">
          {/* Questions with Sliders */}
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="space-y-3">
                <label className="block text-sm font-medium text-[#C9D6DF]/90">
                  {index + 1}. {question.question}
                </label>

                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={feedback[question.id] || 1}
                    onChange={(e) => handleRatingChange(question.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-[#52616B]/30 rounded-lg appearance-none cursor-pointer slider"
                    disabled={isSubmitting}
                    style={{
                      background: `linear-gradient(to right, #C9D6DF 0%, #C9D6DF ${(feedback[question.id] || 1) * 10}%, #52616B ${(feedback[question.id] || 1) * 10}%, #52616B 100%)`
                    }}
                  />

                  <div className="flex justify-between text-xs text-[#C9D6DF]/60">
                    <span>1</span>
                    <span className="font-semibold text-[#C9D6DF]">
                      {feedback[question.id] || 1}/10
                    </span>
                    <span>10</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Optional Comment */}
          <div className="mt-6">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-[#C9D6DF]/80 mb-2"
            >
              Additional Comments (optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Any additional feedback about your experience..."
              className="w-full px-3 py-2 bg-[#52616B]/20 border border-[#C9D6DF]/20 rounded-lg text-[#F0F5F9] placeholder-[#C9D6DF]/40 focus:outline-none focus:ring-2 focus:ring-[#C9D6DF]/50 focus:border-transparent resize-none"
              rows={3}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-[#C9D6DF]/60 hover:text-[#F0F5F9] transition-colors duration-200 disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered || isSubmitting}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                Submitting...
              </>
            ) : (
              "Submit & Redeem"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default FeedbackDialog;