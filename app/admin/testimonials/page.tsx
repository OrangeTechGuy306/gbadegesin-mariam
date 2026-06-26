import * as React from 'react';
import connectDB from '@/lib/db';
import Testimonial from '@/models/testimonial';
import { AdminTestimonialsManager } from '@/components/admin-testimonials-manager';

async function getTestimonials() {
  try {
    await connectDB();
    const list = await Testimonial.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(list));
  } catch (err) {
    console.error('Failed to query testimonials:', err);
    return [];
  }
}

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Testimonials Manager</h1>
        <p className="text-xs text-muted-foreground mt-1">
          CRUD panels for client recommendations, adjust rating stars, and customize profiles.
        </p>
      </div>

      <AdminTestimonialsManager initialTestimonials={testimonials} />
    </div>
  );
}
