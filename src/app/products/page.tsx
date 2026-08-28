'use client';
import AppLayout from '@/components/AppLayout';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Filter, Loader2, Sparkles, X, Check } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const DEFAULT_PRODUCTS = [
  { id: 'def-1', name: 'Amul Taaza Toned Milk 1L', sku: 'AM-MILK-001', category: 'Dairy', brand: 'Amul', cost: 60, price: 68, margin: '11.7%', status: 'Active' },
  { id: 'def-2', name: 'Britannia Good Day Cashew 600g', sku: 'BR-GD-002', category: 'Snacks', brand: 'Britannia', cost: 105, price: 120, margin: '12.5%', status: 'Active' },
  { id: 'def-3', name: 'Aashirvaad Shudh Chakki Atta 5kg', sku: 'AS-ATTA-005', category: 'Staples', brand: 'Aashirvaad', cost: 195, price: 215, margin: '9.3%', status: 'Active' },
  { id: 'def-4', name: 'Maggi 2-Minute Noodles 280g', sku: 'MG-NDL-001', category: 'Snacks', brand: 'Nestle', cost: 42, price: 48, margin: '12.5%', status: 'Active' },
  { id: 'def-5', name: 'Tata Salt 1kg', sku: 'TS-SLT-001', category: 'Staples', brand: 'Tata', cost: 18, price: 21, margin: '14.2%', status: 'Active' },
  { id: 'def-6', name: 'Dabur Honey 1kg', sku: 'DB-HNY-001', category: 'Pantry', brand: 'Dabur', cost: 320, price: 395, margin: '18.9%', status: 'Active' },
  { id: 'def-7', name: 'Surf Excel Easy Wash 1.5kg', sku: 'SE-DET-001', category: 'Household', brand: 'HUL', cost: 175, price: 198, margin: '11.6%', status: 'Active' },
  { id: 'def-8', name: 'Parle-G Original 800g', sku: 'PG-BIS-001', category: 'Snacks', brand: 'Parle', cost: 65, price: 75, margin: '13.3%', status: 'Active' },
  { id: 'def-9', name: 'Red Label Tea 500g', sku: 'RL-TEA-001', category: 'Beverages', brand: 'Brooke Bond', cost: 220, price: 250, margin: '12.0%', status: 'Active' },
  { id: 'def-10', name: 'Fortune Sunlite Sunflower Oil 1L', sku: 'FT-OIL-001', category: 'Staples', brand: 'Fortune', cost: 140, price: 155, margin: '9.6%', status: 'Active' },
  { id: 'def-11', name: 'Vim Dishwash Gel 750ml', sku: 'VM-DSH-001', category: 'Household', brand: 'HUL', cost: 145, price: 165, margin: '12.1%', status: 'Active' },
  { id: 'def-12', name: 'Nescafe Classic Coffee 50g', sku: 'NS-COF-001', category: 'Beverages', brand: 'Nestle', cost: 140, price: 155, margin: '9.6%', status: 'Active' },
  { id: 'def-13', name: 'Haldiram Bhujia Sev 400g', sku: 'HD-BHJ-001', category: 'Snacks', brand: 'Haldiram', cost: 95, price: 110, margin: '13.6%', status: 'Active' },
  { id: 'def-14', name: 'Gowardhan Ghee 1L', sku: 'GW-GHE-001', category: 'Dairy', brand: 'Gowardhan', cost: 480, price: 540, margin: '11.1%', status: 'Active' },
  { id: 'def-15', name: 'Colgate Strong Teeth 300g', sku: 'CG-PST-001', category: 'Personal Care', brand: 'Colgate', cost: 145, price: 168, margin: '13.6%', status: 'Active' },
  { id: 'def-16', name: 'Dove Cream Beauty Bathing Bar 3x100g', sku: 'DV-SOAP-001', category: 'Personal Care', brand: 'Dove', cost: 160, price: 185, margin: '13.5%', status: 'Active' },
  { id: 'def-17', name: 'Madhur Pure & Hygienic Sugar 1kg', sku: 'MD-SGR-001', category: 'Staples', brand: 'Madhur', cost: 48, price: 55, margin: '12.7%', status: 'Active' }
];

export default function ProductsPage() {
  const { user, userRole, shopId, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [products, setProducts] = useState<any[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [addingDemo, setAddingDemo] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Grocery',
    brand: '',
    cost: '',
    price: '',
    status: 'Active'
  });

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      if (!shopId) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const snap = await getDocs(collection(db, 'shops', shopId, 'products'));
        if (isMounted) {
          if (!snap.empty) {
            const loaded = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(loaded);
          } else {
            // Keep default catalog available
            setProducts(DEFAULT_PRODUCTS);
          }
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        if (isMounted) setProducts(DEFAULT_PRODUCTS);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    // Small delay or instant load
    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [shopId]);

  const addDemoProducts = async () => {
    if (!shopId) {
      toast.info("Showing default catalog items.");
      setProducts(DEFAULT_PRODUCTS);
      return;
    }
    setAddingDemo(true);
    try {
      const prodsRef = collection(db, 'shops', shopId, 'products');
      for (const p of DEFAULT_PRODUCTS.slice(0, 8)) {
        await addDoc(prodsRef, {
          name: p.name,
          sku: p.sku,
          category: p.category,
          brand: p.brand,
          price: p.price,
          cost: p.cost,
          margin: p.margin,
          status: 'Active',
          createdAt: new Date().toISOString()
        });
      }
      toast.success("Demo products synced to your shop!");
      const snap = await getDocs(collection(db, 'shops', shopId, 'products'));
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      toast.error("Failed to add demo products to Firestore.");
    } finally {
      setAddingDemo(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      toast.error("Please fill in product name and selling price.");
      return;
    }

    const costNum = parseFloat(newProduct.cost) || 0;
    const priceNum = parseFloat(newProduct.price) || 0;
    const marginCalc = priceNum > 0 ? `${(((priceNum - costNum) / priceNum) * 100).toFixed(1)}%` : '0%';

    const itemToSave = {
      name: newProduct.name,
      sku: `SKU-${Date.now().toString().slice(-4)}`,
      category: newProduct.category || 'Grocery',
      brand: newProduct.brand || 'General',
      cost: costNum,
      price: priceNum,
      margin: marginCalc,
      status: newProduct.status || 'Active',
      createdAt: new Date().toISOString()
    };

    if (shopId) {
      try {
        const docRef = await addDoc(collection(db, 'shops', shopId, 'products'), itemToSave);
        setProducts(prev => [{ id: docRef.id, ...itemToSave }, ...prev]);
        toast.success("Product created and published!");
      } catch (err) {
        setProducts(prev => [{ id: `local-${Date.now()}`, ...itemToSave }, ...prev]);
        toast.success("Product added locally!");
      }
    } else {
      setProducts(prev => [{ id: `local-${Date.now()}`, ...itemToSave }, ...prev]);
      toast.success("Product added to catalog!");
    }

    setIsModalOpen(false);
    setNewProduct({ name: '', category: 'Grocery', brand: '', cost: '', price: '', status: 'Active' });
  };

  const deleteProduct = async (prodId: string) => {
    if (!confirm("Are you sure you want to remove this product?")) return;
    try {
      if (shopId && !prodId.startsWith('def-') && !prodId.startsWith('local-')) {
        await deleteDoc(doc(db, 'shops', shopId, 'products', prodId));
      }
      setProducts(prev => prev.filter(p => p.id !== prodId));
      toast.success("Product removed");
    } catch (err) {
      setProducts(prev => prev.filter(p => p.id !== prodId));
      toast.success("Product removed");
    }
  };

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category || 'General')))];

  const filteredProducts = products.filter(product => {
    const nameMatch = (product.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const skuMatch = (product.sku || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || skuMatch;
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <ProtectedRoute allowedRoles={['owner']}>
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Products & Inventory</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage pricing, catalog items, and stock status</p>
          </div>
          
          <div className="flex items-center gap-3">
            {shopId && (
              <button 
                onClick={addDemoProducts}
                disabled={addingDemo}
                className="bg-muted text-foreground border border-border px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-2"
              >
                {addingDemo ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="text-primary" />}
                Sync Demo Items
              </button>
            )}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>
        </div>

        <div className="card-elevated overflow-hidden">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search products or SKU..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              <select 
                className="bg-background border border-border text-foreground text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[140px] w-full"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="animate-spin mb-4 text-primary" size={28} />
                <p className="font-medium">Loading catalog...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <p className="font-medium">No products found matching your search.</p>
                <p className="text-xs mt-2">Click "Add Product" above to create a new item.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-bold tracking-wider">Product Name</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Category</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Brand</th>
                    <th className="px-6 py-4 font-bold tracking-wider text-right">Cost</th>
                    <th className="px-6 py-4 font-bold tracking-wider text-right">Price</th>
                    <th className="px-6 py-4 font-bold tracking-wider text-right">Margin</th>
                    <th className="px-6 py-4 font-bold tracking-wider text-center">Status</th>
                    <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground">{product.name}</p>
                        {product.sku && <p className="text-[11px] text-muted-foreground font-mono">{product.sku}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs font-medium">
                          {product.category || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-medium">{product.brand || 'General'}</td>
                      <td className="px-6 py-4 text-right text-muted-foreground font-mono">₹{product.cost || 0}</td>
                      <td className="px-6 py-4 text-right font-semibold text-foreground font-mono">₹{product.price || 0}</td>
                      <td className="px-6 py-4 text-right text-success font-medium font-mono">{product.margin || '12%'}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          product.status === 'Active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                        }`}>
                          {product.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => deleteProduct(product.id)} 
                            className="p-1.5 text-muted-foreground hover:text-danger transition-colors hover:bg-danger/10 rounded"
                            title="Delete item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground bg-muted/20">
            <span>Showing {filteredProducts.length} items</span>
          </div>
        </div>

        {/* Modal: Add Product */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-foreground text-lg">Add New Product</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleCreateProduct} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amul Gold Milk 500ml"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="Dairy">Dairy</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Staples">Staples</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Household">Household</option>
                      <option value="Personal Care">Personal Care</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Brand</label>
                    <input
                      type="text"
                      placeholder="e.g. Amul"
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Cost Price (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 28"
                      value={newProduct.cost}
                      onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 33"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm text-foreground bg-muted hover:bg-muted/80 rounded-xl transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-colors font-medium flex items-center gap-1.5"
                  >
                    <Check size={16} /> Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
    </ProtectedRoute>
  );
}
