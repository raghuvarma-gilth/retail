'use client';
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

const salesData = [
  { date: '16 Aug', revenue: 21400, transactions: 187, anomaly: false },
  { date: '17 Aug', revenue: 19800, transactions: 171, anomaly: false },
  { date: '18 Aug', revenue: 23100, transactions: 198, anomaly: false },
  { date: '19 Aug', revenue: 31200, transactions: 264, anomaly: true }, // weekend spike
  { date: '20 Aug', revenue: 28900, transactions: 241, anomaly: false },
  { date: '21 Aug', revenue: 22600, transactions: 193, anomaly: false },
  { date: '22 Aug', revenue: 24810, transactions: 212, anomaly: false },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{value: number; name: string; color: string}>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-card p-3 text-xs">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={`tip-${i}`} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-semibold text-foreground">
            {p.name === 'revenue' ? `₹${p.value.toLocaleString('en-IN')}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function SalesTrendChart() {
  const anomalyPoints = salesData.filter((d) => d.anomaly);
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradTxn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.12} />
            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <YAxis
          yAxisId="rev"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          width={44}
        />
        <YAxis yAxisId="txn" orientation="right" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} width={36} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          yAxisId="rev"
          type="monotone"
          dataKey="revenue"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#gradRevenue)"
        />
        <Area
          yAxisId="txn"
          type="monotone"
          dataKey="transactions"
          stroke="var(--accent)"
          strokeWidth={1.5}
          fill="url(#gradTxn)"
          strokeDasharray="4 2"
        />
        {anomalyPoints.map((pt, i) => (
          <ReferenceDot
            key={`anom-${i}`}
            yAxisId="rev"
            x={pt.date}
            y={pt.revenue}
            r={6}
            fill="var(--danger)"
            stroke="white"
            strokeWidth={2}
            label={{ value: '⚠', position: 'top', fontSize: 12 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}