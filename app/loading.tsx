import * as React from 'react';

export default function RootLoading() {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col relative overflow-hidden animate-pulse">
      {/* Visual background overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent -z-10" />

      {/* 1. Header Navbar Skeleton */}
      <header className="h-16 border-b border-border/40 bg-card/60 backdrop-blur-md px-6 flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-secondary/80" />
          <div className="w-20 h-4 bg-secondary/80 rounded" />
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <div className="w-12 h-3 bg-secondary/80 rounded" />
          <div className="w-12 h-3 bg-secondary/80 rounded" />
          <div className="w-12 h-3 bg-secondary/80 rounded" />
          <div className="w-12 h-3 bg-secondary/80 rounded" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-lg bg-secondary/80" />
          <div className="w-20 h-8 rounded-lg bg-secondary/80" />
        </div>
      </header>

      {/* 2. Hero Section Skeleton */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-20 w-full flex flex-col items-center justify-center space-y-8">
        {/* Intro chip */}
        <div className="w-64 h-6 rounded-full bg-secondary/80" />

        {/* Headline lines */}
        <div className="space-y-3 w-full flex flex-col items-center">
          <div className="w-4/5 h-12 bg-secondary/80 rounded-2xl" />
          <div className="w-2/3 h-12 bg-secondary/80 rounded-2xl" />
        </div>

        {/* Paragraph description */}
        <div className="space-y-2 w-full flex flex-col items-center max-w-lg">
          <div className="w-full h-3.5 bg-secondary/80 rounded" />
          <div className="w-5/6 h-3.5 bg-secondary/80 rounded" />
          <div className="w-4/5 h-3.5 bg-secondary/80 rounded" />
        </div>

        {/* Actions buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
          <div className="w-full sm:w-36 h-12 rounded-xl bg-secondary/80" />
          <div className="w-full sm:w-44 h-12 rounded-xl bg-secondary/80" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-border/40 w-full max-w-4xl">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <div className="w-16 h-8 bg-secondary/80 rounded" />
              <div className="w-24 h-3 bg-secondary/60 rounded" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
