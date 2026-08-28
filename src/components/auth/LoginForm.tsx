'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginWithEmail } from '@/lib/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import GoogleSignIn from './GoogleSignIn';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credential = await loginWithEmail(email, password);
      const userDoc = await getDoc(doc(db, 'users', credential.user.uid));
      const role = userDoc.exists() ? userDoc.data().role : null;

      toast.success('Welcome back! Loading...');
      if (role === 'customer') {
        router.push('/shop');
      } else {
        router.push('/');
      }
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      const code = firebaseError.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else if (code === 'auth/user-disabled') {
        setError('This account has been disabled.');
      } else {
        setError('Something went wrong. Please try again.');
      }
      setLoading(false);
    }
  };

  const inputClass = 'w-full pl-10 pr-3 py-2.5 text-sm rounded-xl outline-none transition-all duration-200 placeholder:text-[#a89279]';
  const inputStyle = { background: 'rgba(74,55,40,0.04)', border: '1.5px solid rgba(74,55,40,0.1)', color: '#2d1f14' };
  const inputFocusClass = 'focus:border-[#8b6914] focus:ring-2 focus:ring-[#8b6914]/10';

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold" style={{ color: '#2d1f14' }}>Welcome Back</h2>
        <p className="text-sm mt-1" style={{ color: '#8b7355' }}>Sign in to manage your store intelligently.</p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', color: '#b91c1c' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium mb-1.5" style={{ color: '#4a3728' }}>Email address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#a89279' }} />
            <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" className={`${inputClass} ${inputFocusClass}`} style={inputStyle} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="block text-sm font-medium" style={{ color: '#4a3728' }}>Password</label>
            <Link href="/forgot-password" className="text-xs font-medium transition-colors hover:underline" style={{ color: '#8b6914' }}>Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#a89279' }} />
            <input id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required minLength={6} autoComplete="current-password" className={`${inputClass} ${inputFocusClass} !pr-10`} style={inputStyle} />
            <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: '#a89279' }}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input id="remember" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded" style={{ accentColor: '#8b6914' }} />
          <label htmlFor="remember" className="text-sm" style={{ color: '#8b7355' }}>Remember me</label>
        </div>

        <button type="submit" disabled={loading} className="w-full py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #4a3728 0%, #6b4f38 100%)' }}>
          {loading ? (<><Loader2 size={16} className="animate-spin" /> Signing in...</>) : 'Sign In'}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full" style={{ borderTop: '1px solid rgba(74,55,40,0.1)' }} /></div>
        <div className="relative flex justify-center"><span className="px-3 text-xs" style={{ background: 'rgba(255,255,255,0.85)', color: '#a89279' }}>OR</span></div>
      </div>

      <GoogleSignIn />

      <p className="text-center text-sm" style={{ color: '#8b7355' }}>
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold transition-colors hover:underline" style={{ color: '#6b4f38' }}>Create account</Link>
      </p>
    </div>
  );
}
