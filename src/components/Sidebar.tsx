'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import AppLogo from '@/components/ui/AppLogo';
import { LayoutDashboard, Package, Boxes, TrendingUp, AlertTriangle, Users, BarChart3, Lightbulb, FlaskConical, Settings, ChevronLeft, ChevronRight, LogOut, Store, ClipboardList } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  group: string;
}

const navItems: NavItem[] = [
  { id: 'nav-dashboard', label: 'Dashboard', href: '/', icon: <LayoutDashboard size={18} />, group: 'main' },
  { id: 'nav-products', label: 'Products', href: '/products', icon: <Package size={18} />, group: 'main' },
  { id: 'nav-inventory', label: 'Inventory', href: '/inventory', icon: <Boxes size={18} />, badge: 7, group: 'main' },
  { id: 'nav-orders', label: 'Orders', href: '/owner-orders', icon: <ClipboardList size={18} />, group: 'main' },
  { id: 'nav-forecast', label: 'Demand Forecast', href: '/demand-forecast', icon: <TrendingUp size={18} />, group: 'intelligence' },
  { id: 'nav-expiry', label: 'Expiry Intelligence', href: '/expiry-intelligence', icon: <AlertTriangle size={18} />, badge: 5, group: 'intelligence' },
  { id: 'nav-customers', label: 'Customer Insights', href: '/customer-insights', icon: <Users size={18} />, group: 'intelligence' },
  { id: 'nav-analytics', label: 'Analytics', href: '/analytics', icon: <BarChart3 size={18} />, group: 'intelligence' },
  { id: 'nav-recommendations', label: 'Recommendations', href: '/recommendations', icon: <Lightbulb size={18} />, badge: 3, group: 'intelligence' },
  { id: 'nav-model', label: 'Model Performance', href: '/model-performance', icon: <FlaskConical size={18} />, group: 'system' },
  { id: 'nav-settings', label: 'Settings', href: '/settings', icon: <Settings size={18} />, group: 'system' },
];

const groupLabels: Record<string, string> = {
  main: 'Operations',
  intelligence: 'Intelligence',
  system: 'System',
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const displayName = user?.displayName || 'Store Owner';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const groups = ['main', 'intelligence', 'system'];

  return (
    <aside
      className={`sidebar-transition flex flex-col h-full bg-card border-r border-border ${
        collapsed ? 'w-16 min-w-[64px]' : 'w-60 min-w-[240px]'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 px-3 border-b border-border ${collapsed ? 'justify-center' : 'gap-2 px-4'}`}>
        <AppLogo size={32} />
        {!collapsed && (
          <div className="flex flex-col leading-none">
            <span className="font-bold text-sm text-foreground tracking-tight">RetailMind</span>
            <span className="text-xs text-muted-foreground font-medium">AI Platform</span>
          </div>
        )}
      </div>

      {/* Store Info */}
      {!collapsed && (
        <div className="mx-3 mt-3 mb-1 px-3 py-2 bg-secondary rounded-md">
          <div className="flex items-center gap-2">
            <Store size={14} className="text-primary" />
            <div className="min-w-0">
              <p className="text-xs font-600 text-foreground truncate font-semibold">Sharma General Store</p>
              <p className="text-xs text-muted-foreground">Bangalore, KA</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-2">
        {groups.map((group) => {
          const items = navItems.filter((n) => n.group === group);
          return (
            <div key={`group-${group}`} className="mb-1">
              {!collapsed && (
                <p className="px-4 py-1.5 text-[10px] font-600 uppercase tracking-widest text-muted-foreground font-semibold">
                  {groupLabels[group]}
                </p>
              )}
              {collapsed && <div className="border-t border-border mx-2 my-1" />}
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`group relative flex items-center gap-3 mx-2 px-2.5 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:bg-muted hover:text-foreground'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <span className={`shrink-0 ${isActive ? 'text-primary' : ''}`}>{item.icon}</span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && item.badge !== undefined && (
                      <span className="ml-auto text-[10px] font-700 font-bold bg-danger text-white rounded-full px-1.5 py-0.5 leading-none">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge !== undefined && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
                    )}
                    {/* Tooltip for collapsed */}
                    {collapsed && (
                      <span className="pointer-events-none absolute left-full ml-2 z-50 whitespace-nowrap rounded-md bg-foreground text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        {item.label}
                        {item.badge !== undefined && ` (${item.badge})`}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border p-2">
        {!collapsed ? (
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || 'Store Owner'}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-danger transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <button onClick={handleLogout} title="Sign out" className="p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={`w-full flex items-center justify-center gap-2 mt-1 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ${collapsed ? '' : ''}`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}