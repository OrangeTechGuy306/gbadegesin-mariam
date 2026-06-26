import * as React from 'react';

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* 1. Header Skeleton */}
      <div className="space-y-2">
        <div className="h-6 w-48 bg-secondary/80 rounded-lg" />
        <div className="h-3.5 w-80 bg-secondary/60 rounded" />
      </div>

      {/* 2. KPI Cards Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-card border border-border/40 shadow-sm flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-3 w-24 bg-secondary/60 rounded" />
              <div className="h-7 w-12 bg-secondary/80 rounded-lg" />
            </div>
            <div className="w-11 h-11 rounded-xl bg-secondary/40 flex-shrink-0 ml-4" />
          </div>
        ))}
      </div>

      {/* 3. Content Panel Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large visual panel (Chart placeholder) */}
        <div className="lg:col-span-8 bg-card border border-border/40 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="h-4 w-48 bg-secondary/80 rounded" />
          <div className="h-64 bg-secondary/20 rounded-xl w-full" />
        </div>

        {/* Small stats/list panel (Geo breakdown placeholder) */}
        <div className="lg:col-span-4 bg-card border border-border/40 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="h-4 w-36 bg-secondary/80 rounded" />
          <div className="divide-y divide-border/20 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center pt-3 first:pt-0">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-secondary/80 rounded-full" />
                  <div className="h-3.5 w-24 bg-secondary/60 rounded" />
                </div>
                <div className="h-3.5 w-12 bg-secondary/80 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
