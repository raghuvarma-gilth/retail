'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { doc, getDoc, collection, getDocs, deleteDoc, setDoc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { Minus, Plus, Trash2, ShoppingCart, Loader2, ArrowRight, Package } from 'lucide-react';
import { toast } from 'sonner';

interface CartItemData {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  shopId: string;
}

export default function CartPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemData[]>([]);
  const [shopName, setShopName] = useState('');
  const [shopId, setShopId] = useState('');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const loadCart = async () => {
    if (!user) return;
    try {
      const cartDoc = await getDoc(doc(db, 'carts', user.uid));
      if (cartDoc.exists()) {
        setShopName(cartDoc.data().shopName || '');
        setShopId(cartDoc.data().shopId || '');
      }
      const itemsSnap = await getDocs(collection(db, 'carts', user.uid, 'items'));
      const cartItems: CartItemData[] = [];
      itemsSnap.forEach((d) => cartItems.push(d.data() as CartItemData));
      setItems(cartItems);
    } catch (err) {
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, [user]);

  const updateQty = async (productId: string, delta: number) => {
    if (!user) return;
    const item = items.find((i) => i.productId === productId);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      await deleteDoc(doc(db, 'carts', user.uid, 'items', productId));
      setItems(items.filter((i) => i.productId !== productId));
    } else {
      await setDoc(doc(db, 'carts', user.uid, 'items', productId), { ...item, quantity: newQty });
      setItems(items.map((i) => i.productId === productId ? { ...i, quantity: newQty } : i));
    }
  };

  const removeItem = async (productId: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'carts', user.uid, 'items', productId));
    setItems(items.filter((i) => i.productId !== productId));
    toast.success('Item removed from cart');
  };

  const clearCart = async () => {
    if (!user) return;
    for (const item of items) {
      await deleteDoc(doc(db, 'carts', user.uid, 'items', item.productId));
    }
    await deleteDoc(doc(db, 'carts', user.uid));
    setItems([]);
    setShopName('');
    toast.success('Cart cleared');
  };

  const placeOrder = async () => {
    if (!user || items.length === 0) return;
    setPlacing(true);
    try {
      // Get shop owner ID
      const shopDoc = await getDoc(doc(db, 'shops', shopId));
      const shopOwnerId = shopDoc.exists() ? shopDoc.data().ownerId : '';

      const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

      await addDoc(collection(db, 'orders'), {
        customerId: user.uid,
        customerName: user.displayName || user.email || '',
        shopId,
        shopName,
        shopOwnerId,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          quantity: i.quantity,
          price: i.price,
        })),
        totalAmount,
        totalItems,
        orderStatus: 'PLACED',
        createdAt: new Date().toISOString(),
      });

      // Clear cart after order
      for (const item of items) {
        await deleteDoc(doc(db, 'carts', user.uid, 'items', item.productId));
      }
      await deleteDoc(doc(db, 'carts', user.uid));

      toast.success('Order placed successfully!');
      setItems([]);
      // Redirect to orders
      window.location.href = '/orders';
    } catch (err) {
      console.error('Error placing order:', err);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <CustomerLayout>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Your Cart</h1>
              {shopName && <p className="text-xs text-muted-foreground mt-0.5">From: {shopName}</p>}
            </div>
            {items.length > 0 && (
              <button onClick={clearCart} className="text-xs text-danger font-medium hover:underline">Clear all</button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-primary" /></div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart size={40} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">Your cart is empty</p>
              <p className="text-xs text-muted-foreground mt-1">Browse shops and add products to get started.</p>
              <Link href="/shop" className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary hover:underline">
                Browse Shops <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="card-elevated p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Package size={18} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground truncate">{item.productName}</h3>
                      <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.productId, -1)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-foreground"><Minus size={14} /></button>
                      <span className="text-sm font-semibold text-foreground w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.productId, 1)} className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white"><Plus size={14} /></button>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-foreground">₹{item.price * item.quantity}</p>
                      <button onClick={() => removeItem(item.productId)} className="text-danger hover:underline">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="card-elevated p-4 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Order Summary</h3>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Items ({totalQty})</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between text-base font-bold text-foreground">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <button
                  onClick={placeOrder}
                  disabled={placing}
                  className="w-full py-3 text-sm font-semibold text-white rounded-xl bg-primary hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {placing ? (<><Loader2 size={16} className="animate-spin" /> Placing Order...</>) : (<>Place Order <ArrowRight size={14} /></>)}
                </button>
              </div>
            </>
          )}
        </div>
      </CustomerLayout>
    </ProtectedRoute>
  );
}
