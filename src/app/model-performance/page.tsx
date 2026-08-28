'use client';
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Activity, Brain, Sparkles } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const actualVsPredictedData = Array.from({ length: 30 }).map((_, i) => {
  const date = new Date(2026, 7, i + 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const baseActual = 1000 + Math.random() * 500;
  // Make predicted closely follow actual to look like a good model
  const predicted = baseActual + (Math.random() * 100 - 50); 
  return {
    date,
    actual: Math.round(baseActual),
    predicted: Math.round(predicted)
  };
});

const accuracyTrendData = Array.from({ length: 30 }).map((_, i) => ({
  day: i,
  mape: 15 - (i * 0.1) + (Math.random() * 2) // Gradually improving trend
}));

export default function ModelPerformancePage() {
  return (
    <ProtectedRoute allowedRoles={['owner']}>
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Model Performance</h1>
            <p className="text-muted-foreground text-sm mt-1">Evaluate and manage forecasting models</p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-5 rounded-xl border border-border flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Best Model</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold text-foreground">XGBoost Optimized</span>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">ACTIVE</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Brain className="w-6 h-6" />
            </div>
          </div>
          
          <div className="bg-card p-5 rounded-xl border border-border">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-medium text-muted-foreground">System Accuracy (MAPE)</p>
              <span className="text-emerald-400 text-sm font-bold">12.4%</span>
            </div>
            <div className="h-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyTrendData}>
                  <Line type="monotone" dataKey="mape" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-card p-5 rounded-xl border border-border flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Inference Time</p>
              <p className="text-xl font-bold text-foreground mt-1">45ms / item</p>
              <p className="text-xs text-muted-foreground mt-1">Batch inference nightly</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Model Comparison Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex justify-between items-center bg-background/30">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Model Comparison Metrics
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Model Name</th>
                  <th className="p-4 font-medium">MAE</th>
                  <th className="p-4 font-medium">RMSE</th>
                  <th className="p-4 font-medium">MAPE (%)</th>
                  <th className="p-4 font-medium">WAPE (%)</th>
                  <th className="p-4 font-medium text-right">Training Time</th>
                  <th className="p-4 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-sm">
                <tr className="bg-indigo-900/20">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-indigo-300">XGBoost (Active)</span>
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                  </td>
                  <td className="p-4 text-foreground">14.2</td>
                  <td className="p-4 text-foreground">18.5</td>
                  <td className="p-4 font-medium text-emerald-400">12.4%</td>
                  <td className="p-4 text-foreground">10.8%</td>
                  <td className="p-4 text-right text-muted-foreground">45 mins</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Trained</span>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="p-4 font-medium text-foreground">Exponential Smoothing</td>
                  <td className="p-4 text-foreground">18.6</td>
                  <td className="p-4 text-foreground">24.1</td>
                  <td className="p-4 text-foreground">16.8%</td>
                  <td className="p-4 text-foreground">14.2%</td>
                  <td className="p-4 text-right text-muted-foreground">5 mins</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Trained</span>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="p-4 font-medium text-foreground">Moving Average (Baseline)</td>
                  <td className="p-4 text-foreground">22.4</td>
                  <td className="p-4 text-foreground">29.8</td>
                  <td className="p-4 text-foreground">21.5%</td>
                  <td className="p-4 text-foreground">18.7%</td>
                  <td className="p-4 text-right text-muted-foreground">&lt; 1 min</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Trained</span>
                  </td>
                </tr>
                <tr className="opacity-60 bg-secondary hover:bg-background/80">
                  <td className="p-4 font-medium text-muted-foreground">Hugging Face TimesFM</td>
                  <td className="p-4 text-muted-foreground">-</td>
                  <td className="p-4 text-muted-foreground">-</td>
                  <td className="p-4 text-muted-foreground">-</td>
                  <td className="p-4 text-muted-foreground">-</td>
                  <td className="p-4 text-right text-muted-foreground">-</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">Not Trained</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-lg font-semibold text-foreground mb-6">Actual vs Predicted Sales (Last 30 Days)</h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={actualVsPredictedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} tickMargin={10} minTickGap={30} />
                <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '0.5rem', color: 'var(--foreground)' }}
                  itemStyle={{ fontWeight: 500 }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="actual" name="Actual Sales" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="predicted" name="Predicted (XGBoost)" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
    </ProtectedRoute>
  );
}
