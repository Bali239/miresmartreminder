import React from 'react';

export const Skeleton = ({ className = '', rounded = 'rounded-xl' }) => (
  <div className={`skeleton-shimmer ${rounded} ${className}`} aria-hidden="true" />
);

export const CardSkeleton = () => (
  <div className="glass-card p-5 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <div className="pt-2 flex items-center justify-between border-t border-white/[0.05]">
      <Skeleton className="h-4 w-24" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  </div>
);

export const StatSkeleton = () => (
  <div className="glass-card p-6 space-y-3">
    <div className="flex justify-between items-center">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-8 rounded-xl" />
    </div>
    <Skeleton className="h-8 w-16" />
    <Skeleton className="h-3 w-32" />
  </div>
);

export default Skeleton;
