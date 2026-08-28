'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { ShoppingCart, Pill, CakeSlice, Package, Sparkles, TrendingUp, Shield, Zap, MessageCircle, Loader2, X } from 'lucide-react';
import { askGemini } from '@/lib/api';

const SHOP_TYPES = [
  {
    type: 'grocery',
    label: 'Grocery Store',
    description: 'Rice, Milk, Vegetables, Fruits, Snacks, Beverages',
    icon: <ShoppingCart size={28} />,
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
  },
  {
    type: 'pharmacy',
    label: 'Pharmacy / Medical',
    description: 'Healthcare, Personal care, Wellness products',
    icon: <Pill size={28} />,
    color: '#0369a1',
    bg: '#f0f9ff',
    border: '#bae6fd',
  },
  {
    type: 'bakery',
    label: 'Bakery / Food',
    description: 'Bread, Cakes, Pastries, Snacks, Food items',
    icon: <CakeSlice size={28} />,
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
  },
  {
    type: 'general',
    label: 'General / Daily Essentials',
    description: 'Household, Cleaning, Stationery, Personal care',
    icon: <Package size={28} />,
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
  },
];

const FEATURES = [
  {
    icon: <Sparkles size={20} />,
    title: 'AI Smart Search',
    desc: 'Find products using natural language powered by HuggingFace NLP',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: <TrendingUp size={20} />,
    title: 'Dynamic Pricing',
    desc: 'Get real-time discounts on items nearing expiry - save money, reduce waste',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: <Shield size={20} />,
    title: 'Freshness Guarantee',
    desc: 'Every product tracked from batch to shelf with AI expiry monitoring',
    color: 'text-info',
    bg: 'bg-info/10',
  },
  {
    icon: <Zap size={20} />,
    title: 'Smart Bundles',
    desc: 'AI-suggested combos based on what other customers buy together',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
];

export default function ShopPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: string; text: string}[]>([
    { role: 'ai', text: 'Hi! I\'m your shopping assistant. Ask me anything - "What goes well with tea?", "Suggest a breakfast combo", or "What\'s on discount today?"' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setChatLoading(true);
    try {
      const res = await askGemini(
        `You are a friendly Indian grocery shopping assistant. The customer asked: "${msg}". Give a helpful, concise answer (2-3 sentences max). Suggest specific products if relevant. Do not use emojis.`
      );
      setChatMessages(prev => [...prev, { role: 'ai', text: res.answer || 'Let me check that for you. Please browse our stores for the best options!' }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'ai', text: 'I\'m having trouble connecting. Please browse our stores directly!' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <CustomerLayout>
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-6 text-white">
            <div className="relative z-10">
              <p className="text-xs font-medium opacity-80 uppercase tracking-wider">AI-Powered Shopping</p>
              <h1 className="text-2xl font-bold mt-1">Shop Smarter, Not Harder</h1>
              <p className="text-sm opacity-90 mt-2 max-w-md">
                Get personalized recommendations, dynamic discounts on near-expiry items, and AI-curated bundles — all in one place.
              </p>
            </div>
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10 blur-xl"></div>
            <div className="absolute bottom-2 right-8 w-14 h-14 rounded-full bg-white/5 blur-lg"></div>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="card-elevated p-3 text-center space-y-2">
                <div className={`w-10 h-10 rounded-xl ${f.bg} ${f.color} flex items-center justify-center mx-auto`}>
                  {f.icon}
                </div>
                <h3 className="text-xs font-bold text-foreground">{f.title}</h3>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Shop Categories */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">Browse Stores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SHOP_TYPES.map((shop) => (
                <Link
                  key={shop.type}
                  href={`/shop/${shop.type}`}
                  className="group card-elevated p-5 flex items-start gap-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: shop.bg, border: `1px solid ${shop.border}`, color: shop.color }}
                  >
                    {shop.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-foreground">{shop.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{shop.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* AI Deals Banner */}
          <div className="card-elevated p-4 border-l-4 border-l-success flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
              <TrendingUp size={18} className="text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-foreground">Today's Smart Deals</h3>
              <p className="text-xs text-muted-foreground mt-0.5">3 items with dynamic discounts based on AI expiry predictions. Save up to 40% on dairy and bakery items.</p>
            </div>
          </div>
        </div>

        {/* Floating AI Chat Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
          {chatOpen ? <X size={20} /> : <MessageCircle size={20} />}
        </button>

        {/* AI Chat Panel */}
        {chatOpen && (
          <div className="fixed bottom-36 right-4 z-50 w-80 bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: '400px' }}>
            <div className="bg-primary text-white px-4 py-3 flex items-center gap-2">
              <Sparkles size={16} />
              <span className="text-sm font-bold">AI Shopping Assistant</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ maxHeight: '260px' }}>
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-br-sm' 
                      : 'bg-muted text-foreground rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted px-3 py-2 rounded-xl rounded-bl-sm">
                    <Loader2 size={14} className="animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-border p-2 flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                placeholder="Ask me anything..."
                className="flex-1 text-xs bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={sendChat}
                disabled={chatLoading}
                className="bg-primary text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </CustomerLayout>
    </ProtectedRoute>
  );
}
