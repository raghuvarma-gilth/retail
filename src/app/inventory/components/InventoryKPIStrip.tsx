import React from 'react';
import { Package, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

const kpis = [
  {
    id: 'inv-kpi-total',
    label: 'Total Active SKUs',
    value: '342',
    sub: '18 added this month',
    icon: <Package size={16} />,
    variant: 'default',
  },
  {
    id: 'inv-kpi-critical',
    label: 'Critical Stockouts',
    value: '7',
    sub: '3 out of stock now',
    icon: <AlertTriangle size={16} />,
    variant: 'danger',
  },
  {
    id: 'inv-kpi-expiry',
    label: 'Expiry Alerts',
    value: '12',
    sub: '₹8,240 at risk',
    icon: <Clock size={16} />,
    variant: 'warning',
  },
  {
    id: 'inv-kpi-overstock',
    label: 'Overstock Items',
    value: '28',
    sub: '₹41,200 excess value',
    icon: <TrendingUp size={16} />,
    variant: 'overstock',
  },
];

const variantStyles = {
  default: { wrap: 'card-elevated', icon: 'bg-muted text-muted-foreground', val: 'text-foreground' },
  danger: { wrap: 'card-elevated border-danger/30 bg-danger-bg', icon: 'bg-danger/10 text-danger', val: 'text-danger' },
  warning: { wrap: 'card-elevated border-warning/30 bg-warning-bg', icon: 'bg-warning/10 text-warning', val: 'text-warning' },
  overstock: { wrap: 'card-elevated border-overstock/30 bg-overstock-bg', icon: 'bg-overstock/10 text-overstock', val: 'text-overstock' },
};

export default function InventoryKPIStrip() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {kpis.map((k) => {
        const s = variantStyles[k.variant as keyof typeof variantStyles];
        return (
          <div key={k.id} className={`${s.wrap} p-4 flex items-center gap-3`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.icon}`}>
              {k.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{k.label}</p>
              <p className={`text-xl font-bold font-tabular ${s.val}`}>{k.value}</p>
              <p className="text-xs text-muted-foreground truncate">{k.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}