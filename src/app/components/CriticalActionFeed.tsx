'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  ShoppingCart, AlertTriangle, Tag, Package, TrendingDown,
  ChevronDown, ChevronUp, CheckCircle, XCircle, Info,
  Zap
} from 'lucide-react';


type Priority = 'critical' | 'important' | 'opportunity';
type ActionType = 'ORDER_NOW' | 'ORDER_SOON' | 'APPLY_DISCOUNT' | 'REDUCE_ORDER' | 'INVESTIGATE_ANOMALY' | 'CREATE_BUNDLE';

interface Recommendation {
  id: string;
  productName: string;
  sku: string;
  actionType: ActionType;
  priority: Priority;
  priorityScore: number;
  headline: string;
  explanation: string;
  whyFactors: string[];
  expectedImpact: string;
  suggestedAction: string;
  dismissed: boolean;
  accepted: boolean;
}

const recommendations: Recommendation[] = [
  {
    id: 'rec-001',
    productName: 'Coca-Cola 600ml',
    sku: 'BEV-CC-600',
    actionType: 'ORDER_NOW',
    priority: 'critical',
    priorityScore: 94,
    headline: 'Order 240 units NOW — stockout in 18 hours',
    explanation: 'Current stock of 38 units will run out by tomorrow morning at current sell rate. Weekend demand is 34% higher than weekday average. Supplier lead time is 6 hours.',
    whyFactors: [
      'Current stock: 38 units (0.8 days remaining)',
      'Weekend sell rate: 47 units/day (+34% vs weekday)',
      'Stockout probability: 96% by tomorrow 8am',
      'Revenue at risk: ₹4,284 if stockout occurs',
    ],
    expectedImpact: 'Prevents ₹4,284 revenue loss. Maintains category availability.',
    suggestedAction: 'Place order for 240 units with Bharat Distributors',
    dismissed: false,
    accepted: false,
  },
  {
    id: 'rec-002',
    productName: 'Britannia Good Day 150g',
    sku: 'SNK-BGD-150',
    actionType: 'APPLY_DISCOUNT',
    priority: 'critical',
    priorityScore: 88,
    headline: 'Apply 20% discount — 3 batches expiring in 6 days',
    explanation: 'Batch #BGD-2408-03 (120 units), #BGD-2408-04 (85 units), #BGD-2408-05 (60 units) expire on 28 Aug. At current sell rate of 18 units/day, 187 units will remain unsold — worth ₹2,805 in losses.',
    whyFactors: [
      'Expiry: 6 days remaining across 265 units',
      'Current sell rate: 18 units/day',
      'Predicted unsold at expiry: 157 units',
      'Financial loss at 0% discount: ₹2,355',
      '20% discount increases demand by estimated 2.4×',
    ],
    expectedImpact: 'Reduces waste loss from ₹2,355 to ₹420. Recovers ₹1,935.',
    suggestedAction: 'Apply ₹2/unit discount, display near checkout',
    dismissed: false,
    accepted: false,
  },
  {
    id: 'rec-003',
    productName: 'Bottled Water 1L (Generic)',
    sku: 'BEV-WAT-1L',
    actionType: 'INVESTIGATE_ANOMALY',
    priority: 'critical',
    priorityScore: 82,
    headline: 'Sales anomaly detected — 4.2× above 30-day baseline',
    explanation: 'Bottled water sold 312 units today vs a 30-day average of 74 units/day. Isolation Forest model flagged this as a statistical anomaly (z-score: 3.8). Possible causes: local event, data entry error, or unusual bulk purchase.',
    whyFactors: [
      'Today: 312 units vs 30d avg of 74 units',
      'Anomaly score: 3.8 standard deviations',
      'Pattern: single large transaction at 11:42am',
      'Similar anomaly occurred 15 Aug (confirmed bulk buy)',
    ],
    expectedImpact: 'If genuine demand, reorder needed within 4 hours.',
    suggestedAction: 'Verify transaction records and check stock levels',
    dismissed: false,
    accepted: false,
  },
  {
    id: 'rec-004',
    productName: 'Aashirvaad Atta 5kg',
    sku: 'GRN-ATT-5K',
    actionType: 'ORDER_SOON',
    priority: 'important',
    priorityScore: 71,
    headline: 'Reorder 50 bags — 5 days of stock remaining',
    explanation: 'Current stock of 47 bags will last approximately 5 days at the current 9.4 bags/day demand. Ganesh Chaturthi in 8 days is expected to boost demand by 28%. Reorder point is 55 bags.',
    whyFactors: [
      'Stock: 47 bags (5 days remaining)',
      'Reorder point: 55 bags (already below)',
      'Festival multiplier: +28% for Ganesh Chaturthi',
      'Supplier lead time: 2 days',
    ],
    expectedImpact: 'Prevents stockout during festival peak. Estimated ₹1,820 revenue protected.',
    suggestedAction: 'Order 50 bags from Aashirvaad Distributors by EOD',
    dismissed: false,
    accepted: false,
  },
  {
    id: 'rec-005',
    productName: 'Maggi 2-min Noodles + Parle-G Bundle',
    sku: 'BUNDLE-MNP',
    actionType: 'CREATE_BUNDLE',
    priority: 'opportunity',
    priorityScore: 64,
    headline: 'Bundle opportunity — 78% co-purchase lift detected',
    explanation: 'Market basket analysis shows Maggi 70g and Parle-G 800g are purchased together in 34% of Maggi transactions, with a lift of 2.8×. A ₹5 bundle discount could increase basket size by an estimated ₹12 per transaction.',
    whyFactors: [
      'Co-purchase rate: 34% of Maggi transactions',
      'Association lift: 2.8× (very strong signal)',
      'Confidence: 78% — Maggi buyers buy Parle-G',
      'Estimated 40-60 daily Maggi transactions',
    ],
    expectedImpact: 'Estimated +₹480-720 additional daily revenue from bundle upsell.',
    suggestedAction: 'Create "Snack Combo" bundle at ₹38 (saves ₹5)',
    dismissed: false,
    accepted: false,
  },
];

const actionConfig: Record<ActionType, { label: string; icon: React.ReactNode; color: string }> = {
  ORDER_NOW: { label: 'ORDER NOW', icon: <ShoppingCart size={12} />, color: 'bg-danger text-white' },
  ORDER_SOON: { label: 'ORDER SOON', icon: <ShoppingCart size={12} />, color: 'bg-warning text-white' },
  APPLY_DISCOUNT: { label: 'APPLY DISCOUNT', icon: <Tag size={12} />, color: 'bg-orange-500 text-white' },
  REDUCE_ORDER: { label: 'REDUCE ORDER', icon: <TrendingDown size={12} />, color: 'bg-info text-white' },
  INVESTIGATE_ANOMALY: { label: 'INVESTIGATE', icon: <AlertTriangle size={12} />, color: 'bg-purple-600 text-white' },
  CREATE_BUNDLE: { label: 'CREATE BUNDLE', icon: <Package size={12} />, color: 'bg-success text-white' },
};

const priorityBadge: Record<Priority, { variant: 'critical' | 'warning' | 'healthy'; emoji: string }> = {
  critical: { variant: 'critical', emoji: '🔴' },
  important: { variant: 'warning', emoji: '🟠' },
  opportunity: { variant: 'healthy', emoji: '🟢' },
};

function RecommendationCard({ rec, onAccept, onDismiss }: {
  rec: Recommendation;
  onAccept: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const action = actionConfig[rec.actionType];
  const pb = priorityBadge[rec.priority];

  if (rec.dismissed) return null;
  if (rec.accepted) {
    return (
      <div className="card-elevated p-4 border-success/30 bg-success-bg flex items-center gap-3 fade-in">
        <CheckCircle size={16} className="text-success shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-success">{rec.productName} — Action accepted</p>
          <p className="text-xs text-muted-foreground">{rec.suggestedAction}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated overflow-hidden slide-up">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            <span className="text-base">{pb.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${action.color}`}>
                {action.icon}
                {action.label}
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                Score: {rec.priorityScore}/100
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground leading-snug">{rec.headline}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              <span className="font-medium text-foreground">{rec.productName}</span>
              {' '}· SKU: {rec.sku}
            </p>
          </div>
          <button
            onClick={() => setExpanded((p) => !p)}
            className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors shrink-0"
            title={expanded ? 'Collapse explanation' : 'Expand explanation'}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Explanation — Explainable AI */}
        {expanded && (
          <div className="mt-3 ml-7 fade-in">
            <div className="bg-muted/60 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Zap size={12} className="text-accent" />
                <span className="text-[11px] font-semibold text-foreground uppercase tracking-wide">Why this recommendation?</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{rec.explanation}</p>
              <div className="space-y-1">
                {rec.whyFactors.map((factor, fi) => (
                  <div key={`factor-${rec.id}-${fi}`} className="flex items-start gap-2 text-xs">
                    <span className="text-primary font-bold mt-0.5 shrink-0">·</span>
                    <span className="text-foreground">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs bg-success-bg border border-green-200 rounded-lg p-2.5">
              <Info size={12} className="text-success mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-success">Expected Impact: </span>
                <span className="text-muted-foreground">{rec.expectedImpact}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-2 mt-3 ml-7">
          <button
            onClick={() => onAccept(rec.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all active:scale-95"
          >
            <CheckCircle size={12} />
            Accept &amp; Act
          </button>
          <button
            onClick={() => onDismiss(rec.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground border border-border rounded-md hover:bg-muted transition-colors"
          >
            <XCircle size={12} />
            Dismiss
          </button>
          <span className="ml-auto text-[11px] text-muted-foreground hidden sm:block">
            {rec.suggestedAction}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CriticalActionFeed() {
  const [recs, setRecs] = useState<Recommendation[]>(recommendations);

  const handleAccept = (id: string) => {
    setRecs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, accepted: true } : r))
    );
    // Backend integration: POST /recommendations/{id}/accept
    toast.success('Action accepted — added to your task queue');
  };

  const handleDismiss = (id: string) => {
    setRecs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, dismissed: true } : r))
    );
    // Backend integration: POST /recommendations/{id}/dismiss
    toast.info('Recommendation dismissed');
  };

  const active = recs.filter((r) => !r.dismissed && !r.accepted);
  const critical = active.filter((r) => r.priority === 'critical');
  const important = active.filter((r) => r.priority === 'important');
  const opportunity = active.filter((r) => r.priority === 'opportunity');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Decision Intelligence Feed</h2>
          <p className="text-xs text-muted-foreground">AI-generated prioritized actions · Updated 2 min ago</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="badge-critical inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold">
            🔴 {critical.length} Critical
          </span>
          <span className="badge-warning inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold">
            🟠 {important.length} Important
          </span>
          <span className="badge-healthy inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold">
            🟢 {opportunity.length} Opportunity
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {active.length === 0 ? (
          <div className="card-elevated p-8 flex flex-col items-center text-center">
            <CheckCircle size={32} className="text-success mb-3" />
            <p className="text-sm font-semibold text-foreground">All clear — no pending actions</p>
            <p className="text-xs text-muted-foreground mt-1">RetailMind AI will surface new recommendations as conditions change.</p>
          </div>
        ) : (
          recs.map((rec) => (
            <RecommendationCard
              key={rec.id}
              rec={rec}
              onAccept={handleAccept}
              onDismiss={handleDismiss}
            />
          ))
        )}
      </div>
    </div>
  );
}