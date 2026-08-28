'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Home, Search, ShoppingCart, ClipboardList, User, LogOut, Store } from 'lucide-react';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navItems = [
    { href: '/shop', label: 'Shops', icon: <Home size={20} /> },
    { href: '/cart', label: 'Cart', icon: <ShoppingCart size={20} /> },
    { href: '/orders', label: 'Orders', icon: <ClipboardList size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Store size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">Retail Intelligence</h1>
              <p className="text-[10px] text-muted-foreground">Shop Smart</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">{user?.displayName || user?.email}</span>
            <button onClick={handleLogout} title="Sign out" className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-danger transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 max-w-5xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="sticky bottom-0 z-50 bg-card border-t border-border px-4 py-2 sm:py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
