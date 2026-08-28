'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerWithEmail } from '@/lib/auth';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, Mail, Lock, User, Store, MapPin, ShoppingBag } from 'lucide-react';
import GoogleSignIn from './GoogleSignIn';

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Weak', color: '#dc2626' };
  if (score <= 2) return { score, label: 'Fair', color: '#d97706' };
  if (score <= 3) return { score, label: 'Good', color: '#8b6914' };
  return { score, label: 'Strong', color: '#16a34a' };
}

const SHOP_TYPES = [
  { value: 'grocery', label: 'Grocery Store' },
  { value: 'pharmacy', label: 'Pharmacy / Medical Store' },
  { value: 'bakery', label: 'Bakery / Food Store' },
  { value: 'general', label: 'General / Daily Essentials' },
];

export default function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<'owner' | 'customer'>('customer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Owner-specific fields
  const [shopName, setShopName] = useState('');
  const [shopType, setShopType] = useState('grocery');
  const [shopLocation, setShopLocation] = useState('');

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (role === 'owner' && !shopName.trim()) { setError('Shop name is required.'); return; }

    setLoading(true);
    try {
      const credential = await registerWithEmail(email, password, fullName);
      const uid = credential.user.uid;

      if (role === 'owner') {
        const shopRef = await addDoc(collection(db, 'shops'), {
          ownerId: uid,
          shopName: shopName.trim(),
          shopType,
          location: shopLocation.trim(),
          description: '',
          createdAt: new Date().toISOString(),
        });
        await setDoc(doc(db, 'users', uid), {
          name: fullName.trim(),
          email,
          role: 'owner',
          shopId: shopRef.id,
          createdAt: new Date().toISOString(),
        });
        toast.success('Shop created! Redirecting to dashboard...');
        router.push('/');
      } else {
        await setDoc(doc(db, 'users', uid), {
          name: fullName.trim(),
          email,
          role: 'customer',
          createdAt: new Date().toISOString(),
        });
        toast.success('Account created! Redirecting...');
        router.push('/shop');
      }
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      const code = firebaseError.code || '';
      if (code === 'auth/email-already-in-use') setError('An account with this email already exists.');
      else if (code === 'auth/weak-password') setError('Password is too weak. Use at least 6 characters.');
      else if (code === 'auth/invalid-email') setError('Please enter a valid email address.');
      else setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const inputClass = 'w-full pl-10 pr-3 py-2.5 text-sm rounded-xl outline-none transition-all duration-200 placeholder:text-[#a89279]';
  const inputStyle = { background: 'rgba(74,55,40,0.04)', border: '1.5px solid rgba(74,55,40,0.1)', color: '#2d1f14' };
  const inputFocusClass = 'focus:border-[#8b6914] focus:ring-2 focus:ring-[#8b6914]/10';

  return (
    <div className="space-y-3">
      <div className="text-center">
        <h2 className="text-2xl font-bold" style={{ color: '#2d1f14' }}>Create Your Account</h2>
        <p className="text-sm mt-1" style={{ color: '#8b7355' }}>Start making smarter retail decisions.</p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', color: '#b91c1c' }}>
          {error}
        </div>
      )}

      {/* Role Selector */}
      <div className="flex gap-2">
        {[
          { val: 'customer' as const, label: 'Customer', icon: <ShoppingBag size={14} /> },
          { val: 'owner' as const, label: 'Shop Owner', icon: <Store size={14} /> },
        ].map((r) => (
          <button
            key={r.val}
            type="button"
            onClick={() => setRole(r.val)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
              role === r.val ? 'text-white shadow-md' : ''
            }`}
            style={{
              background: role === r.val ? 'linear-gradient(135deg, #4a3728 0%, #6b4f38 100%)' : 'rgba(74,55,40,0.04)',
              border: role === r.val ? 'none' : '1.5px solid rgba(74,55,40,0.1)',
              color: role === r.val ? '#fff' : '#8b7355',
            }}
          >
            {r.icon} {r.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#4a3728' }}>Full name</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#a89279' }} />
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" required minLength={2} autoComplete="name" className={`${inputClass} ${inputFocusClass}`} style={inputStyle} />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#4a3728' }}>Email address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#a89279' }} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" className={`${inputClass} ${inputFocusClass}`} style={inputStyle} />
          </div>
        </div>

        {/* Owner-specific fields */}
        {role === 'owner' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#4a3728' }}>Shop name</label>
              <div className="relative">
                <Store size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#a89279' }} />
                <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="Your shop name" required className={`${inputClass} ${inputFocusClass}`} style={inputStyle} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#4a3728' }}>Shop type</label>
                <select value={shopType} onChange={(e) => setShopType(e.target.value)} className="w-full py-2.5 px-3 text-sm rounded-xl outline-none" style={{ ...inputStyle, appearance: 'auto' }}>
                  {SHOP_TYPES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#4a3728' }}>Location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#a89279' }} />
                  <input type="text" value={shopLocation} onChange={(e) => setShopLocation(e.target.value)} placeholder="City, State" className={`${inputClass} ${inputFocusClass}`} style={inputStyle} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#4a3728' }}>Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#a89279' }} />
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" required minLength={6} autoComplete="new-password" className={`${inputClass} ${inputFocusClass} !pr-10`} style={inputStyle} />
            <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#a89279' }}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {password.length > 0 && (
            <div className="mt-1.5 space-y-1">
              <div className="flex gap-1">{[1, 2, 3, 4, 5].map((i) => (<div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ background: i <= strength.score ? strength.color : 'rgba(74,55,40,0.1)' }} />))}</div>
              <p className="text-xs font-medium" style={{ color: strength.color }}>{strength.label}</p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#4a3728' }}>Confirm password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#a89279' }} />
            <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat your password" required autoComplete="new-password" className={`${inputClass} ${inputFocusClass} !pr-10`} style={inputStyle} />
            <button type="button" onClick={() => setShowConfirm((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#a89279' }}>
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {confirmPassword.length > 0 && confirmPassword !== password && (
            <p className="text-xs mt-1" style={{ color: '#dc2626' }}>Passwords do not match</p>
          )}
        </div>

        <button type="submit" disabled={loading} className="w-full py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #4a3728 0%, #6b4f38 100%)' }}>
          {loading ? (<><Loader2 size={16} className="animate-spin" /> Creating account...</>) : 'Create Account'}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full" style={{ borderTop: '1px solid rgba(74,55,40,0.1)' }} /></div>
        <div className="relative flex justify-center"><span className="px-3 text-xs" style={{ background: 'rgba(255,255,255,0.85)', color: '#a89279' }}>OR</span></div>
      </div>

      <GoogleSignIn />

      <p className="text-center text-sm" style={{ color: '#8b7355' }}>
        Already have an account?{' '}
        <Link href="/login" className="font-semibold transition-colors hover:underline" style={{ color: '#6b4f38' }}>Sign in</Link>
      </p>
    </div>
  );
}
