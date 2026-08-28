'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/auth';
import { toast } from 'sonner';
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSent(true);
      toast.success('Password reset email sent!');
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      const code = firebaseError.code || '';
      if (code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-5 text-center">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.1)' }}>
            <CheckCircle2 size={28} style={{ color: '#16a34a' }} />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#2d1f14' }}>Check Your Email</h2>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: '#8b7355' }}>
            We have sent a password reset link to <strong style={{ color: '#4a3728' }}>{email}</strong>. Please check your inbox and follow the instructions.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:underline"
          style={{ color: '#6b4f38' }}
        >
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold" style={{ color: '#2d1f14' }}>Forgot Password?</h2>
        <p className="text-sm mt-1 leading-relaxed" style={{ color: '#8b7355' }}>
          Enter the email address associated with your account and we will send you a link to reset your password.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', color: '#b91c1c' }}>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium mb-1.5" style={{ color: '#4a3728' }}>
            Email address
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#a89279' }} />
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl outline-none transition-all duration-200 placeholder:text-[#a89279] focus:border-[#8b6914] focus:ring-2 focus:ring-[#8b6914]/10"
              style={{
                background: 'rgba(74,55,40,0.04)',
                border: '1.5px solid rgba(74,55,40,0.1)',
                color: '#2d1f14',
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #4a3728 0%, #6b4f38 100%)',
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending...
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      {/* Back to login */}
      <p className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:underline"
          style={{ color: '#6b4f38' }}
        >
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>
      </p>
    </div>
  );
}
