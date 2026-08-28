'use client';
import AppLayout from '@/components/AppLayout';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertTriangle, Clock, TrendingDown, DollarSign, ArrowRight } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const EXPIRY_RISKS = [
  { id: 1, product: 'Britannia Good Day Cashew 600g', batch: 'B-4892', qty: 45, daysLeft: 4, wasteVal: 5400, risk: 92, action: 'Markdown 30%' },
  { id: 2, product: 'Amul Taaza Toned Milk 1L', batch: 'AM-9921', qty: 24, daysLeft: 2, wasteVal: 1632, risk: 98, action: 'Markdown 50%' },
  { id: 3, product: 'Haldiram Bhujia Sev 400g', batch: 'H-3211', qty: 15, daysLeft: 8, wasteVal: 1650, risk: 65, action: 'Prominent Display' },
  { id: 4, product: 'Nestle Yogurt Strawberry 400g', batch: 'NY-884', qty: 32, daysLeft: 5, wasteVal: 3840, risk: 85, action: 'Markdown 20%' },
  { id: 5, product: 'Gowardhan Paneer 200g', batch: 'GP-112', qty: 18, daysLeft: 3, wasteVal: 1530, risk: 95, action: 'Markdown 40%' },
  { id: 6, product: 'Modern Sandwich Bread 400g', batch: 'MB-093', qty: 20, daysLeft: 1, wasteVal: 900, risk: 99, action: 'Markdown 70%' },
  { id: 7, product: 'Kissan Mixed Fruit Jam 500g', batch: 'KJ-554', qty: 12, daysLeft: 14, wasteVal: 1740, risk: 45, action: 'Monitor' },
  { id: 8, product: 'Mother Dairy Classic Curd 400g', batch: 'MD-771', qty: 28, daysLeft: 6, wasteVal: 1960, risk: 75, action: 'Markdown 15%' },
];

const DISCOUNT_SIMULATION = [
  { discount: 0, profit: 450, waste: 2400 },
  { discount: 10, profit: 620, waste: 1800 },
  { discount: 20, profit: 850, waste: 1100 },
  { discount: 30, profit: 980, waste: 500 },
  { discount: 40, profit: 820, waste: 200 },
  { discount: 50, profit: 600, waste: 50 },
  { discount: 60, profit: 350, waste: 0 },
];

export default function ExpiryIntelligencePage() {
  return (
    <ProtectedRoute allowedRoles={['owner']}>
    <AppLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Expiry Intelligence</h1>
        <p className="text-sm text-muted-foreground mt-1">Minimize waste and optimize markdown pricing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[var(--danger)]/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-[var(--danger)]" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total At-Risk Value</div>
              <div className="text-xl font-bold text-foreground font-tabular">₹18,652</div>
            </div>
          </div>
        </div>
        
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[var(--danger)]/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-[var(--danger)]" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Expiring in 3 Days</div>
              <div className="text-xl font-bold text-foreground font-tabular">4 Batches</div>
            </div>
          </div>
        </div>

        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[var(--warning)]/10 rounded-lg">
              <Clock className="w-5 h-5 text-[var(--warning)]" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Expiring in 7 Days</div>
              <div className="text-xl font-bold text-foreground font-tabular">12 Batches</div>
            </div>
          </div>
        </div>

        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[var(--success)]/10 rounded-lg">
              <TrendingDown className="w-5 h-5 text-[var(--success)]" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Potential Savings</div>
              <div className="text-xl font-bold text-foreground font-tabular">₹14,230</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-elevated p-5">
          <h3 className="text-lg font-semibold mb-4">High Risk Batches</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-[var(--border)] text-muted-foreground font-medium">
                  <th className="pb-3 pr-4">Product & Batch</th>
                  <th className="pb-3 px-4 text-right">Qty</th>
                  <th className="pb-3 px-4 text-right">Days Left</th>
                  <th className="pb-3 px-4 text-right">Expected Waste</th>
                  <th className="pb-3 px-4 w-32">Risk Score</th>
                  <th className="pb-3 pl-4">AI Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {EXPIRY_RISKS.map(item => (
                  <tr key={item.id} className="hover:bg-[var(--background)] transition-colors">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-foreground">{item.product}</div>
                      <div className="text-xs text-muted-foreground">Batch: {item.batch}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-tabular">{item.qty}</td>
                    <td className="py-3 px-4 text-right font-tabular">
                      <span className={`font-medium ${item.daysLeft <= 3 ? 'text-[var(--danger)]' : 'text-[var(--warning)]'}`}>
                        {item.daysLeft}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-tabular">₹{item.wasteVal}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-[var(--background)] rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.risk > 80 ? 'bg-[var(--danger)]' : item.risk > 60 ? 'bg-[var(--warning)]' : 'bg-[var(--success)]'}`}
                            style={{ width: `${item.risk}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium tabular-nums w-6">{item.risk}</span>
                      </div>
                    </td>
                    <td className="py-3 pl-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        item.action.includes('Markdown') ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'bg-[var(--info)]/10 text-[var(--info)]'
                      }`}>
                        {item.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-elevated p-5 flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Discount Simulator</h3>
          <p className="text-xs text-muted-foreground mb-6">Select a batch to simulate discount impact</p>
          
          <div className="mb-4 p-3 bg-[var(--background)] rounded-lg border border-[var(--border)]">
            <div className="text-sm font-medium mb-1">Britannia Good Day Cashew 600g</div>
            <div className="text-xs text-muted-foreground flex justify-between">
              <span>Batch: B-4892</span>
              <span>Qty: 45</span>
            </div>
          </div>

          <div className="flex-1 min-h-[250px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DISCOUNT_SIMULATION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="discount" stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(val) => `${val}%`} />
                <YAxis yAxisId="left" stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(val) => `₹${val}`} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                  formatter={(value, name) => [`₹${value}`, name === 'profit' ? 'Expected Profit' : 'Expected Waste']}
                  labelFormatter={(label) => `Discount: ${label}%`}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line yAxisId="left" type="monotone" dataKey="profit" stroke="var(--success)" strokeWidth={2} name="Expected Profit" dot={{r: 4}} activeDot={{r: 6}} />
                <Line yAxisId="right" type="monotone" dataKey="waste" stroke="var(--danger)" strokeWidth={2} name="Expected Waste" dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 p-4 bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-[var(--primary)] rounded-full mt-0.5">
                <ArrowRight className="w-3 h-3 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--primary)]">AI Recommendation: 30% Markdown</div>
                <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  A 30% discount optimizes recovery, maximizing profit to ₹980 while keeping expected waste minimal (₹500). Higher discounts heavily erode margin without significant volume uplift.
                </div>
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
