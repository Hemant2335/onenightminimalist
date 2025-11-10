"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner = ({ 
  size = "md", 
  text,
  fullScreen = false 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const containerClass = fullScreen
    ? "min-h-screen bg-[#111111] flex flex-col items-center justify-center"
    : "flex flex-col items-center justify-center py-8";

  return (
    <div className={containerClass}>
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

