'use client';
import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardKPIGrid from './components/DashboardKPIGrid';
import DashboardChartsRow from './components/DashboardChartsRow';
import CriticalActionFeed from './components/CriticalActionFeed';
import FestivalWeatherStrip from './components/FestivalWeatherStrip';
import DashboardHeader from './components/DashboardHeader';
import RecentOrders from './components/RecentOrders';

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['owner']}>
      <AppLayout>
        <div className="space-y-6">
          <DashboardHeader />
          <FestivalWeatherStrip />
          <DashboardKPIGrid />
          <RecentOrders />
          <DashboardChartsRow />
          <CriticalActionFeed />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}