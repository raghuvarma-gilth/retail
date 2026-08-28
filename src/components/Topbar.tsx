'use client';
import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, RefreshCw, Calendar } from 'lucide-react';

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

export default function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [updatedText, setUpdatedText] = useState('Updated 2 min ago');

  const [topDateStr, setTopDateStr] = useState('28 Aug 2026');

  useEffect(() => {
    const d = new Date();
    setTopDateStr(d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
  }, []);

  return (
    <header className="h-14 bg-card border-b border-border flex items-center px-4 lg:px-6 gap-3 shrink-0">
      {/* Mobile menu */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className={`flex items-center gap-2 flex-1 max-w-sm transition-all duration-200 ${searchOpen ? 'ring-2 ring-primary/30' : ''} bg-muted rounded-md px-3 py-1.5`}>
        <Search size={14} className="text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder="Search products, SKUs, recommendations..."
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
          onFocus={() => setSearchOpen(true)}
          onBlur={() => setSearchOpen(false)}
        />
        <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-card border border-border rounded px-1.5 py-0.5 font-mono">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Last updated */}
        <button 
          onClick={() => {
            setIsRotating(true);
            setTimeout(() => {
              setIsRotating(false);
              setUpdatedText('Updated just now');
            }, 1000);
          }}
          className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted hover:bg-muted/80 rounded-md px-2.5 py-1.5 transition-colors"
        >
          <RefreshCw size={11} className={isRotating ? 'animate-spin' : ''} />
          <span>{updatedText}</span>
        </button>

        {/* Date */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground px-2.5 py-1.5">
          <Calendar size={11} />
          <span>{topDateStr}</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold cursor-pointer ml-1">
          RS
        </div>
      </div>
    </header>
  );
}