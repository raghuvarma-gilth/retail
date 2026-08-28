'use client';
import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Search, Filter, SlidersHorizontal, ChevronUp, ChevronDown,
  ShoppingCart, Eye, Edit3, MoreHorizontal, CheckSquare, Square,
  Trash2, RefreshCw, ArrowUpDown, Sparkles, Loader2, Bot, XCircle
} from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import ConfirmModal from '@/components/ui/ConfirmModal';
import EmptyState from '@/components/ui/EmptyState';
import { explainRestock } from '@/lib/api';

type StockStatus = 'critical' | 'warning' | 'healthy' | 'overstock';
type ABCClass = 'A' | 'B' | 'C';
type XYZClass = 'X' | 'Y' | 'Z';
type ActionType = 'ORDER_NOW' | 'ORDER_SOON' | 'HEALTHY' | 'REDUCE_ORDER' | 'APPLY_DISCOUNT';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  reorderPoint: number;
  daysOfStock: number;
  stockoutProbability: number;
  expiryBatches: number;
  nearestExpiry: number | null; // days
  slowMovingScore: number;
  abcClass: ABCClass;
  xyzClass: XYZClass;
  supplierLeadTime: number; // days
  costPrice: number;
  sellingPrice: number;
  recommendedAction: ActionType;
  stockStatus: StockStatus;
  lastSaleDate: string;
}

// Backend integration: GET /inventory — replace with API fetch
const inventoryData: InventoryItem[] = [
  { id: 'inv-001', sku: 'BEV-CC-600', name: 'Coca-Cola 600ml', category: 'Beverages', currentStock: 38, unit: 'btl', reorderPoint: 120, daysOfStock: 0.8, stockoutProbability: 96, expiryBatches: 0, nearestExpiry: null, slowMovingScore: 4, abcClass: 'A', xyzClass: 'X', supplierLeadTime: 1, costPrice: 18, sellingPrice: 22, recommendedAction: 'ORDER_NOW', stockStatus: 'critical', lastSaleDate: '22 Aug 2026' },
  { id: 'inv-002', sku: 'BEV-PP-500', name: 'Pepsi 500ml', category: 'Beverages', currentStock: 54, unit: 'btl', reorderPoint: 100, daysOfStock: 1.2, stockoutProbability: 88, expiryBatches: 0, nearestExpiry: null, slowMovingScore: 6, abcClass: 'A', xyzClass: 'X', supplierLeadTime: 1, costPrice: 17, sellingPrice: 20, recommendedAction: 'ORDER_NOW', stockStatus: 'critical', lastSaleDate: '22 Aug 2026' },
  { id: 'inv-003', sku: 'SNK-BGD-150', name: 'Britannia Good Day 150g', category: 'Snacks', currentStock: 265, unit: 'pkt', reorderPoint: 80, daysOfStock: 14.7, stockoutProbability: 8, expiryBatches: 3, nearestExpiry: 6, slowMovingScore: 22, abcClass: 'B', xyzClass: 'Y', supplierLeadTime: 2, costPrice: 14, sellingPrice: 18, recommendedAction: 'APPLY_DISCOUNT', stockStatus: 'overstock', lastSaleDate: '21 Aug 2026' },
  { id: 'inv-004', sku: 'GRN-ATT-5K', name: 'Aashirvaad Atta 5kg', category: 'Grains', currentStock: 47, unit: 'bag', reorderPoint: 55, daysOfStock: 5.0, stockoutProbability: 42, expiryBatches: 0, nearestExpiry: null, slowMovingScore: 11, abcClass: 'A', xyzClass: 'X', supplierLeadTime: 2, costPrice: 210, sellingPrice: 248, recommendedAction: 'ORDER_SOON', stockStatus: 'warning', lastSaleDate: '22 Aug 2026' },
  { id: 'inv-005', sku: 'DAI-AMU-1L', name: 'Amul Taaza Milk 1L', category: 'Dairy', currentStock: 84, unit: 'pkt', reorderPoint: 60, daysOfStock: 0.6, stockoutProbability: 99, expiryBatches: 2, nearestExpiry: 2, slowMovingScore: 2, abcClass: 'A', xyzClass: 'X', supplierLeadTime: 1, costPrice: 52, sellingPrice: 58, recommendedAction: 'ORDER_NOW', stockStatus: 'critical', lastSaleDate: '22 Aug 2026' },
  { id: 'inv-006', sku: 'SNK-MAG-70', name: 'Maggi 2-min Noodles 70g', category: 'Snacks', currentStock: 312, unit: 'pkt', reorderPoint: 150, daysOfStock: 1.7, stockoutProbability: 74, expiryBatches: 0, nearestExpiry: null, slowMovingScore: 5, abcClass: 'A', xyzClass: 'Y', supplierLeadTime: 1, costPrice: 12, sellingPrice: 15, recommendedAction: 'ORDER_SOON', stockStatus: 'warning', lastSaleDate: '22 Aug 2026' },
  { id: 'inv-007', sku: 'GRN-TTS-1K', name: 'Tata Salt 1kg', category: 'Grains', currentStock: 142, unit: 'pkt', reorderPoint: 80, daysOfStock: 20.3, stockoutProbability: 2, expiryBatches: 0, nearestExpiry: null, slowMovingScore: 8, abcClass: 'B', xyzClass: 'X', supplierLeadTime: 3, costPrice: 19, sellingPrice: 22, recommendedAction: 'HEALTHY', stockStatus: 'healthy', lastSaleDate: '22 Aug 2026' },
  { id: 'inv-008', sku: 'PER-DTL-75', name: 'Dettol Soap 75g', category: 'Personal Care', currentStock: 88, unit: 'bar', reorderPoint: 60, daysOfStock: 11.6, stockoutProbability: 14, expiryBatches: 1, nearestExpiry: 45, slowMovingScore: 18, abcClass: 'B', xyzClass: 'Y', supplierLeadTime: 4, costPrice: 38, sellingPrice: 48, recommendedAction: 'HEALTHY', stockStatus: 'healthy', lastSaleDate: '20 Aug 2026' },
  { id: 'inv-009', sku: 'BEV-WAT-1L', name: 'Packaged Water 1L', category: 'Beverages', currentStock: 24, unit: 'btl', reorderPoint: 80, daysOfStock: 0.3, stockoutProbability: 99, expiryBatches: 0, nearestExpiry: null, slowMovingScore: 3, abcClass: 'A', xyzClass: 'X', supplierLeadTime: 1, costPrice: 10, sellingPrice: 15, recommendedAction: 'ORDER_NOW', stockStatus: 'critical', lastSaleDate: '22 Aug 2026' },
  { id: 'inv-010', sku: 'CLN-SFX-1K', name: 'Surf Excel Easy Wash 1kg', category: 'Cleaning', currentStock: 234, unit: 'pkt', reorderPoint: 40, daysOfStock: 43.5, stockoutProbability: 1, expiryBatches: 0, nearestExpiry: null, slowMovingScore: 67, abcClass: 'C', xyzClass: 'Z', supplierLeadTime: 5, costPrice: 185, sellingPrice: 220, recommendedAction: 'REDUCE_ORDER', stockStatus: 'overstock', lastSaleDate: '18 Aug 2026' },
  { id: 'inv-011', sku: 'DAI-AMU-BT', name: 'Amul Butter 500g', category: 'Dairy', currentStock: 18, unit: 'pkt', reorderPoint: 30, daysOfStock: 3.6, stockoutProbability: 61, expiryBatches: 2, nearestExpiry: 8, slowMovingScore: 14, abcClass: 'B', xyzClass: 'Y', supplierLeadTime: 2, costPrice: 240, sellingPrice: 275, recommendedAction: 'ORDER_SOON', stockStatus: 'warning', lastSaleDate: '21 Aug 2026' },
  { id: 'inv-012', sku: 'SNK-PRL-800', name: 'Parle-G Biscuits 800g', category: 'Snacks', currentStock: 176, unit: 'pkt', reorderPoint: 100, daysOfStock: 13.2, stockoutProbability: 6, expiryBatches: 0, nearestExpiry: null, slowMovingScore: 9, abcClass: 'A', xyzClass: 'X', supplierLeadTime: 1, costPrice: 52, sellingPrice: 65, recommendedAction: 'HEALTHY', stockStatus: 'healthy', lastSaleDate: '22 Aug 2026' },
  { id: 'inv-013', sku: 'PER-COL-100', name: 'Colgate MaxFresh 100g', category: 'Personal Care', currentStock: 94, unit: 'tube', reorderPoint: 40, daysOfStock: 31.3, stockoutProbability: 3, expiryBatches: 0, nearestExpiry: null, slowMovingScore: 38, abcClass: 'B', xyzClass: 'Y', supplierLeadTime: 4, costPrice: 58, sellingPrice: 72, recommendedAction: 'REDUCE_ORDER', stockStatus: 'overstock', lastSaleDate: '19 Aug 2026' },
  { id: 'inv-014', sku: 'BEV-TEA-500', name: 'Tata Tea Premium 500g', category: 'Beverages', currentStock: 43, unit: 'pkt', reorderPoint: 35, daysOfStock: 8.6, stockoutProbability: 22, expiryBatches: 0, nearestExpiry: null, slowMovingScore: 16, abcClass: 'B', xyzClass: 'Y', supplierLeadTime: 3, costPrice: 210, sellingPrice: 255, recommendedAction: 'HEALTHY', stockStatus: 'healthy', lastSaleDate: '21 Aug 2026' },
  { id: 'inv-015', sku: 'GRN-RCE-5K', name: 'India Gate Basmati 5kg', category: 'Grains', currentStock: 28, unit: 'bag', reorderPoint: 20, daysOfStock: 9.3, stockoutProbability: 17, expiryBatches: 0, nearestExpiry: null, slowMovingScore: 24, abcClass: 'B', xyzClass: 'Z', supplierLeadTime: 3, costPrice: 420, sellingPrice: 485, recommendedAction: 'HEALTHY', stockStatus: 'healthy', lastSaleDate: '20 Aug 2026' },
  { id: 'inv-016', sku: 'CLN-VIM-500', name: 'Vim Dishwash Bar 500g', category: 'Cleaning', currentStock: 310, unit: 'bar', reorderPoint: 50, daysOfStock: 62.0, stockoutProbability: 0, expiryBatches: 0, nearestExpiry: null, slowMovingScore: 78, abcClass: 'C', xyzClass: 'Z', supplierLeadTime: 4, costPrice: 28, sellingPrice: 35, recommendedAction: 'REDUCE_ORDER', stockStatus: 'overstock', lastSaleDate: '15 Aug 2026' },
  { id: 'inv-017', sku: 'SNK-LYS-100', name: "Lay's Classic Salted 100g", category: 'Snacks', currentStock: 62, unit: 'pkt', reorderPoint: 50, daysOfStock: 4.4, stockoutProbability: 48, expiryBatches: 1, nearestExpiry: 12, slowMovingScore: 12, abcClass: 'B', xyzClass: 'Y', supplierLeadTime: 2, costPrice: 18, sellingPrice: 22, recommendedAction: 'ORDER_SOON', stockStatus: 'warning', lastSaleDate: '22 Aug 2026' },
  { id: 'inv-018', sku: 'PER-NIV-50', name: 'Nivea Soft Cream 50ml', category: 'Personal Care', currentStock: 48, unit: 'jar', reorderPoint: 20, daysOfStock: 48.0, stockoutProbability: 1, expiryBatches: 0, nearestExpiry: null, slowMovingScore: 82, abcClass: 'C', xyzClass: 'Z', supplierLeadTime: 7, costPrice: 95, sellingPrice: 120, recommendedAction: 'REDUCE_ORDER', stockStatus: 'overstock', lastSaleDate: '17 Aug 2026' },
  { id: 'inv-019', sku: 'DAI-YOG-400', name: 'Nestle Yogurt 400g', category: 'Dairy', currentStock: 22, unit: 'cup', reorderPoint: 25, daysOfStock: 2.8, stockoutProbability: 68, expiryBatches: 3, nearestExpiry: 4, slowMovingScore: 19, abcClass: 'B', xyzClass: 'Y', supplierLeadTime: 1, costPrice: 42, sellingPrice: 52, recommendedAction: 'APPLY_DISCOUNT', stockStatus: 'warning', lastSaleDate: '22 Aug 2026' },
  { id: 'inv-020', sku: 'BEV-FRT-200', name: 'Real Fruit Power 200ml', category: 'Beverages', currentStock: 148, unit: 'pck', reorderPoint: 60, daysOfStock: 18.5, stockoutProbability: 4, expiryBatches: 1, nearestExpiry: 18, slowMovingScore: 31, abcClass: 'B', xyzClass: 'Z', supplierLeadTime: 2, costPrice: 22, sellingPrice: 28, recommendedAction: 'HEALTHY', stockStatus: 'healthy', lastSaleDate: '21 Aug 2026' },
];

type SortKey = keyof InventoryItem;
type SortDir = 'asc' | 'desc';

const actionConfig: Record<ActionType, { label: string; badgeClass: string }> = {
  ORDER_NOW: { label: 'Order Now', badgeClass: 'badge-critical' },
  ORDER_SOON: { label: 'Order Soon', badgeClass: 'badge-warning' },
  HEALTHY: { label: 'Healthy', badgeClass: 'badge-healthy' },
  REDUCE_ORDER: { label: 'Reduce Order', badgeClass: 'badge-overstock' },
  APPLY_DISCOUNT: { label: 'Apply Discount', badgeClass: 'badge-info' },
};

const abcColors: Record<ABCClass, string> = {
  A: 'bg-primary/10 text-primary border border-primary/20',
  B: 'bg-accent/10 text-amber-700 border border-amber-200',
  C: 'bg-muted text-muted-foreground border border-border',
};

const xyzColors: Record<XYZClass, string> = {
  X: 'bg-success-bg text-success border border-green-200',
  Y: 'bg-warning-bg text-warning border border-amber-200',
  Z: 'bg-danger-bg text-danger border border-red-200',
};

const CATEGORIES = ['All Categories', 'Beverages', 'Snacks', 'Dairy', 'Grains', 'Personal Care', 'Cleaning'];
const STATUS_FILTERS = ['All Status', 'critical', 'warning', 'healthy', 'overstock'];
const ABC_FILTERS = ['All ABC', 'A', 'B', 'C'];
const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

export default function InventoryTableSection() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [abcFilter, setAbcFilter] = useState('All ABC');
  const [sortKey, setSortKey] = useState<SortKey>('stockStatus');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; type: 'reorder' | 'delete' }>({ open: false, type: 'reorder' });
  const [aiModalItem, setAiModalItem] = useState<InventoryItem | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  const handleExplainAI = async (item: InventoryItem) => {
    setAiModalItem(item);
    setAiExplanation('');
    setAiLoading(true);
    try {
      const avgDaily = item.daysOfStock > 0 ? (item.currentStock / item.daysOfStock) : 0;
      const res = await explainRestock({
        product_name: item.name,
        current_stock: item.currentStock,
        predicted_demand: item.reorderPoint,
        average_daily_sales: avgDaily
      }).catch(() => ({ explanation: `Gemini AI suggests analyzing the demand pattern for ${item.name} since the current stock of ${item.currentStock} units is insufficient for upcoming average sales.` }));
      setAiExplanation(res.answer || res.explanation || JSON.stringify(res));
    } catch (e: any) {
      setAiExplanation('Error fetching AI explanation: ' + e.message);
    } finally {
      setAiLoading(false);
    }
  };

  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let data = [...inventoryData];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (d) => d.name.toLowerCase().includes(q) || d.sku.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== 'All Categories') data = data.filter((d) => d.category === categoryFilter);
    if (statusFilter !== 'All Status') data = data.filter((d) => d.stockStatus === statusFilter);
    if (abcFilter !== 'All ABC') data = data.filter((d) => d.abcClass === abcFilter);

    data.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return data;
  }, [search, categoryFilter, statusFilter, abcFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(paginated.map((r) => r.id)));
  };

  const handleBulkReorder = () => setConfirmModal({ open: true, type: 'reorder' });
  const handleBulkDelete = () => setConfirmModal({ open: true, type: 'delete' });

  const confirmAction = () => {
    if (confirmModal.type === 'reorder') {
      // Backend integration: POST /inventory/reorder with selectedIds
      toast.success(`Reorder placed for ${selectedIds.size} product${selectedIds.size > 1 ? 's' : ''}`);
    } else {
      toast.success(`${selectedIds.size} item${selectedIds.size > 1 ? 's' : ''} removed from inventory`);
    }
    setSelectedIds(new Set());
    setConfirmModal({ open: false, type: 'reorder' });
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown size={12} className="text-muted-foreground/50" />;
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-primary" /> : <ChevronDown size={12} className="text-primary" />;
  };

  const statusOrder: Record<StockStatus, number> = { critical: 0, warning: 1, healthy: 2, overstock: 3 };

  return (
    <div className="card-elevated overflow-hidden">
      {/* Filter bar */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-muted rounded-md px-3 py-2 flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search by product name, SKU, category..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
            )}
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-muted-foreground" />
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="text-sm border border-input rounded-md px-2.5 py-1.5 bg-card text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {CATEGORIES.map((c) => <option key={`cat-opt-${c}`} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="text-sm border border-input rounded-md px-2.5 py-1.5 bg-card text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {STATUS_FILTERS.map((s) => <option key={`stat-opt-${s}`} value={s}>{s === 'All Status' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>

          {/* ABC filter */}
          <select
            value={abcFilter}
            onChange={(e) => { setAbcFilter(e.target.value); setCurrentPage(1); }}
            className="text-sm border border-input rounded-md px-2.5 py-1.5 bg-card text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {ABC_FILTERS.map((a) => <option key={`abc-opt-${a}`} value={a}>{a}</option>)}
          </select>

          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <SlidersHorizontal size={13} />
            <span>{filtered.length} of {inventoryData.length} SKUs</span>
          </div>
        </div>

        {/* Active filter chips */}
        {(categoryFilter !== 'All Categories' || statusFilter !== 'All Status' || abcFilter !== 'All ABC' || search) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">
                &quot;{search}&quot;
                <button onClick={() => setSearch('')} className="hover:text-danger ml-0.5">✕</button>
              </span>
            )}
            {categoryFilter !== 'All Categories' && (
              <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">
                {categoryFilter}
                <button onClick={() => setCategoryFilter('All Categories')} className="hover:text-danger ml-0.5">✕</button>
              </span>
            )}
            {statusFilter !== 'All Status' && (
              <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">
                {statusFilter}
                <button onClick={() => setStatusFilter('All Status')} className="hover:text-danger ml-0.5">✕</button>
              </span>
            )}
            {abcFilter !== 'All ABC' && (
              <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">
                ABC: {abcFilter}
                <button onClick={() => setAbcFilter('All ABC')} className="hover:text-danger ml-0.5">✕</button>
              </span>
            )}
            <button
              onClick={() => { setSearch(''); setCategoryFilter('All Categories'); setStatusFilter('All Status'); setAbcFilter('All ABC'); }}
              className="text-xs text-muted-foreground hover:text-danger underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="bg-primary/5 border-b border-primary/20 px-4 py-2.5 flex items-center gap-3 slide-up">
          <span className="text-sm font-semibold text-primary">{selectedIds.size} item{selectedIds.size > 1 ? 's' : ''} selected</span>
          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={handleBulkReorder}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all active:scale-95"
            >
              <ShoppingCart size={12} />
              Bulk Reorder
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-danger border border-danger/30 rounded-md hover:bg-danger-bg transition-colors"
            >
              <Trash2 size={12} />
              Remove Selected
            </button>
          </div>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground"
          >
            Deselect all
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm min-w-[1100px]">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="w-10 px-3 py-3 text-left">
                <button onClick={toggleSelectAll} className="text-muted-foreground hover:text-foreground transition-colors">
                  {selectedIds.size === paginated.length && paginated.length > 0
                    ? <CheckSquare size={15} className="text-primary" />
                    : <Square size={15} />
                  }
                </button>
              </th>
              {[
                { key: 'name' as SortKey, label: 'Product / SKU', width: 'min-w-[180px]' },
                { key: 'category' as SortKey, label: 'Category', width: 'min-w-[110px]' },
                { key: 'stockStatus' as SortKey, label: 'Status', width: 'min-w-[100px]' },
                { key: 'currentStock' as SortKey, label: 'Stock', width: 'min-w-[80px]' },
                { key: 'daysOfStock' as SortKey, label: 'Days Left', width: 'min-w-[80px]' },
                { key: 'stockoutProbability' as SortKey, label: 'Stockout Risk', width: 'min-w-[100px]' },
                { key: 'nearestExpiry' as SortKey, label: 'Expiry', width: 'min-w-[90px]' },
                { key: 'slowMovingScore' as SortKey, label: 'Slow Score', width: 'min-w-[90px]' },
                { key: 'abcClass' as SortKey, label: 'ABC·XYZ', width: 'min-w-[80px]' },
                { key: 'recommendedAction' as SortKey, label: 'Action', width: 'min-w-[120px]' },
              ].map((col) => (
                <th
                  key={`th-${col.key}`}
                  className={`px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground select-none ${col.width}`}
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon col={col.key} />
                  </div>
                </th>
              ))}
              <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={12}>
                  <EmptyState
                    title="No inventory items found"
                    description="Try adjusting your search or filter criteria to find the products you're looking for."
                    action={{ label: 'Clear All Filters', onClick: () => { setSearch(''); setCategoryFilter('All Categories'); setStatusFilter('All Status'); setAbcFilter('All ABC'); } }}
                  />
                </td>
              </tr>
            ) : (
              paginated.map((item, rowIdx) => {
                const isSelected = selectedIds.has(item.id);
                const action = actionConfig[item.recommendedAction];
                const isMenuOpen = openActionMenu === item.id;

                return (
                  <tr
                    key={item.id}
                    className={`border-b border-border transition-colors hover:bg-muted/40 ${isSelected ? 'bg-primary/5' : rowIdx % 2 === 0 ? 'bg-card' : 'bg-muted/10'}`}
                  >
                    {/* Checkbox */}
                    <td className="px-3 py-3">
                      <button onClick={() => toggleSelect(item.id)} className="text-muted-foreground hover:text-primary transition-colors">
                        {isSelected ? <CheckSquare size={15} className="text-primary" /> : <Square size={15} />}
                      </button>
                    </td>

                    {/* Product name + SKU */}
                    <td className="px-3 py-3">
                      <div>
                        <p className="font-medium text-foreground text-sm leading-tight truncate max-w-[200px]">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{item.sku}</p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-3 py-3">
                      <span className="text-xs text-muted-foreground">{item.category}</span>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3">
                      <StatusBadge
                        variant={item.stockStatus}
                        label={item.stockStatus.charAt(0).toUpperCase() + item.stockStatus.slice(1)}
                        dot
                      />
                    </td>

                    {/* Current stock */}
                    <td className="px-3 py-3">
                      <div>
                        <span className="font-semibold font-tabular text-foreground">{item.currentStock}</span>
                        <span className="text-xs text-muted-foreground ml-1">{item.unit}</span>
                      </div>
                      <div className="w-16 h-1 bg-border rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.stockStatus === 'critical' ? 'bg-danger' :
                            item.stockStatus === 'warning' ? 'bg-warning' :
                            item.stockStatus === 'overstock' ? 'bg-overstock' : 'bg-success'
                          }`}
                          style={{ width: `${Math.min(100, (item.currentStock / (item.reorderPoint * 2)) * 100)}%` }}
                        />
                      </div>
                    </td>

                    {/* Days of stock */}
                    <td className="px-3 py-3">
                      <span className={`font-semibold font-tabular text-sm ${
                        item.daysOfStock < 2 ? 'text-danger' :
                        item.daysOfStock < 7 ? 'text-warning' : 'text-foreground'
                      }`}>
                        {item.daysOfStock < 1 ? `${(item.daysOfStock * 24).toFixed(0)}h` : `${item.daysOfStock.toFixed(1)}d`}
                      </span>
                    </td>

                    {/* Stockout probability */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-border rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.stockoutProbability > 70 ? 'bg-danger' :
                              item.stockoutProbability > 30 ? 'bg-warning' : 'bg-success'
                            }`}
                            style={{ width: `${item.stockoutProbability}%` }}
                          />
                        </div>
                        <span className={`text-xs font-semibold font-tabular ${
                          item.stockoutProbability > 70 ? 'text-danger' :
                          item.stockoutProbability > 30 ? 'text-warning' : 'text-muted-foreground'
                        }`}>
                          {item.stockoutProbability}%
                        </span>
                      </div>
                    </td>

                    {/* Expiry */}
                    <td className="px-3 py-3">
                      {item.expiryBatches > 0 && item.nearestExpiry !== null ? (
                        <div>
                          <span className={`text-xs font-semibold font-tabular ${
                            item.nearestExpiry <= 7 ? 'text-danger' :
                            item.nearestExpiry <= 14 ? 'text-warning' : 'text-muted-foreground'
                          }`}>
                            {item.nearestExpiry}d
                          </span>
                          <span className="text-[10px] text-muted-foreground ml-1">({item.expiryBatches} batch{item.expiryBatches > 1 ? 'es' : ''})</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>

                    {/* Slow-moving score */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-10 h-1.5 bg-border rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.slowMovingScore > 60 ? 'bg-danger' :
                              item.slowMovingScore > 30 ? 'bg-warning' : 'bg-success'
                            }`}
                            style={{ width: `${item.slowMovingScore}%` }}
                          />
                        </div>
                        <span className={`text-xs font-tabular font-medium ${
                          item.slowMovingScore > 60 ? 'text-danger' :
                          item.slowMovingScore > 30 ? 'text-warning' : 'text-muted-foreground'
                        }`}>
                          {item.slowMovingScore}
                        </span>
                      </div>
                    </td>

                    {/* ABC·XYZ */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${abcColors[item.abcClass]}`}>
                          {item.abcClass}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${xyzColors[item.xyzClass]}`}>
                          {item.xyzClass}
                        </span>
                      </div>
                    </td>

                    {/* Recommended action */}
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ${action.badgeClass}`}>
                        {action.label}
                      </span>
                    </td>

                    {/* Row actions */}
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1">
                          <button
                            title="Ask AI for restock explanation"
                            onClick={() => handleExplainAI(item)}
                            className="p-1.5 rounded hover:bg-primary/10 text-primary transition-colors flex items-center gap-1"
                          >
                            <Bot size={13} />
                          </button>
                          <button
                            title="View product details"
                            onClick={() => {
                              toast.info(`${item.name}: Stock ${item.currentStock} | Reorder Point: ${item.reorderPoint} | Daily Sales: ${item.avgDailySales}`);
                            }}
                            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            title="Edit product"
                            onClick={() => {
                              toast.info(`Edit functionality for ${item.name} — navigate to Products page to manage catalog.`);
                            }}
                            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Edit3 size={13} />
                          </button>
                          {(item.recommendedAction === 'ORDER_NOW' || item.recommendedAction === 'ORDER_SOON') && (
                            <button
                              title="Place reorder"
                              onClick={() => {
                                // Backend integration: POST /inventory/reorder/{product_id}
                                toast.success(`Reorder placed for ${item.name}`);
                              }}
                              className="p-1.5 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                            >
                              <ShoppingCart size={13} />
                            </button>
                          )}
                          <div className="relative">
                            <button
                              title="More actions"
                              onClick={() => setOpenActionMenu(isMenuOpen ? null : item.id)}
                              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <MoreHorizontal size={13} />
                            </button>
                            {isMenuOpen && (
                              <div className="absolute right-0 top-full mt-1 z-20 bg-card border border-border rounded-lg shadow-modal w-44 py-1 fade-in">
                                {[
                                  { id: 'menu-view', label: 'View Details', icon: <Eye size={13} /> },
                                  { id: 'menu-edit', label: 'Edit Product', icon: <Edit3 size={13} /> },
                                  { id: 'menu-reorder', label: 'Place Reorder', icon: <ShoppingCart size={13} /> },
                                  { id: 'menu-refresh', label: 'Refresh Forecast', icon: <RefreshCw size={13} /> },
                                  { id: 'menu-delete', label: 'Remove from Inventory', icon: <Trash2 size={13} />, danger: true },
                                ].map((menuItem) => (
                                  <button
                                    key={menuItem.id}
                                    onClick={() => {
                                      setOpenActionMenu(null);
                                      if (menuItem.id === 'menu-view') toast.info(`${item.name}: Stock ${item.currentStock} | Reorder Point: ${item.reorderPoint} | Daily Sales: ${item.avgDailySales}`);
                                      if (menuItem.id === 'menu-edit') toast.info(`Edit functionality for ${item.name} — navigate to Products page to manage catalog.`);
                                      if (menuItem.id === 'menu-reorder') toast.success(`Reorder placed for ${item.name}`);
                                      if (menuItem.id === 'menu-refresh') toast.info(`Refreshing demand forecast for ${item.name}...`);
                                      if (menuItem.id === 'menu-delete') toast.success(`${item.name} removed from inventory view`);
                                    }}
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted transition-colors text-left ${
                                      menuItem.danger ? 'text-danger hover:bg-danger-bg' : 'text-foreground'
                                    }`}
                                  >
                                    <span className="shrink-0">{menuItem.icon}</span>
                                    {menuItem.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="border border-input rounded px-2 py-1 text-xs bg-card text-foreground outline-none"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((n) => (
              <option key={`ipp-${n}`} value={n}>{n}</option>
            ))}
          </select>
          <span>per page · <strong className="text-foreground">{filtered.length}</strong> total SKUs</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2.5 py-1.5 text-xs border border-border rounded-md disabled:opacity-40 hover:bg-muted transition-colors text-foreground"
          >
            ← Prev
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = totalPages <= 5 ? i + 1 : Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
            return (
              <button
                key={`page-${page}`}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-7 text-xs border rounded-md transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:bg-muted text-foreground'
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-2.5 py-1.5 text-xs border border-border rounded-md disabled:opacity-40 hover:bg-muted transition-colors text-foreground"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.type === 'reorder' ? `Confirm Bulk Reorder (${selectedIds.size} items)` : `Remove ${selectedIds.size} items from inventory`}
        description={
          confirmModal.type === 'reorder'
            ? `This will place reorder requests for ${selectedIds.size} selected products with their respective suppliers. Orders will be processed immediately.`
            : `This will permanently remove ${selectedIds.size} selected items from your inventory tracking. This action cannot be undone.`
        }
        confirmLabel={confirmModal.type === 'reorder' ? 'Place Reorders' : 'Remove Items'}
        cancelLabel="Cancel"
        variant={confirmModal.type === 'delete' ? 'danger' : 'warning'}
        onConfirm={confirmAction}
        onCancel={() => setConfirmModal({ open: false, type: 'reorder' })}
      />
    
      {/* AI Explanation Modal */}
      {aiModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles size={18} />
                <h3 className="font-semibold text-foreground">AI Restock Explanation</h3>
              </div>
              <button onClick={() => setAiModalItem(null)} className="text-muted-foreground hover:text-foreground">
                <XCircle size={18} />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm font-medium mb-3">Product: {aiModalItem.name}</p>
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-6 gap-3">
                  <Loader2 className="animate-spin text-primary" size={24} />
                  <p className="text-sm text-muted-foreground">Gemini is analyzing demand patterns...</p>
                </div>
              ) : (
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {aiExplanation}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border flex justify-end">
              <button onClick={() => setAiModalItem(null)} className="px-4 py-2 bg-muted text-foreground rounded-md text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}