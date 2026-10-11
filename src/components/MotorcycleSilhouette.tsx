import React from 'react';

interface MotorcycleSilhouetteProps {
  className?: string;
  glow?: boolean;
}

export const MotorcycleSilhouette: React.FC<MotorcycleSilhouetteProps> = ({
  className = 'w-48 h-auto',
  glow = false,
}) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {glow && (
        <div className="absolute inset-0 bg-[#ffbb13]/10 blur-xl rounded-full scale-125 pointer-events-none" />
      )}
      <svg
        viewBox="0 0 200 120"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-[#c6c6c6] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
      >
        {/* Rear Wheel */}
        <circle cx="45" cy="85" r="26" fill="none" stroke="currentColor" strokeWidth="6" />
        <circle cx="45" cy="85" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="45" cy="85" r="6" fill="currentColor" />

        {/* Front Wheel */}
        <circle cx="160" cy="82" r="30" fill="none" stroke="currentColor" strokeWidth="6" />
        <circle cx="160" cy="82" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="160" cy="82" r="6" fill="currentColor" />

        {/* Swingarm & Frame Body Silhouette */}
        <path
          d="M45 85 L85 82 L90 88 L45 88 Z"
          fill="currentColor"
        />
        {/* Engine Casing & Belly Pan */}
        <path
          d="M82 66 L118 64 L122 88 L86 91 Z"
          fill="currentColor"
        />
        {/* Main Frame & Tank */}
        <path
          d="M82 66 L95 48 C105 42 118 40 135 44 C145 47 150 56 142 66 L120 66 Z"
          fill="currentColor"
        />
        {/* Flat Dual Sport Seat */}
        <path
          d="M58 52 C72 52 88 50 102 46 C105 45 108 48 106 52 C94 56 75 58 60 56 Z"
          fill="currentColor"
        />
        {/* Tail Subframe & Rear Fender */}
        <path
          d="M58 53 L38 52 L32 58 L54 60 Z"
          fill="currentColor"
        />
        {/* Front Forks & Headstock */}
        <path
          d="M136 44 L160 82"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* High Adventure Front Beak */}
        <path
          d="M142 50 L174 46 L182 52 L150 57 Z"
          fill="currentColor"
        />
        {/* Flyscreen & Headlight cowl */}
        <path
          d="M140 42 L146 26 L152 28 L146 44 Z"
          fill="currentColor"
        />
        {/* Wide Offroad Handlebars */}
        <path
          d="M138 38 L142 32 L152 30"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Upswept High Exhaust Pipe */}
        <path
          d="M115 76 Q100 86 68 68 Q52 58 44 46"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Ground shadow */}
        <ellipse cx="102" cy="115" rx="80" ry="4" fill="#000000" fillOpacity="0.6" />
      </svg>
    </div>
  );
};
