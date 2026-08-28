'use client';
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import AppLogo from '@/components/ui/AppLogo';
import { Brain, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

const features = [
  { id: 'feat-forecast', icon: <TrendingUp size={16} />, title: 'Demand Forecasting', desc: 'Next-day to 30-day predictions with 87%+ accuracy' },
  { id: 'feat-expiry', icon: <ShieldCheck size={16} />, title: 'Expiry Intelligence', desc: 'Prevent ₹3,000+ monthly losses from expired stock' },
  { id: 'feat-basket', icon: <Brain size={16} />, title: 'Market Basket AI', desc: 'FP-Growth powered bundle and cross-sell opportunities' },
  { id: 'feat-anomaly', icon: <Zap size={16} />, title: 'Anomaly Detection', desc: 'Isolation Forest catches unusual sales patterns instantly' },
];

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] 2xl:w-[560px] gradient-primary flex-col justify-between p-10 shrink-0">
        <div className="flex items-center gap-3">
          <AppLogo size={36} />
          <div>
            <span className="font-bold text-white text-lg tracking-tight">RetailMind AI</span>
            <p className="text-blue-200 text-xs">Intelligent Retail Intelligence</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">
              Your store&apos;s ML-powered<br />decision engine
            </h2>
            <p className="text-blue-200 text-sm leading-relaxed">
              RetailMind AI combines demand forecasting, expiry risk prediction, market basket analysis, and anomaly detection — giving small grocery owners enterprise-grade intelligence without the enterprise price tag.
            </p>
          </div>

          <div className="space-y-3">
            {features?.map((f) => (
              <div key={f?.id} className="flex items-start gap-3 bg-white/10 rounded-lg p-3">
                <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center text-white shrink-0">
                  {f?.icon}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{f?.title}</p>
                  <p className="text-blue-200 text-xs">{f?.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/20 pt-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'stat-acc', value: '87.4%', label: 'Forecast Accuracy' },
              { id: 'stat-save', value: '₹3,200', label: 'Avg Monthly Savings' },
              { id: 'stat-sku', value: '500+', label: 'SKUs Supported' },
            ]?.map((s) => (
              <div key={s?.id} className="text-center">
                <p className="text-2xl font-bold text-white font-tabular">{s?.value}</p>
                <p className="text-blue-200 text-xs">{s?.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 justify-center mb-8">
            <AppLogo size={32} />
            <span className="font-bold text-foreground text-lg">RetailMind AI</span>
          </div>

          {/* Tabs */}
          <div className="flex bg-muted rounded-lg p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-150 ${
                mode === 'login' ?'bg-card text-foreground shadow-card' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-150 ${
                mode === 'signup' ?'bg-card text-foreground shadow-card' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>

          {mode === 'login' ? (
            <LoginForm onSwitchToSignup={() => setMode('signup')} />
          ) : (
            <SignUpForm onSwitchToLogin={() => setMode('login')} />
          )}
        </div>
      </div>
    </div>
  );
}