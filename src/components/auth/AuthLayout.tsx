'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Store, BarChart3, Shield } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center" style={{ background: '#f5f0eb' }}>
        <div className="w-6 h-6 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex" style={{ background: '#f5f0eb' }}>
      {/* Left Panel - Cafe branding (desktop only) */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden">
        {/* Background image layer */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%234a3728'/%3E%3Cstop offset='50%25' stop-color='%233d2b1f'/%3E%3Cstop offset='100%25' stop-color='%232d1f14'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g1)' width='800' height='800'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Warm overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(74,55,40,0.92) 0%, rgba(45,31,20,0.95) 100%)' }} />
        {/* Subtle grain texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

        {/* Content */}
        <div className={`relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(217,169,108,0.2)', border: '1px solid rgba(217,169,108,0.3)' }}>
              <Store size={20} style={{ color: '#d9a96c' }} />
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{ color: '#f5f0eb' }}>Retail Intelligence</h1>
              <p className="text-xs" style={{ color: 'rgba(217,169,108,0.8)' }}>by RetailMind AI</p>
            </div>
          </div>

          {/* Main messaging */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl xl:text-5xl font-bold leading-tight" style={{ color: '#f5f0eb' }}>
                Smarter decisions
                <br />
                <span style={{ color: '#d9a96c' }}>for every store.</span>
              </h2>
              <p className="text-base leading-relaxed max-w-md" style={{ color: 'rgba(245,240,235,0.7)' }}>
                ML-powered demand forecasting, inventory intelligence, and actionable insights — built for neighborhood retailers who want enterprise-grade tools without the complexity.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-3">
              {[
                { icon: <BarChart3 size={16} />, title: 'Demand Forecasting', desc: 'Predict tomorrow\'s demand with 87%+ accuracy' },
                { icon: <Shield size={16} />, title: 'Expiry Intelligence', desc: 'Reduce waste and prevent monthly losses' },
                { icon: <Store size={16} />, title: 'Smart Inventory', desc: 'Know exactly when and what to restock' },
              ].map((feat, i) => (
                <div
                  key={feat.title}
                  className="flex items-start gap-3 p-3 rounded-xl transition-all duration-500"
                  style={{
                    background: 'rgba(217,169,108,0.08)',
                    border: '1px solid rgba(217,169,108,0.12)',
                    transitionDelay: `${i * 100}ms`,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(217,169,108,0.15)' }}>
                    <span style={{ color: '#d9a96c' }}>{feat.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#f5f0eb' }}>{feat.title}</p>
                    <p className="text-xs" style={{ color: 'rgba(245,240,235,0.6)' }}>{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom stats */}
          <div className="pt-6" style={{ borderTop: '1px solid rgba(217,169,108,0.15)' }}>
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: '500+', label: 'Products Tracked' },
                { value: '87.4%', label: 'Forecast Accuracy' },
                { value: '24/7', label: 'AI Monitoring' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold" style={{ color: '#d9a96c' }}>{stat.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(245,240,235,0.5)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth form */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto">
        {/* Mobile logo */}
        <div className={`lg:hidden flex items-center gap-2 mb-6 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#4a3728' }}>
            <Store size={18} style={{ color: '#d9a96c' }} />
          </div>
          <div>
            <h1 className="text-base font-bold" style={{ color: '#2d1f14' }}>Retail Intelligence</h1>
          </div>
        </div>

        {/* Auth card */}
        <div
          className={`w-full max-w-[420px] rounded-2xl p-6 sm:p-8 transition-all duration-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(74,55,40,0.08)',
            boxShadow: '0 8px 32px rgba(45,31,20,0.08), 0 2px 8px rgba(45,31,20,0.04)',
          }}
        >
          {children}
        </div>

        {/* Footer */}
        <p className={`mt-6 text-xs transition-all duration-500 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`} style={{ color: '#8b7355' }}>
          Secured by Firebase Authentication
        </p>
      </div>
    </div>
  );
}
