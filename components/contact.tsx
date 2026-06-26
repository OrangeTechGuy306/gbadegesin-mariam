'use client';

import * as React from 'react';
import { Mail, MapPin, Calendar, CheckCircle2, ArrowRight, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { submitMessageAction } from '@/server/actions/message';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(3, { message: 'Subject must be at least 3 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function Contact() {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setLoading(true);
    const fd = new FormData();
    fd.append('name', data.name);
    fd.append('email', data.email);
    fd.append('subject', data.subject);
    fd.append('message', data.message);

    const res = await submitMessageAction(null, fd);
    setLoading(false);
    if (res.error) {
      alert(res.error || 'An error occurred.');
    } else {
      setIsSuccess(true);
      reset();
    }
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">Get in touch</span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Contact Me</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Have an opening, an interesting project, or want to discuss analytics modeling? Feel free to drop a message or schedule a direct video session!
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <div className="p-2.5 rounded-lg bg-secondary text-primary">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Email Address</h4>
                <p>mariamgbadegesin15@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <div className="p-2.5 rounded-lg bg-secondary text-primary">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Mobile Numbers</h4>
                <p>+2349057589271, +2347018313016</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <div className="p-2.5 rounded-lg bg-secondary text-primary">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Location</h4>
                <p>Lagos, Nigeria</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <div className="p-2.5 rounded-lg bg-secondary text-primary">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Direct Consultation</h4>
                <a href="https://cal.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold flex items-center mt-0.5">
                  <span>Schedule via Cal.com</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          </div>

          {/* Availability Status */}
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 max-w-sm flex items-center space-x-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Currently accepting strategic consulting client positions
            </span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 bg-card border border-border/40 p-6 sm:p-8 rounded-3xl shadow-sm glass-card">
          {isSuccess ? (
            <div className="text-center py-12 space-y-4">
              <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Message Sent Successfully!</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Thank you for reaching out. Gbade will review your message and reply via email within 24 hours.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-secondary hover:bg-border text-foreground transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-[10px] font-bold text-foreground uppercase tracking-wider">Your Name</label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className="w-full px-3.5 py-2.5 border border-border/60 rounded-xl bg-secondary/10 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.name && <p className="text-[10px] text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-[10px] font-bold text-foreground uppercase tracking-wider">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="w-full px-3.5 py-2.5 border border-border/60 rounded-xl bg-secondary/10 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.email && <p className="text-[10px] text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="subject" className="text-[10px] font-bold text-foreground uppercase tracking-wider">Subject</label>
                <input
                  id="subject"
                  type="text"
                  {...register('subject')}
                  className="w-full px-3.5 py-2.5 border border-border/60 rounded-xl bg-secondary/10 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.subject && <p className="text-[10px] text-red-500">{errors.subject.message}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="text-[10px] font-bold text-foreground uppercase tracking-wider">Your Message</label>
                <textarea
                  id="message"
                  rows={5}
                  {...register('message')}
                  className="w-full px-3.5 py-2.5 border border-border/60 rounded-xl bg-secondary/10 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.message && <p className="text-[10px] text-red-500">{errors.message.message}</p>}
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center space-x-1.5 shadow-md"
              >
                {loading ? (
                  <span>Sending Message...</span>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
