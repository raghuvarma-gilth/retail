'use client';
import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingBag, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  customerName: string;
  totalAmount: number;
  totalItems: number;
  orderStatus: string;
  createdAt: string;
}

const statusColor: Record<string, string> = {
  PLACED: 'bg-info/10 text-info',
  CONFIRMED: 'bg-primary/10 text-primary',
  PROCESSING: 'bg-warning/10 text-warning',
  READY: 'bg-success/10 text-success',
  COMPLETED: 'bg-success/10 text-success',
  CANCELLED: 'bg-danger/10 text-danger',
};

export default function RecentOrders() {
  const { shopId } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!shopId) return;
    const q = query(collection(db, 'orders'), where('shopId', '==', shopId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: Order[] = [];
      snapshot.forEach((d) => results.push({ id: d.id, ...d.data() } as Order));
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(results.slice(0, 5));
    });
    return () => unsubscribe();
  }, [shopId]);

  if (orders.length === 0) return null;

  return (
    <div className="card-elevated p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag size={18} className="text-primary" />
          <h2 className="text-base font-semibold text-foreground">Recent Customer Orders</h2>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{orders.length}</span>
        </div>
        <Link href="/owner-orders" className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
          View All <ArrowRight size={12} />
        </Link>
      </div>
      <div className="space-y-2">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{order.customerName || 'Customer'}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <Clock size={10} />
                <span>{new Date(order.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                <span>·</span>
                <span>{order.totalItems} items</span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm font-bold text-foreground">₹{order.totalAmount}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[order.orderStatus] || 'bg-muted text-muted-foreground'}`}>
                {order.orderStatus}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
