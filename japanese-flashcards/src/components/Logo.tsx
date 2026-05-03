import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 40 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background Shape (Flashcard) */}
      <rect x="10" y="15" width="80" height="70" rx="12" fill="currentColor" fillOpacity="0.1" />
      <rect x="10" y="15" width="80" height="70" rx="12" stroke="currentColor" strokeWidth="4" />
      
      {/* Torii Gate Symbol */}
      <path 
        d="M25 40C35 37 65 37 75 40" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round" 
      />
      <path 
        d="M30 48H70" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
      />
      <path 
        d="M40 40V75" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round" 
      />
      <path 
        d="M60 40V75" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round" 
      />
      <path 
        d="M20 35C35 32 65 32 80 35" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        opacity="0.5"
      />
    </svg>
  );
};

export default Logo;
