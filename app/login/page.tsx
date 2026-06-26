'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { loginAction } from '@/server/actions/auth';
import { Database, Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/15 px-4 py-12 sm:px-6 lg:px-8">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent -z-10" />

      <div className="max-w-md w-full space-y-8 bg-card border border-border/40 p-8 rounded-3xl shadow-xl glass-card relative overflow-hidden">
        {/* Top visual glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Database className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Admin Portal</h2>
          <p className="text-xs text-muted-foreground">
            Sign in to manage portfolio content, monitor metrics, and check logs.
          </p>
        </div>

        {/* Error Callout */}
        {state?.error && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Login Form */}
        <form action={formAction} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-[10px] font-bold text-foreground uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@gbadegesin.com"
                className="w-full pl-10 pr-4 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-[10px] font-bold text-foreground uppercase tracking-wider">Password</label>
              <Link href="#" className="text-[10px] text-primary hover:underline font-semibold">Forgot Password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Remember me and secure disclaimer */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5" />
              <span>Remember this session</span>
            </label>
            <span className="flex items-center text-primary font-medium">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Stateless JWT Cookie
            </span>
          </div>

          {/* Submit */}
          <button
            disabled={pending}
            type="submit"
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center space-x-1.5 shadow-md shadow-primary/10"
          >
            {pending ? (
              <span>Authenticating...</span>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Return to public portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
