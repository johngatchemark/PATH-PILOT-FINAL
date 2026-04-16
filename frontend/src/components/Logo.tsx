import React from 'react';
import { Compass } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative group">
        <div className={`absolute inset-0 bg-purple-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full`} />
        <Compass className={`${sizeClasses[size]} text-purple-500 relative transition-transform group-hover:rotate-12 duration-500`} />
      </div>
      {showText && (
        <span className={`${textSizeClasses[size]} font-extrabold tracking-tighter text-white shrink-0`}>
          Path<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Pilot</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
