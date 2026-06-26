import * as React from 'react';

export default function BlogDetailLoading() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-secondary/5 animate-pulse">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation back button skeleton */}
        <div className="flex justify-between items-center">
          <div className="w-24 h-4 bg-secondary rounded" />
          <div className="w-16 h-8 bg-secondary rounded-lg" />
        </div>

        {/* Article Container Skeleton */}
        <article className="bg-card border border-border/40 rounded-3xl overflow-hidden shadow-xl glass-card">
          {/* Cover image skeleton */}
          <div className="h-48 sm:h-72 w-full bg-secondary" />

          <div className="p-6 sm:p-10 space-y-6">
            {/* Metadata headers skeleton */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-20 h-5 bg-secondary rounded" />
                <div className="w-12 h-4 bg-secondary rounded" />
                <div className="w-12 h-4 bg-secondary rounded" />
              </div>

              <div className="w-full h-8 bg-secondary rounded-lg" />
              <div className="w-3/4 h-8 bg-secondary rounded-lg" />

              <div className="flex items-center gap-4 pt-1.5 border-t border-border/10 w-2/3">
                <div className="w-20 h-3 bg-secondary rounded" />
                <div className="w-16 h-3 bg-secondary rounded" />
                <div className="w-16 h-3 bg-secondary rounded" />
              </div>
            </div>

            {/* Paragraph lines skeleton */}
            <div className="space-y-3 pt-4 border-t border-border/20">
              <div className="w-full h-4 bg-secondary rounded" />
              <div className="w-full h-4 bg-secondary rounded" />
              <div className="w-5/6 h-4 bg-secondary rounded" />
              <div className="w-full h-4 bg-secondary rounded" />
              <div className="w-4/5 h-4 bg-secondary rounded" />
              <div className="w-full h-4 bg-secondary rounded" />
              <div className="w-2/3 h-4 bg-secondary rounded" />
            </div>

            {/* Social Share Toolbar skeleton */}
            <div className="flex items-center justify-between pt-6 border-t border-border/20">
              <div className="w-24 h-9 bg-secondary rounded-xl" />
              <div className="flex space-x-2.5">
                <div className="w-8 h-8 bg-secondary rounded-lg" />
                <div className="w-8 h-8 bg-secondary rounded-lg" />
                <div className="w-8 h-8 bg-secondary rounded-lg" />
              </div>
            </div>
          </div>
        </article>

        {/* Comment Section Panel skeleton */}
        <section className="bg-card border border-border/40 p-6 sm:p-8 rounded-3xl shadow-lg space-y-6 glass-card">
          <div className="w-32 h-5 bg-secondary rounded border-b border-border/20 pb-3" />
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-secondary/20 border border-border/20 space-y-2">
              <div className="w-1/4 h-3 bg-secondary rounded" />
              <div className="w-full h-3 bg-secondary rounded" />
              <div className="w-5/6 h-3 bg-secondary rounded" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
