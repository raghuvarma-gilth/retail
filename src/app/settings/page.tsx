'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { toast } from 'sonner';
import { 
  Save,
  Store,
  Boxes,
  AlertTriangle,
  SlidersHorizontal,
  Key,
  Cpu,
  Loader2
} from 'lucide-react';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('store');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setSaving(false);
    toast.success('Settings saved successfully');
  };

  return (
    <ProtectedRoute allowedRoles={['owner']}>
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">Configure your RetailMind application</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Settings Nav */}
          <div className="md:col-span-1 space-y-1">
            <button 
              onClick={() => setActiveSection('store')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activeSection === 'store' ? 'bg-indigo-600/20 text-indigo-400' : 'text-foreground hover:bg-card'}`}
            >
              <Store className="w-4 h-4" />
              Store Config
            </button>
            <button 
              onClick={() => setActiveSection('inventory')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activeSection === 'inventory' ? 'bg-indigo-600/20 text-indigo-400' : 'text-foreground hover:bg-card'}`}
            >
              <Boxes className="w-4 h-4" />
              Inventory Defaults
            </button>
            <button 
              onClick={() => setActiveSection('risk')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activeSection === 'risk' ? 'bg-indigo-600/20 text-indigo-400' : 'text-foreground hover:bg-card'}`}
            >
              <AlertTriangle className="w-4 h-4" />
              Risk Thresholds
            </button>
            <button 
              onClick={() => setActiveSection('weights')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activeSection === 'weights' ? 'bg-indigo-600/20 text-indigo-400' : 'text-foreground hover:bg-card'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Priority Weights
            </button>

          </div>

          {/* Settings Content */}
          <div className="md:col-span-3 space-y-6">
            
            {/* 1. Store Configuration */}
            <div className={`card-elevated bg-card p-6 rounded-xl border border-border ${activeSection !== 'store' && 'hidden md:block'}`}>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Store className="w-5 h-5 text-indigo-400" />
                Store Configuration
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Store Name</label>
                  <input type="text" defaultValue="RetailMind Bangalore Hub" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Currency</label>
                    <select defaultValue="INR" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-indigo-500 appearance-none">
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Location</label>
                    <input type="text" defaultValue="Bangalore, KA, India" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Inventory Defaults */}
            <div className={`card-elevated bg-card p-6 rounded-xl border border-border ${activeSection !== 'inventory' && 'hidden md:block'}`}>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Boxes className="w-5 h-5 text-indigo-400" />
                Inventory Defaults
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Safety Stock (Days)</label>
                  <input type="number" defaultValue="5" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-indigo-500" />
                  <p className="text-xs text-muted-foreground mt-1">Buffer stock to maintain</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Default Lead Time</label>
                  <input type="number" defaultValue="3" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-indigo-500" />
                  <p className="text-xs text-muted-foreground mt-1">Days from order to delivery</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Forecast Horizon</label>
                  <input type="number" defaultValue="30" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-indigo-500" />
                  <p className="text-xs text-muted-foreground mt-1">Days to predict forward</p>
                </div>
              </div>
            </div>

            {/* 3. Risk Thresholds */}
            <div className={`card-elevated bg-card p-6 rounded-xl border border-border ${activeSection !== 'risk' && 'hidden md:block'}`}>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-indigo-400" />
                Risk Thresholds
              </h2>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Critical Stockout (Days)</label>
                    <input type="number" defaultValue="2" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-indigo-500" />
                    <p className="text-xs text-muted-foreground mt-1">Triggers CRITICAL alert</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Warning Stockout (Days)</label>
                    <input type="number" defaultValue="7" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-indigo-500" />
                    <p className="text-xs text-muted-foreground mt-1">Triggers WARNING alert</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-sm font-medium text-foreground">Expiry Risk Threshold (Days)</label>
                    <span className="text-sm font-bold text-indigo-400">14 days</span>
                  </div>
                  <input type="range" min="1" max="60" defaultValue="14" className="w-full accent-indigo-500" />
                  <p className="text-xs text-muted-foreground mt-1">Flag items expiring within this window</p>
                </div>
              </div>
            </div>

            {/* 4. Priority Weights */}
            <div className={`card-elevated bg-card p-6 rounded-xl border border-border ${activeSection !== 'weights' && 'hidden md:block'}`}>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-1">
                <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
                Recommendation Weights
              </h2>
              <p className="text-sm text-muted-foreground mb-5">Adjust how the AI prioritizes recommendations. Must sum to 100%.</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-foreground">Stockout Risk</label>
                    <span className="text-sm font-mono text-foreground">40%</span>
                  </div>
                  <input type="range" min="0" max="100" defaultValue="40" className="w-full accent-red-500" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-foreground">Financial Impact</label>
                    <span className="text-sm font-mono text-foreground">30%</span>
                  </div>
                  <input type="range" min="0" max="100" defaultValue="30" className="w-full accent-emerald-500" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-foreground">Expiry Risk</label>
                    <span className="text-sm font-mono text-foreground">20%</span>
                  </div>
                  <input type="range" min="0" max="100" defaultValue="20" className="w-full accent-amber-500" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-foreground">Demand Change Momentum</label>
                    <span className="text-sm font-mono text-foreground">10%</span>
                  </div>
                  <input type="range" min="0" max="100" defaultValue="10" className="w-full accent-blue-500" />
                </div>
              </div>
            </div>



          </div>
        </div>
      </div>
    </AppLayout>
    </ProtectedRoute>
  );
}
