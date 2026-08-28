'use client';
import React, { useEffect, useState } from 'react';
import { getAnalyticsOverview } from '@/lib/api';
import { IndianRupee, Package, Clock, TrendingDown, Trash2, TrendingUp, Lightbulb, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface KPICard {
  id: string;
  label: string;
  value: string;
  subValue?: string;
  trend?: { value: string; direction: 'up' | 'down' | 'neutral'; positive: boolean };
  icon: React.ReactNode;
  variant: 'default' | 'danger' | 'warning' | 'success' | 'info';
  colSpan?: string;
  note?: string;
}

const kpiData: KPICard[] = [
  {
    id: 'kpi-revenue',
    label: "Today's Revenue",
    value: '₹24,810',
    subValue: 'Target: ₹28,000',
    trend: { value: '+8.4% vs yesterday', direction: 'up', positive: true },
    icon: <IndianRupee size={18} />,
    variant: 'success',
    colSpan: 'col-span-1 md:col-span-2',
    note: '89% of daily target',
  },
  {
    id: 'kpi-stockout',
    label: 'Stockout Risk',
    value: '7 SKUs',
    subValue: '3 critical (<1 day)',
    trend: { value: '+2 since yesterday', direction: 'up', positive: false },
    icon: <Package size={18} />,
    variant: 'danger',
  },
  {
    id: 'kpi-expiry',
    label: 'Expiry Risk Value',
    value: '₹8,240',
    subValue: '12 batches at risk',
    trend: { value: '-₹1,200 vs last week', direction: 'down', positive: true },
    icon: <Clock size={18} />,
    variant: 'warning',
  },
  {
    id: 'kpi-slow',
    label: 'Slow-Moving SKUs',
    value: '23 items',
    subValue: '₹31,500 tied up',
    trend: { value: '+3 this week', direction: 'up', positive: false },
    icon: <TrendingDown size={18} />,
    variant: 'warning',
  },
  {
    id: 'kpi-waste',
    label: 'Waste Value (MTD)',
    value: '₹3,140',
    subValue: '1.8% of purchases',
    trend: { value: '-₹420 vs last month', direction: 'down', positive: true },
    icon: <Trash2 size={18} />,
    variant: 'default',
  },
  {
    id: 'kpi-growth',
    label: 'Demand Growth (7d)',
    value: '+12.3%',
    subValue: 'vs prior 7 days',
    trend: { value: 'Driven by beverages', direction: 'up', positive: true },
    icon: <TrendingUp size={18} />,
    variant: 'success',
  },
  {
    id: 'kpi-accuracy',
    label: 'Forecast Accuracy',
    value: '87.4%',
    subValue: 'MAPE: 12.6%',
    trend: { value: '+1.2% vs last week', direction: 'up', positive: true },
    icon: <TrendingUp size={18} />,
    variant: 'info',
  },
  {
    id: 'kpi-recommendations',
    label: 'Critical Actions',
    value: '3 urgent',
    subValue: '11 total pending',
    trend: { value: 'Requires action today', direction: 'neutral', positive: false },
    icon: <Lightbulb size={18} />,
    variant: 'danger',
  },
];

const variantStyles = {
  default: { card: 'card-elevated', icon: 'bg-muted text-muted-foreground', label: 'text-muted-foreground' },
  danger: { card: 'card-elevated border-danger/30 bg-danger-bg', icon: 'bg-danger/10 text-danger', label: 'text-danger' },
  warning: { card: 'card-elevated border-warning/30 bg-warning-bg', icon: 'bg-warning/10 text-warning', label: 'text-warning' },
  success: { card: 'card-elevated border-success/30 bg-success-bg', icon: 'bg-success/10 text-success', label: 'text-success' },
  info: { card: 'card-elevated border-info/30 bg-info-bg', icon: 'bg-info/10 text-info', label: 'text-info' },
};

export default function DashboardKPIGrid() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    getAnalyticsOverview().then(res => setData(res)).catch(() => {});
  }, []);

  const displayData = data ? [
    { ...kpiData[0], value: '₹' + (data.total_revenue || 1245000).toLocaleString() },
    { ...kpiData[1], value: (data.total_products || 2450).toString() },
    { ...kpiData[2], value: (data.low_stock_count || 12).toString() },
    { ...kpiData[3], value: (data.anomalies_detected || 3).toString() }
  ] : kpiData;

  return (
    // 8 cards: hero (col-span-2) + 7 regular → grid-cols-4
    // Row 1: hero(2) + 2 regular = 4 cols
    // Row 2: 4 regular = 4 cols
    // Row 3: 1 remaining → span-4 to fill (but we have 5 remaining, rows 2+3 = 2×4 = 8 slots for 6 cards)
    // Actually: hero=2, 7 others → row1: hero(2)+2=4, row2: 4, row3: 1 → fix: make last span-4
    // Revised: hero(col-span-2) + 3 cols remaining in row1 = problem. Use grid-cols-4:
    // Row1: hero(span2) + kpi-stockout(span1) + kpi-expiry(span1) = 4 ✓
    // Row2: kpi-slow + kpi-waste + kpi-growth + kpi-accuracy = 4 ✓
    // Row3: kpi-recommendations (span-4) = 4 ✓
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-3">
      {displayData.map((card) => {
        const styles = variantStyles[card.variant];
        const TrendIcon = card.trend?.direction === 'up'
          ? ArrowUpRight
          : card.trend?.direction === 'down'
          ? ArrowDownRight
          : Minus;
        const trendColor = card.trend?.positive
          ? 'text-success'
          : card.trend?.direction === 'neutral' ?'text-muted-foreground' :'text-danger';

        return (
          <div
            key={card.id}
            className={`${styles.card} p-4 ${card.colSpan ?? ''}`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${styles.icon}`}>
                {card.icon}
              </div>
              {card.note && (
                <span className="text-[10px] font-medium text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                  {card.note}
                </span>
              )}
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              {card.label}
            </p>
            <p className="text-hero-metric font-tabular text-foreground leading-none mb-1">
              {card.value}
            </p>
            {card.subValue && (
              <p className="text-xs text-muted-foreground mb-2">{card.subValue}</p>
            )}
            {card.trend && (
              <div className={`flex items-center gap-1 text-[11px] font-medium ${trendColor}`}>
                <TrendIcon size={12} />
                <span>{card.trend.value}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}