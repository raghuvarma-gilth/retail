'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { searchProducts } from '@/lib/api';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { ArrowLeft, Search, Plus, Minus, ShoppingCart, Loader2, Package, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  stock?: number;
}

interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export default function ShopProductsPage() {
  const params = useParams();
  const shopType = params.type as string;
  const shopId = params.shopId as string;
  const { user } = useAuth();

  const [shopName, setShopName] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [semanticResults, setSemanticResults] = useState<string[]>([]);
  const [searchingAI, setSearchingAI] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});

  useEffect(() => {
    async function load() {
      try {
        const shopDoc = await getDoc(doc(db, 'shops', shopId));
        if (shopDoc.exists()) setShopName(shopDoc.data().shopName);

        const productsSnap = await getDocs(collection(db, 'shops', shopId, 'products'));
        const prods: Product[] = [];
        productsSnap.forEach((d) => prods.push({ id: d.id, ...d.data() } as Product));
        setProducts(prods);
        setFiltered(prods);

        // Load existing cart
        if (user) {
          const cartSnap = await getDocs(query(collection(db, 'carts', user.uid, 'items'), where('shopId', '==', shopId)));
          const items: Record<string, number> = {};
          cartSnap.forEach((d) => { items[d.data().productId] = d.data().quantity; });
          setCartItems(items);
        }
      } catch (err) {
        console.error('Error loading shop:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [shopId, user]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setSemanticResults([]);
    if (!q.trim()) { setFiltered(products); return; }
    const lower = q.toLowerCase();
    setFiltered(products.filter((p) =>
      p.name.toLowerCase().includes(lower) || (p.category && p.category.toLowerCase().includes(lower))
    ));
  };

  const handleSemanticSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchingAI(true);
    try {
      const data = await searchProducts(searchQuery, 10);
      const names = (data.results || []).map((r: any) => (typeof r === 'string' ? r : r.product_name || r.name || ''));
      setSemanticResults(names);
      const lower = names.map((n: string) => n.toLowerCase());
      setFiltered(products.filter((p) => lower.some((n: string) => p.name.toLowerCase().includes(n) || n.includes(p.name.toLowerCase()))));
    } catch {
      toast.error('Semantic search unavailable. Showing text results.');
    } finally {
      setSearchingAI(false);
    }
  };

  const updateCart = async (product: Product, delta: number) => {
    if (!user) return;
    const currentQty = cartItems[product.id] || 0;
    const newQty = Math.max(0, currentQty + delta);

    // Check if cart has items from different shop
    const cartMeta = await getDoc(doc(db, 'carts', user.uid));
    if (cartMeta.exists() && cartMeta.data().shopId && cartMeta.data().shopId !== shopId && newQty > 0) {
      toast.error('Your cart has items from another shop. Clear it first.');
      return;
    }

    const itemRef = doc(db, 'carts', user.uid, 'items', product.id);

    if (newQty === 0) {
      await deleteDoc(itemRef).catch(() => {});
      const newItems = { ...cartItems };
      delete newItems[product.id];
      setCartItems(newItems);
    } else {
      await addDoc(collection(db, 'carts', user.uid, 'items'), {}).catch(() => {}); // ensure parent
      const { setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'carts', user.uid), { shopId, shopName, updatedAt: new Date().toISOString() }, { merge: true });
      await setDoc(itemRef, {
        productId: product.id,
        shopId,
        productName: product.name,
        price: product.price,
        quantity: newQty,
        addedAt: new Date().toISOString(),
      });
      setCartItems({ ...cartItems, [product.id]: newQty });
    }

    if (delta > 0) toast.success(`${product.name} added to cart`);
  };

  const totalCartItems = Object.values(cartItems).reduce((a, b) => a + b, 0);

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <CustomerLayout>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/shop/${shopType}`} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                <ArrowLeft size={18} />
              </Link>
              <div>
                <h1 className="text-lg font-bold text-foreground">{shopName || 'Shop'}</h1>
                <p className="text-xs text-muted-foreground">{products.length} products available</p>
              </div>
            </div>
            {totalCartItems > 0 && (
              <Link href="/cart" className="relative p-2 rounded-lg bg-primary/10 text-primary">
                <ShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">{totalCartItems}</span>
              </Link>
            )}
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl bg-muted border border-border outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <button
              onClick={handleSemanticSearch}
              disabled={searchingAI || !searchQuery.trim()}
              className="px-3 py-2.5 rounded-xl bg-primary text-white text-xs font-medium flex items-center gap-1.5 disabled:opacity-50 hover:opacity-90 transition-opacity shrink-0"
              title="AI-powered semantic search"
            >
              {searchingAI ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              AI Search
            </button>
          </div>

          {semanticResults.length > 0 && (
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Sparkles size={10} /> Semantic Search — Powered by all-MiniLM-L6-v2
            </p>
          )}

          {/* Products */}
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Package size={40} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">{products.length === 0 ? 'No products in this shop yet' : 'No matching products'}</p>
              <p className="text-xs text-muted-foreground mt-1">{products.length === 0 ? 'The shop owner has not added products yet.' : 'Try a different search term.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((product) => {
                const qty = cartItems[product.id] || 0;
                return (
                  <div key={product.id} className="card-elevated p-4 space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{product.name}</h3>
                      {product.category && <p className="text-[10px] text-muted-foreground mt-0.5">{product.category}</p>}
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-lg font-bold text-foreground">₹{product.price}</p>
                      {qty === 0 ? (
                        <button onClick={() => updateCart(product, 1)} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:opacity-90 transition-opacity flex items-center gap-1">
                          <Plus size={12} /> Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateCart(product, -1)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-muted/80"><Minus size={14} /></button>
                          <span className="text-sm font-semibold text-foreground w-5 text-center">{qty}</span>
                          <button onClick={() => updateCart(product, 1)} className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white hover:opacity-90"><Plus size={14} /></button>
                        </div>
                      )}
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
