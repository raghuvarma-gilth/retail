'use client';

import React, { memo } from 'react';
import { Sparkles } from 'lucide-react';

interface AppLogoProps {
  size?: number;
  className?: string;
  onClick?: () => void;
}

const AppLogo = memo(function AppLogo({
  size = 32,
  className = '',
  onClick,
}: AppLogoProps) {
  return (
    <div 
      className={`flex items-center justify-center bg-primary text-white rounded-md ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
      onClick={onClick}
      style={{ width: size, height: size }}
    >
      <Sparkles size={size * 0.6} />
    </div>
  );
});

export default AppLogo;
