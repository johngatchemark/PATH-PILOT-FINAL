import React from 'react';
import logoImg from '../assets/logo.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-20 w-auto',
    xl: 'h-28 w-auto'
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
        <div className={`absolute inset-0 bg-purple-500 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity rounded-full`} />
        <img 
          src={logoImg} 
          alt="PathPilot Logo" 
          className={`${sizeClasses[size]} relative transition-transform group-hover:scale-105 duration-500 object-contain`}
        />
      </div>
      {showText && (
        <span className={`${textSizeClasses[size]} font-extrabold tracking-tighter text-white shrink-0`}>
          Path<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B6D43] to-[#1E4D6B]">Pilot</span>
        </span>
      )}
    </div>
  );
};

export default Logo;

