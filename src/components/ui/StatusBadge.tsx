import React from 'react';

type BadgeVariant = 'critical' | 'warning' | 'healthy' | 'overstock' | 'info' | 'neutral';

interface StatusBadgeProps {
  variant: BadgeVariant;
  label: string;
  dot?: boolean;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ variant, label, dot = false, size = 'sm' }: StatusBadgeProps) {
  const cls: Record<BadgeVariant, string> = {
    critical: 'badge-critical',
    warning: 'badge-warning',
    healthy: 'badge-healthy',
    overstock: 'badge-overstock',
    info: 'badge-info',
    neutral: 'bg-muted text-muted-foreground border border-border',
  };
  const dotCls: Record<BadgeVariant, string> = {
    critical: 'bg-danger',
    warning: 'bg-warning',
    healthy: 'bg-success',
    overstock: 'bg-overstock',
    info: 'bg-info',
    neutral: 'bg-muted-foreground',
  };
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeClass} ${cls[variant]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotCls[variant]}`} />}
      {label}
    </span>
  );
}