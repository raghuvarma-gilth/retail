'use client';
import React from 'react';
import { Boxes, Download, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function InventoryPageHeader() {
  const handleExportCSV = () => {
    // Generate CSV from the static inventory data
    const headers = ['Product Name', 'SKU', 'Category', 'Stock', 'Status', 'Reorder Point'];
    const csvContent = [headers.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventory_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('Inventory data exported as CSV');
  };

  const handleAddProduct = () => {
    toast.info('To add products, go to the Products page where you can create and manage your catalog.');
    window.location.href = '/products';
  };

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Boxes size={18} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Real-time stock levels, reorder intelligence, and expiry risk across all 342 active SKUs
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground border border-border rounded-md hover:bg-muted transition-colors"
        >
          <Download size={14} />
          Export CSV
        </button>
        <button 
          onClick={handleAddProduct}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all active:scale-95"
        >
          <Plus size={14} />
          Add Product
        </button>
      </div>
    </div>
  );
}