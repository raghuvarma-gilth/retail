'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Store, ShoppingBag, MapPin, Loader2 } from 'lucide-react';

const SHOP_TYPES = [
  { value: 'grocery', label: 'Grocery Store' },
  { value: 'pharmacy', label: 'Pharmacy / Medical Store' },
  { value: 'bakery', label: 'Bakery / Food Store' },
  { value: 'general', label: 'General / Daily Essentials' },
];

export default function CompleteProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<'owner' | 'customer'>('customer');
  const [shopName, setShopName] = useState('');
  const [shopType, setShopType] = useState('grocery');
  const [shopLocation, setShopLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (role === 'owner' && !shopName.trim()) { toast.error('Shop name is required.'); return; }

    setLoading(true);
    try {
      if (role === 'owner') {
        const shopRef = await addDoc(collection(db, 'shops'), {
          ownerId: user.uid,
          shopName: shopName.trim(),
          shopType,
          location: shopLocation.trim(),
          description: '',
          createdAt: new Date().toISOString(),
        });
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName || '',
          email: user.email || '',
          role: 'owner',
          shopId: shopRef.id,
          createdAt: new Date().toISOString(),
        });
        toast.success('Shop created! Redirecting...');
        router.push('/');
      } else {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName || '',
          email: user.email || '',
          role: 'customer',
          createdAt: new Date().toISOString(),
        });
        toast.success('Profile complete! Redirecting...');
        router.push('/shop');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full pl-10 pr-3 py-2.5 text-sm rounded-xl outline-none transition-all duration-200 placeholder:text-[#a89279] focus:border-[#8b6914] focus:ring-2 focus:ring-[#8b6914]/10';
  const inputStyle = { background: 'rgba(74,55,40,0.04)', border: '1.5px solid rgba(74,55,40,0.1)', color: '#2d1f14' };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #f5f0eb 0%, #e8ddd3 100%)' }}>
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)' }}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#2d1f14' }}>Complete Your Profile</h2>
          <p className="text-sm mt-1" style={{ color: '#8b7355' }}>Tell us how you will use Retail Intelligence.</p>
        </div>

        {/* Role Selector */}
        <div className="flex gap-2 mb-6">
          {[
            { val: 'customer' as const, label: 'Customer', icon: <ShoppingBag size={14} /> },
            { val: 'owner' as const, label: 'Shop Owner', icon: <Store size={14} /> },
          ].map((r) => (
            <button
              key={r.val}
              type="button"
              onClick={() => setRole(r.val)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-200`}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {role === 'owner' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#4a3728' }}>Shop name</label>
                <div className="relative">
                  <Store size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#a89279' }} />
                  <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="Your shop name" required className={inputClass} style={inputStyle} />
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
                    <input type="text" value={shopLocation} onChange={(e) => setShopLocation(e.target.value)} placeholder="City, State" className={inputClass} style={inputStyle} />
                  </div>
                </div>
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="w-full py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #4a3728 0%, #6b4f38 100%)' }}>
            {loading ? (<><Loader2 size={16} className="animate-spin" /> Saving...</>) : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
