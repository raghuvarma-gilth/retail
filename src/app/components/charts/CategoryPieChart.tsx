'use client';
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { id: 'cat-bev', name: 'Beverages', value: 6820, pct: 27.5 },
  { id: 'cat-snack', name: 'Snacks & Namkeen', value: 5190, pct: 20.9 },
  { id: 'cat-dairy', name: 'Dairy & Eggs', value: 4340, pct: 17.5 },
  { id: 'cat-grain', name: 'Grains & Pulses', value: 3410, pct: 13.7 },
  { id: 'cat-personal', name: 'Personal Care', value: 2780, pct: 11.2 },
  { id: 'cat-other', name: 'Other', value: 2270, pct: 9.2 },
];

const COLORS = [
  'var(--primary)',
  'var(--accent)',
  'var(--success)',
  'var(--info)',
  'var(--overstock)',
  'var(--muted-foreground)',
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{payload: {name: string; value: number; pct: number}; color: string}> }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg shadow-card p-3 text-xs">
      <p className="font-semibold text-foreground mb-1">{d.name}</p>
      <p className="text-muted-foreground">Revenue: <span className="font-semibold text-foreground">₹{d.value.toLocaleString('en-IN')}</span></p>
      <p className="text-muted-foreground">Share: <span className="font-semibold text-foreground">{d.pct}%</span></p>
    </div>
  );
};

export default function CategoryPieChart() {
  return (
    <div>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={entry.id} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
        {data.map((d, i) => (
          <div key={d.id} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="text-[11px] text-muted-foreground truncate">{d.name}</span>
            <span className="text-[11px] font-semibold text-foreground ml-auto font-tabular">{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}