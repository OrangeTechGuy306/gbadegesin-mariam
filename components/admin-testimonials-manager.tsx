'use client';

import * as React from 'react';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import { createTestimonialAction, updateTestimonialAction, deleteTestimonialAction } from '@/server/actions/testimonial';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const testimonialFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  company: z.string().min(2, 'Company must be at least 2 characters'),
  text: z.string().min(10, 'Recommendation text must be at least 10 characters'),
  rating: z.number().min(1).max(5),
  avatar: z.string().url('Please enter a valid avatar URL').optional().or(z.literal('')),
});

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;

interface AdminTestimonialsManagerProps {
  initialTestimonials: any[];
}

export function AdminTestimonialsManager({ initialTestimonials }: AdminTestimonialsManagerProps) {
  const [testimonials, setTestimonials] = React.useState(initialTestimonials);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [activeTestimonial, setActiveTestimonial] = React.useState<any | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
  });

  const openAddModal = () => {
    setActiveTestimonial(null);
    reset({
      id: '',
      name: '',
      role: '',
      company: '',
      text: '',
      rating: 5,
      avatar: '',
    });
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (t: any) => {
    setActiveTestimonial(t);
    reset({
      id: t._id,
      name: t.name,
      role: t.role,
      company: t.company,
      text: t.text,
      rating: t.rating || 5,
      avatar: t.avatar || '',
    });
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const onSubmit = async (values: TestimonialFormValues) => {
    setError(null);
    setSuccess(null);
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined) fd.append(k, v.toString());
    });

    const result = values.id
      ? await updateTestimonialAction(null, fd)
      : await createTestimonialAction(null, fd);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(result.success || 'Operation completed successfully!');
      setTimeout(() => {
        setIsModalOpen(false);
        window.location.reload();
      }, 800);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      const res = await deleteTestimonialAction(id);
      if (res.error) {
        alert(res.error);
      } else {
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <div className="flex justify-end">
        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-secondary/40 border-b border-border/30 text-muted-foreground font-semibold">
              <th className="p-4">Author</th>
              <th className="p-4">Company & Role</th>
              <th className="p-4">Review Text</th>
              <th className="p-4">Rating</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {testimonials.map((t) => (
              <tr key={t._id} className="hover:bg-secondary/15 transition-colors">
                <td className="p-4 font-bold text-foreground">{t.name}</td>
                <td className="p-4 text-muted-foreground">{t.role} at <span className="text-foreground font-medium">{t.company}</span></td>
                <td className="p-4 text-muted-foreground truncate max-w-[200px]">{t.text}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-0.5 text-amber-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(t)}
                    className="p-1.5 rounded hover:bg-secondary text-primary transition-colors inline-flex"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="p-1.5 rounded hover:bg-secondary text-destructive transition-colors inline-flex"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-3xl overflow-y-auto border border-border shadow-2xl flex flex-col p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-border/40 pb-4">
              <h3 className="text-sm font-bold text-foreground">{activeTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold">{error}</div>}
            {success && <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-semibold">{success}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Name</label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.name && <p className="text-[10px] text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Rating (1-5)</label>
                  <input
                    type="number"
                    {...register('rating', { valueAsNumber: true })}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.rating && <p className="text-[10px] text-red-500">{errors.rating.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Role</label>
                  <input
                    type="text"
                    {...register('role')}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.role && <p className="text-[10px] text-red-500">{errors.role.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Company</label>
                  <input
                    type="text"
                    {...register('company')}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.company && <p className="text-[10px] text-red-500">{errors.company.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Avatar URL</label>
                <input
                  type="text"
                  {...register('avatar')}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.avatar && <p className="text-[10px] text-red-500">{errors.avatar.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Recommendation Text</label>
                <textarea
                  rows={4}
                  {...register('text')}
                  className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.text && <p className="text-[10px] text-red-500">{errors.text.message}</p>}
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center space-x-1 shadow-md"
              >
                <span>{isSubmitting ? 'Saving...' : 'Save Testimonial'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
