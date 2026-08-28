'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const products = [
  { id: 'prod-amul', name: 'Amul Taaza 1L', today: 142, avg7d: 118, aboveAvg: true },
  { id: 'prod-parle', name: 'Parle-G 800g', today: 128, avg7d: 134, aboveAvg: false },
  { id: 'prod-atta', name: 'Aashirvaad Atta 5kg', today: 94, avg7d: 87, aboveAvg: true },
  { id: 'prod-maggi', name: 'Maggi 2-min 70g', today: 187, avg7d: 152, aboveAvg: true },
  { id: 'prod-coke', name: 'Coca-Cola 600ml', today: 213, avg7d: 178, aboveAvg: true },
  { id: 'prod-dettol', name: 'Dettol Soap 75g', today: 76, avg7d: 88, aboveAvg: false },
  { id: 'prod-tata', name: 'Tata Salt 1kg', today: 68, avg7d: 71, aboveAvg: false },
  { id: 'prod-surf', name: 'Surf Excel 1kg', today: 54, avg7d: 43, aboveAvg: true },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{value: number; name: string; color: string}>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-card p-3 text-xs">
      <p className="font-semibold text-foreground mb-2 max-w-[160px] leading-tight">{label}</p>
      {payload.map((p, i) => (
        <div key={`bar-tip-${i}`} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name === 'today' ? 'Today' : '7d Avg'}:</span>
          <span className="font-semibold text-foreground">{p.value} units</span>
        </div>
      ))}
    </div>
  );
};

export default function TopProductsChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={products} margin={{ top: 4, right: 8, left: 0, bottom: 40 }} barSize={14} barGap={3}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
          angle={-30}
          textAnchor="end"
          interval={0}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="today" name="today" radius={[3, 3, 0, 0]}>
          {products.map((p) => (
            <Cell key={p.id} fill={p.aboveAvg ? 'var(--primary)' : 'var(--muted-foreground)'} />
          ))}
        </Bar>
        <Bar dataKey="avg7d" name="avg7d" fill="var(--border)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}