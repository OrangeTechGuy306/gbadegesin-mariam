'use client';

import * as React from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
}

interface TestimonialsProps {
  initialTestimonials?: Testimonial[];
}

export function Testimonials({ initialTestimonials }: TestimonialsProps) {
  const mockTestimonials = initialTestimonials || [];
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % mockTestimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + mockTestimonials.length) % mockTestimonials.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % mockTestimonials.length);
  };

  const current = mockTestimonials[index];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-border/20 text-center relative overflow-hidden">
      <div className="absolute top-10 left-10 text-primary/10 -z-10">
        <Quote className="w-32 h-32 rotate-180" />
      </div>

      <div className="space-y-6">
        <span className="text-xs font-bold text-primary tracking-widest uppercase">Testimonials</span>
        
        {/* Animated Container */}
        <div className="min-h-[220px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Stars */}
              <div className="flex justify-center space-x-1">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star key={i} className="w-4.5 h-4.5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed italic max-w-2xl mx-auto">
                "{current.text}"
              </p>

              {/* Author */}
              <div>
                <h4 className="text-sm font-bold text-foreground">{current.name}</h4>
                <p className="text-xs text-muted-foreground">{current.role} • {current.company}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel controls */}
        <div className="flex justify-center items-center space-x-3 pt-6">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full border border-border bg-card hover:bg-secondary text-foreground transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex space-x-1.5">
            {mockTestimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === i ? 'bg-primary w-4' : 'bg-muted/40'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="p-2 rounded-full border border-border bg-card hover:bg-secondary text-foreground transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
