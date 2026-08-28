'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const SalesTrendChart = dynamic(() => import('./charts/SalesTrendChart'), { ssr: false });
const CategoryPieChart = dynamic(() => import('./charts/CategoryPieChart'), { ssr: false });
const TopProductsChart = dynamic(() => import('./charts/TopProductsChart'), { ssr: false });

export default function DashboardChartsRow() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Sales trend — wide */}
      <div className="lg:col-span-7 card-elevated p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">7-Day Sales Trend</h3>
            <p className="text-xs text-muted-foreground">With anomaly detection markers · INR</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" />Revenue</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-accent inline-block" />Transactions</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-danger inline-block" />Anomaly</span>
          </div>
        </div>
        <SalesTrendChart />
      </div>

      {/* Category pie */}
      <div className="lg:col-span-5 card-elevated p-4">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">Revenue by Category</h3>
          <p className="text-xs text-muted-foreground">Today&apos;s contribution split</p>
        </div>
        <CategoryPieChart />
      </div>

      {/* Top products bar */}
      <div className="lg:col-span-12 card-elevated p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Top 8 Products by Sales Velocity</h3>
            <p className="text-xs text-muted-foreground">Units sold today vs 7-day average</p>
          </div>
        </div>
        <TopProductsChart />
      </div>
    </div>
  );
}