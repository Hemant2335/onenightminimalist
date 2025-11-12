"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  overlay?: boolean;
}

export const LoadingSpinner = ({
  size = "md",
  text,
  overlay = false,
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
        <div className="relative">
          <div
            className={`${sizeClasses[size]} border-4 border-[#52616B]/20 border-t-[#C9D6DF] rounded-full animate-spin`}
          ></div>
          <div
            className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-r-[#C9D6DF]/50 rounded-full animate-spin`}
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>
        {text && (
          <p className="mt-4 text-[#C9D6DF]/60 text-sm font-medium">{text}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-4 border-[#52616B]/20 border-t-[#C9D6DF] rounded-full animate-spin`}
        ></div>
        <div
          className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-r-[#C9D6DF]/50 rounded-full animate-spin`}
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        ></div>
      </div>
      {text && (
        <p className="mt-4 text-[#C9D6DF]/60 text-sm font-medium">{text}</p>
      )}
    </div>
  );
};

