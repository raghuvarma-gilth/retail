'use client';
import React from 'react';
import AppLayout from '@/components/AppLayout';
import InventoryKPIStrip from './components/InventoryKPIStrip';
import InventoryTableSection from './components/InventoryTableSection';
import InventoryPageHeader from './components/InventoryPageHeader';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function InventoryPage() {
  return (
    <ProtectedRoute allowedRoles={['owner']}>
    <AppLayout>
      <div className="space-y-5">
        <InventoryPageHeader />
        <InventoryKPIStrip />
        <InventoryTableSection />
      </div>
    </AppLayout>
    </ProtectedRoute>
  );
}