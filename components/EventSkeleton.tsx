"use client";

export const EventSkeleton = () => {
  return (
    <div className="rounded-lg p-6 backdrop-blur-sm border border-[#C9D6DF]/15 bg-[#52616B]/10 animate-pulse">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex-1 min-w-0 space-y-3">
          {/* Date and Badge */}
          <div className="flex items-center gap-3">
            <div className="h-5 w-24 bg-[#52616B]/30 rounded-md"></div>
            <div className="h-5 w-16 bg-[#52616B]/30 rounded-md"></div>
          </div>
          {/* Title */}
          <div className="h-6 w-3/4 bg-[#52616B]/30 rounded-md"></div>
          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-[#52616B]/30 rounded-md"></div>
            <div className="h-4 w-5/6 bg-[#52616B]/30 rounded-md"></div>
          </div>
          {/* Ticket Info */}
          <div className="h-4 w-48 bg-[#52616B]/30 rounded-md"></div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Status Badge */}
          <div className="h-8 w-24 bg-[#52616B]/30 rounded-md"></div>
          {/* Buttons */}
          <div className="h-10 w-28 bg-[#52616B]/30 rounded-lg"></div>
          <div className="h-10 w-32 bg-[#52616B]/30 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export const EventSkeletonGrid = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <EventSkeleton key={index} />
      ))}
    </div>
  );
};

