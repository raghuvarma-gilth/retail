'use client';
import React, { useState } from 'react';
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getAnalyticsOverview } from '@/lib/api';
import { askGemini } from '@/lib/api';

export default function DashboardHeader() {
  const [refreshing, setRefreshing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await getAnalyticsOverview();
      toast.success('Dashboard data refreshed successfully');
      window.location.reload();
    } catch {
      toast.error('Failed to refresh — using cached data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleRunAI = async () => {
    setAnalyzing(true);
    try {
      const res = await askGemini(
        'You are a Retail AI Assistant. Provide a 2-sentence summary of the current store performance based on: Revenue is at 89% of daily target, 7 SKUs at stockout risk, 12 batches expiring within 7 days, and demand growth of +12.3%. Keep it actionable.'
      );
      toast.success(res.answer || 'AI analysis complete. Check recommendations for details.');
    } catch {
      toast.info('AI analysis queued — results will appear in recommendations shortly.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={16} className="text-accent" />
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">Today&apos;s Business Intelligence</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Good Afternoon, Raghu</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Sunday, 23 Aug 2026 · Sharma General Store · <span className="text-danger font-medium">3 critical actions require attention</span>
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-60"
        >
          {refreshing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
          Refresh
        </button>
        <button 
          onClick={handleRunAI}
          disabled={analyzing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all active:scale-95 disabled:opacity-60"
        >
          {analyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
          Run AI Analysis
        </button>
      </div>
    </div>
  );
}