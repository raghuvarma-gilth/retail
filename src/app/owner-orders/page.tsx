'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { ClipboardList, Loader2, Package, Clock, ChevronDown, User, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  shopName: string;
  items: OrderItem[];
  totalAmount: number;
  totalItems: number;
  orderStatus: string;
  createdAt: string;
}

const STATUS_FLOW = ['PLACED', 'CONFIRMED', 'PROCESSING', 'READY', 'COMPLETED'];
const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  PLACED: { bg: 'bg-info/10', text: 'text-info', border: 'border-info/30' },
  CONFIRMED: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' },
  PROCESSING: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' },
  READY: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30' },
  COMPLETED: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30' },
  CANCELLED: { bg: 'bg-danger/10', text: 'text-danger', border: 'border-danger/30' },
};

export default function OwnerOrdersPage() {
  const { user, shopId } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    if (!shopId) { setLoading(false); return; }
    const q = query(collection(db, 'orders'), where('shopId', '==', shopId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: Order[] = [];
      snapshot.forEach((d) => results.push({ id: d.id, ...d.data() } as Order));
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(results);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [shopId]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { orderStatus: newStatus });
      toast.success(`Order updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { orderStatus: 'CANCELLED' });
      toast.success('Order cancelled');
    } catch (err) {
      toast.error('Failed to cancel order');
    }
  };

  const filteredOrders = filter === 'ALL' ? orders : orders.filter((o) => o.orderStatus === filter);
  const pendingCount = orders.filter((o) => o.orderStatus === 'PLACED').length;

  return (
    <ProtectedRoute allowedRoles={['owner']}>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Customer Orders</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {pendingCount > 0 ? `${pendingCount} new order${pendingCount > 1 ? 's' : ''} awaiting confirmation` : 'All orders up to date'}
              </p>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {['ALL', ...STATUS_FLOW, 'CANCELLED'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === s ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
              >
                {s} {s !== 'ALL' && `(${orders.filter((o) => o.orderStatus === s).length})`}
                {s === 'ALL' && ` (${orders.length})`}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-primary" /></div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <ClipboardList size={40} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">No orders {filter !== 'ALL' ? `with status "${filter}"` : 'yet'}</p>
              <p className="text-xs text-muted-foreground mt-1">Customer orders will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const style = STATUS_STYLES[order.orderStatus] || STATUS_STYLES.PLACED;
                const currentIdx = STATUS_FLOW.indexOf(order.orderStatus);
                const nextStatus = currentIdx >= 0 && currentIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIdx + 1] : null;

                return (
                  <div key={order.id} className={`card-elevated p-5 space-y-4 border-l-4 ${style.border}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Order #{order.id.slice(-6).toUpperCase()}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <User size={14} className="text-muted-foreground" />
                          <span className="text-sm font-semibold text-foreground">{order.customerName || 'Customer'}</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${style.bg} ${style.text}`}>
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="space-y-1.5">
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
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <p className="text-sm font-bold text-foreground">₹{order.totalAmount.toLocaleString()}</p>
                    </div>

                    {/* Action buttons */}
                    {order.orderStatus !== 'COMPLETED' && order.orderStatus !== 'CANCELLED' && (
                      <div className="flex gap-2 pt-1">
                        {nextStatus && (
                          <button
                            onClick={() => updateStatus(order.id, nextStatus)}
                            className="flex-1 py-2 text-xs font-semibold text-white rounded-lg bg-primary hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 size={14} /> Mark as {nextStatus}
                          </button>
                        )}
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="px-4 py-2 text-xs font-semibold text-danger rounded-lg bg-danger/10 hover:bg-danger/20 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
