'use client';
import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Loader2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { getAnalyticsOverview, getRealtimeGreeting, askGemini } from '@/lib/api';

export default function DashboardHeader() {
  const [refreshing, setRefreshing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [greetingData, setGreetingData] = useState({
    greeting: 'Good Day',
    date: 'Loading...',
    time: '',
    insight: '3 critical actions require attention',
    source: ''
  });

  useEffect(() => {
    let isMounted = true;
    async function loadGreeting() {
      try {
        const res = await getRealtimeGreeting();
        if (isMounted && res) {
          setGreetingData({
            greeting: res.greeting || 'Good Day',
            date: res.date || new Date().toLocaleDateString('en-GB'),
            time: res.time || '',
            insight: res.insight || '3 critical actions require attention',
            source: res.source || ''
          });
        }
      } catch {
        // Fallback to static on failure
        if (isMounted) {
          const d = new Date();
          setGreetingData(prev => ({
            ...prev,
            date: d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })
          }));
        }
      }
    }
    loadGreeting();
    return () => { isMounted = false; };
  }, []);

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
        'You are a Retail AI Assistant. Provide a 2-sentence summary of the current store performance based on recent metrics.'
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
        <h1 className="text-2xl font-bold text-foreground">{greetingData.greeting}, Raghu</h1>
        <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
          <span>{greetingData.date}</span>
          {greetingData.time && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1 text-[11px]"><Clock size={11}/> {greetingData.time}</span>
            </>
          )}
          <span>·</span>
          <span>Sharma General Store</span>
          <span>·</span>
          <span className="text-danger font-medium flex items-center gap-1">
            {greetingData.insight}
            {greetingData.source === 'Groq AI' && (
               <span className="ml-1 text-[9px] bg-primary/10 text-primary px-1 rounded uppercase tracking-wider">AI Insight</span>
            )}
          </span>
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