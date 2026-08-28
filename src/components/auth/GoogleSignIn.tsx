'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithGoogle } from '@/lib/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function GoogleSignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const credential = await loginWithGoogle();
      const userDoc = await getDoc(doc(db, 'users', credential.user.uid));

      if (userDoc.exists()) {
        const role = userDoc.data().role;
        toast.success('Welcome back!');
        router.push(role === 'customer' ? '/shop' : '/');
      } else {
        // New Google user - needs to complete profile
        router.push('/complete-profile');
      }
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      if (firebaseError.code !== 'auth/popup-closed-by-user') {
        toast.error('Google sign-in failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="w-full py-2.5 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-md active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-3"
      style={{ background: 'rgba(74,55,40,0.04)', border: '1.5px solid rgba(74,55,40,0.12)', color: '#4a3728' }}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#34A853" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#FBBC05" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
      )}
      Continue with Google
    </button>
  );
}
