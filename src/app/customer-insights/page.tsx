'use client';
import AppLayout from '@/components/AppLayout';

import React, { useState } from 'react';
import { Link2, ShoppingCart, TrendingUp, Zap, Target, ArrowRight, Package, X } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { toast } from 'sonner';

const ASSOCIATION_RULES = [
  { id: 1, base: 'Amul Milk 1L', target: 'Modern Bread 400g', support: '28.4%', confidence: '74.2%', lift: 3.2 },
  { id: 2, base: 'Maggi Noodles 280g', target: 'Coca-Cola 1.25L', support: '18.5%', confidence: '62.8%', lift: 2.8 },
  { id: 3, base: 'Tata Salt 1kg', target: 'Aashirvaad Atta 5kg', support: '32.1%', confidence: '68.5%', lift: 2.1 },
  { id: 4, base: 'Tea Powder (Any)', target: 'Parle-G Biscuits', support: '42.8%', confidence: '81.4%', lift: 3.8 },
  { id: 5, base: 'Dishwash Gel', target: 'Sponge Scrubber', support: '12.4%', confidence: '58.9%', lift: 4.5 },
  { id: 6, base: 'Haldiram Bhujia', target: 'Thumbs Up 750ml', support: '15.6%', confidence: '54.2%', lift: 2.4 },
  { id: 7, base: 'Onions 1kg', target: 'Tomatoes 1kg', support: '45.2%', confidence: '88.1%', lift: 2.9 },
  { id: 8, base: 'Shampoo (Any)', target: 'Conditioner (Same Brand)', support: '14.2%', confidence: '42.5%', lift: 5.2 },
];

const BUNDLE_OPPORTUNITIES = [
  {
    title: "Morning Breakfast Kit",
    items: ["Amul Milk 1L", "Modern Bread", "Eggs 6-pack"],
    currentPrice: 155,
    suggestedPrice: 145,
    uplift: "+22%",
    confidence: "High"
  },
  {
    title: "Weekend Snack Combo",
    items: ["Lays Magic Masala", "Coca-Cola 1.25L", "Dairy Milk Silk"],
    currentPrice: 240,
    suggestedPrice: 220,
    uplift: "+35%",
    confidence: "Very High"
  },
  {
    title: "Monthly Staples Pack",
    items: ["Aashirvaad Atta 5kg", "Fortune Oil 1L", "Tata Salt"],
    currentPrice: 391,
    suggestedPrice: 375,
    uplift: "+15%",
    confidence: "Medium"
  }
];

export default function CustomerInsightsPage() {
  const [showHeatmap, setShowHeatmap] = useState(false);

  return (
    <ProtectedRoute allowedRoles={['owner']}>
    <AppLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Customer Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">Discover buying patterns and optimization opportunities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Link2 className="w-5 h-5 text-[var(--primary)]" />
              Market Basket Analysis
            </h3>
            <span className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-1 rounded-md font-medium">Last 30 Days</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-[var(--border)] text-muted-foreground font-medium">
                  <th className="pb-3 pr-4">Items Frequently Bought Together</th>
                  <th className="pb-3 px-2 text-right">Support</th>
                  <th className="pb-3 px-2 text-right">Confidence</th>
                  <th className="pb-3 px-2 text-right">Lift</th>
                  <th className="pb-3 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {ASSOCIATION_RULES.map(rule => (
                  <tr key={rule.id} className="hover:bg-[var(--background)] transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{rule.base}</span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        <span className="font-medium text-foreground">{rule.target}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right text-muted-foreground tabular-nums">{rule.support}</td>
                    <td className="py-3 px-2 text-right text-[var(--success)] font-medium tabular-nums">{rule.confidence}</td>
                    <td className="py-3 px-2 text-right tabular-nums">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        rule.lift > 3 ? 'badge-healthy' : 'bg-[var(--background)] text-muted-foreground'
                      }`}>
                        {rule.lift}x
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <button 
                        onClick={() => toast.success(`Bundle created: ${rule.base} + ${rule.target}`)}
                        className="text-xs font-medium text-[var(--primary)] hover:underline"
                      >Create Combo</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-elevated p-5">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-[var(--warning)]" />
              AI Recommended Bundles
            </h3>
            <div className="space-y-4">
              {BUNDLE_OPPORTUNITIES.map((bundle, idx) => (
                <div key={idx} className="p-4 bg-[var(--background)] border border-[var(--border)] rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{bundle.title}</h4>
                    <div className="flex flex-wrap gap-1 text-xs text-muted-foreground mb-2">
                      {bundle.items.map((item, i) => (
                        <span key={i} className="px-2 py-1 bg-[var(--card)] rounded-md border border-[var(--border)]">{item}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="line-through text-muted-foreground">₹{bundle.currentPrice}</span>
                      <span className="font-bold text-[var(--primary)]">₹{bundle.suggestedPrice}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-fit">
                    <div className="flex items-center gap-1 text-sm text-[var(--success)] font-medium">
                      <TrendingUp className="w-4 h-4" />
                      <span>{bundle.uplift} Vol Uplift</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                      bundle.confidence === 'Very High' ? 'badge-healthy' : 
                      bundle.confidence === 'High' ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 
                      'badge-info'
                    }`}>
                      {bundle.confidence} Confidence
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-elevated p-5 bg-gradient-to-br from-[var(--card)] to-[var(--primary)]/5">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[var(--primary)]/10 rounded-full">
                <Target className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Store Layout Optimization</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on basket analysis, moving the <strong>Spices section</strong> closer to the <strong>Staples (Atta/Rice) section</strong> is projected to increase cross-category purchases by 18%.
                </p>
                <button 
                  onClick={() => setShowHeatmap(true)}
                  className="text-sm font-medium bg-[var(--primary)] text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                >
                  View Heatmap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Heatmap Modal */}
      {showHeatmap && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
          <div className="bg-card w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-border flex flex-col slide-in">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary"/> 
                AI Store Layout Heatmap
              </h3>
              <button 
                onClick={() => setShowHeatmap(false)} 
                className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                <X size={20}/>
              </button>
            </div>
            
            <div className="p-6 bg-background">
              <div className="aspect-[16/7] w-full bg-muted/10 border border-border rounded-xl relative p-4 grid grid-cols-5 grid-rows-4 gap-3">
                  {/* Entrance */}
                  <div className="col-span-5 flex justify-center pb-2 border-b-2 border-dashed border-border/50 mb-2">
                    <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Entrance</span>
                  </div>

                  {/* Aisles */}
                  <div className="row-span-3 bg-red-500/90 rounded-lg flex items-center justify-center text-white text-sm font-bold text-center p-3 shadow-[0_0_20px_rgba(239,68,68,0.3)] border border-red-600/50">
                    <div>
                      Staples<br/><span className="text-[10px] font-medium opacity-90">Very High Traffic</span>
                    </div>
                  </div>
                  
                  <div className="row-span-2 bg-orange-500/80 rounded-lg flex items-center justify-center text-white text-sm font-bold text-center p-3 border border-orange-600/50">
                    <div>
                      Dairy & Eggs<br/><span className="text-[10px] font-medium opacity-90">High Traffic</span>
                    </div>
                  </div>
                  
                  <div className="row-span-3 bg-amber-400/80 rounded-lg flex items-center justify-center text-amber-950 text-sm font-bold text-center p-3 border border-amber-500/50">
                    <div>
                      Beverages<br/><span className="text-[10px] font-medium opacity-90">Medium Traffic</span>
                    </div>
                  </div>
                  
                  <div className="row-span-2 relative bg-blue-500/20 rounded-lg flex items-center justify-center text-primary text-sm font-bold text-center p-3 border-2 border-dashed border-primary">
                    <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-lg"></div>
                    <div className="relative z-10">
                      Spices<br/><span className="text-[10px] font-medium">Suggested New Location</span>
                    </div>
                  </div>
                  
                  <div className="row-span-3 bg-red-400/90 rounded-lg flex items-center justify-center text-white text-sm font-bold text-center p-3 border border-red-500/50">
                    <div>
                      Snacks<br/><span className="text-[10px] font-medium opacity-90">High Traffic</span>
                    </div>
                  </div>

                  {/* Second row filler */}
                  <div className="bg-emerald-500/80 rounded-lg flex items-center justify-center text-white text-sm font-bold text-center p-3 border border-emerald-600/50">
                    <div>
                      Produce<br/><span className="text-[10px] font-medium opacity-90">Low Traffic</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-300 dark:bg-slate-700/80 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-300 text-sm font-bold text-center p-3 border border-slate-400/50">
                    <div>
                      Cleaning<br/><span className="text-[10px] font-medium opacity-90">Current Spices Loc.</span>
                    </div>
                  </div>

                  {/* Checkout */}
                  <div className="col-span-5 flex justify-center pt-2 border-t-2 border-dashed border-border/50 mt-2">
                    <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Checkout Counters</span>
                  </div>
              </div>

              {/* Legend */}
              <div className="mt-6 flex flex-wrap gap-6 text-xs font-medium justify-center items-center text-muted-foreground">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-500/90"></div> Very High</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-orange-500/80"></div> High</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-amber-400/80"></div> Medium</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-emerald-500/80"></div> Low</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border-2 border-dashed border-primary bg-primary/10"></div> AI Suggestion</div>
              </div>

              {/* Insight Text */}
              <div className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20 flex gap-4 items-start">
                <div className="p-2 bg-primary/20 rounded-lg shrink-0">
                  <Zap className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">Cross-Merchandising Opportunity</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The <strong className="text-foreground">Spices</strong> section is currently in a cold zone. Market basket analysis shows a <strong className="text-success">68.5% confidence</strong> that customers buying <strong className="text-foreground">Atta/Rice (Staples)</strong> also buy Spices. Moving Spices adjacent to Staples is projected to increase category revenue by 18%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </AppLayout>
    </ProtectedRoute>
  );
}
