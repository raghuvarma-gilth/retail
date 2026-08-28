'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { Store, MapPin, ArrowLeft, Loader2 } from 'lucide-react';

interface Shop {
  id: string;
  shopName: string;
  shopType: string;
  location: string;
  description: string;
}

const TYPE_LABELS: Record<string, string> = {
  grocery: 'Grocery Stores',
  pharmacy: 'Pharmacy / Medical Stores',
  bakery: 'Bakery / Food Stores',
  general: 'General / Daily Essentials Stores',
};

export default function ShopListPage() {
  const params = useParams();
  const shopType = params.type as string;
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShops() {
      try {
        const q = query(collection(db, 'shops'), where('shopType', '==', shopType));
        const snapshot = await getDocs(q);
        const results: Shop[] = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() } as Shop);
        });
        setShops(results);
      } catch (err) {
        console.error('Error fetching shops:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchShops();
  }, [shopType]);

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <CustomerLayout>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Link href="/shop" className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">{TYPE_LABELS[shopType] || 'Shops'}</h1>
              <p className="text-sm text-muted-foreground">Select a store to start shopping.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : shops.length === 0 ? (
            <div className="text-center py-16">
              <Store size={40} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">No shops available yet</p>
              <p className="text-xs text-muted-foreground mt-1">Check back later for new stores in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shops.map((shop) => (
                <Link
                  key={shop.id}
                  href={`/shop/${shopType}/${shop.id}`}
                  className="card-elevated p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Store size={18} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground">{shop.shopName}</h3>
                      {shop.location && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin size={12} className="text-muted-foreground shrink-0" />
                          <p className="text-xs text-muted-foreground truncate">{shop.location}</p>
                        </div>
                      )}
                      {shop.description && (
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{shop.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </CustomerLayout>
    </ProtectedRoute>
  );
}
