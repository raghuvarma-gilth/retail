'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { ClipboardList, Loader2, Package, Clock } from 'lucide-react';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  shopName: string;
  items: OrderItem[];
  totalAmount: number;
  totalItems: number;
  orderStatus: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  PLACED: { bg: 'bg-info/10', text: 'text-info' },
  CONFIRMED: { bg: 'bg-primary/10', text: 'text-primary' },
  PROCESSING: { bg: 'bg-warning/10', text: 'text-warning' },
  READY: { bg: 'bg-success/10', text: 'text-success' },
  COMPLETED: { bg: 'bg-success/10', text: 'text-success' },
  CANCELLED: { bg: 'bg-danger/10', text: 'text-danger' },
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'orders'), where('customerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: Order[] = [];
      snapshot.forEach((doc) => results.push({ id: doc.id, ...doc.data() } as Order));
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(results);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <CustomerLayout>
        <div className="space-y-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">My Orders</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Track your order status in real-time.</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-primary" /></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <ClipboardList size={40} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">No orders yet</p>
              <p className="text-xs text-muted-foreground mt-1">Place your first order to see it here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const style = STATUS_STYLES[order.orderStatus] || STATUS_STYLES.PLACED;
                return (
                  <div key={order.id} className="card-elevated p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Order #{order.id.slice(-6).toUpperCase()}</p>
                        <p className="text-sm font-semibold text-foreground">{order.shopName}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${style.bg} ${style.text}`}>
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="space-y-1.5 border-t border-border pt-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Package size={12} className="text-muted-foreground" />
                            <span className="text-foreground">{item.productName}</span>
                            <span className="text-muted-foreground">x{item.quantity}</span>
                          </div>
                          <span className="text-foreground font-medium">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={12} />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <p className="text-sm font-bold text-foreground">Total: ₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CustomerLayout>
    </ProtectedRoute>
  );
}
