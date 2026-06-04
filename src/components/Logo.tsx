import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

export default function Logo({ className = '', iconOnly = false, size = 'md', onClick }: LogoProps) {
  // Dimensions map based on size
  const iconSizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl'
  };

  const subtitleSizeClasses = {
    sm: 'text-[8px] px-1 py-0.2',
    md: 'text-[10px] px-2 py-0.5',
    lg: 'text-[12px] px-2.5 py-0.5',
    xl: 'text-[14px] px-3 py-1'
  };

  // Clean, modern abstract icon: Comfortable, premium, and minimalist "Data Nest"
  // It features 3 stacked glassmorphic database servers, a clean central neural backbone, 
  // and glowing connectivity nodes inside a soft, elegant circular frame.
  const logoIcon = (
    <motion.div
      className={`relative ${iconSizeClasses[size]} shrink-0`}
      whileHover="hover"
    >
      {/* Background glow shadow blur effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#00D9FF]/20 via-[#4F8CFF]/15 to-[#6C63FF]/20 rounded-full filter blur-md opacity-60 group-hover:opacity-100 group-hover:scale-105 transition duration-300" />
      
      {/* Intuitively designed glassmorphic SVG */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_8px_rgba(0,217,255,0.18)] relative z-10"
      >
        <defs>
          {/* Main Core Gradient */}
          <linearGradient id="nestMainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" />
            <stop offset="50%" stopColor="#4F8CFF" />
            <stop offset="100%" stopColor="#6C63FF" />
          </linearGradient>

          {/* Clean Glass Backing Filler */}
          <linearGradient id="glassFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.06} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.01} />
          </linearGradient>
        </defs>

        {/* Outer Circular Boundary (Clean Minimalist Nest) */}
        <circle 
          cx="50" 
          cy="50" 
          r="41" 
          stroke="url(#nestMainGrad)" 
          strokeWidth="1.5" 
          strokeOpacity="0.25" 
          fill="url(#glassFillGrad)" 
        />

        {/* Central Connectivity Backbone (Relativity and Intelligence Connector) */}
        <line 
          x1="50" 
          y1="22" 
          x2="50" 
          y2="78" 
          stroke="url(#nestMainGrad)" 
          strokeWidth="2.5" 
          strokeOpacity="0.4"
          strokeLinecap="round" 
        />

        {/* Three stacked clean database rings representing cloud nodes/nested storage */}
        {/* Top Disk */}
        <ellipse
          cx="50"
          cy="34"
          rx="18"
          ry="6.5"
          stroke="url(#nestMainGrad)"
          strokeWidth="2"
          fill="#0B1020"
          fillOpacity="0.6"
        />
        
        {/* Middle Disk */}
        <ellipse
          cx="50"
          cy="50"
          rx="18"
          ry="6.5"
          stroke="url(#nestMainGrad)"
          strokeWidth="2"
          fill="#0B1020"
          fillOpacity="0.6"
        />
        
        {/* Bottom Disk */}
        <ellipse
          cx="50"
          cy="66"
          rx="18"
          ry="6.5"
          stroke="url(#nestMainGrad)"
          strokeWidth="2"
          fill="#0B1020"
          fillOpacity="0.6"
        />

        {/* Outer Minimal Pillar Rails */}
        <line x1="32" y1="34" x2="32" y2="66" stroke="url(#nestMainGrad)" strokeWidth="1" strokeOpacity="0.2" />
        <line x1="68" y1="34" x2="68" y2="66" stroke="url(#nestMainGrad)" strokeWidth="1" strokeOpacity="0.2" />

        {/* Core Intelligence Nodes (Extremely Clean Connectivity Highlights) */}
        {/* Central Core Pulse Indicator */}
        <circle 
          cx="50" 
          cy="50" 
          r="4.5" 
          fill="#FFFFFF" 
          className="shadow-[0_0_10px_#00D9FF]" 
        />
        <circle 
          cx="50" 
          cy="50" 
          r="7" 
          stroke="#00D9FF" 
          strokeWidth="1" 
          strokeOpacity="0.5" 
          className="animate-ping" 
          style={{ transformOrigin: '50px 50px' }} 
        />

        {/* Top Node */}
        <circle cx="50" cy="34" r="2.5" fill="#00D9FF" />

        {/* Bottom Node */}
        <circle cx="50" cy="66" r="2.5" fill="#6C63FF" />
      </svg>
    </motion.div>
  );

  if (iconOnly) {
    return (
      <div 
        onClick={onClick}
        className={`inline-block group ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        {logoIcon}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center space-x-3 select-none group ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {logoIcon}
      
      {/* Brand logo lettering */}
      <div className="flex flex-col items-start text-left">
        <div className="flex items-center">
          <span className={`${textSizeClasses[size]} font-display font-black tracking-tight uppercase transition duration-300 group-hover:tracking-normal`}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] via-[#4F8CFF] to-[#6C63FF]">
              DATANEST
            </span>
          </span>
        </div>
        {size !== 'sm' && (
          <span className="text-[9px] text-[#94A3B8] font-mono leading-none tracking-wider uppercase font-semibold">
            Next-Gen Intelligence Engine
          </span>
        )}
      </div>
    </div>
  );
}
