'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthChange } from '@/lib/auth';
import { db } from '@/lib/firebase';

export type UserRole = 'owner' | 'customer' | null;

interface AuthContextType {
  user: User | null;
  role: UserRole;
  shopId: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, role: null, shopId: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [shopId, setShopId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety timeout - never show loading for more than 3 seconds
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setRole(data.role || null);
            setShopId(data.shopId || null);
          } else {
            setRole(null);
            setShopId(null);
          }
        } catch {
          setRole(null);
          setShopId(null);
        }
      } else {
        setRole(null);
        setShopId(null);
      }
      setLoading(false);
    });
    return () => { unsubscribe(); clearTimeout(timeout); };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, shopId, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
