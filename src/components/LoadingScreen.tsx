import React, { useEffect, useState } from 'react';
import { MotorcycleSilhouette } from './MotorcycleSilhouette';

interface LoadingScreenProps {
  onComplete?: () => void;
  durationMs?: number;
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  durationMs = 1800,
  message = 'CONNECTING RIG TELEMETRY',
}) => {
  const [subText, setSubText] = useState('Syncing ECU & Odometer...');
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const textTimer = setTimeout(() => {
      setSubText('Calibrating Component Wear Limits...');
    }, durationMs * 0.4);

    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, durationMs - 300);

    const finishTimer = setTimeout(() => {
      onComplete?.();
    }, durationMs);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [durationMs, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#131313] flex flex-col items-center justify-center p-6 select-none transition-opacity duration-300 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ffbb13]/5 via-transparent to-transparent pointer-events-none" />

      {/* Center content container */}
      <div className="relative flex flex-col items-center justify-center gap-6 max-w-xs text-center z-10">
        {/* Motorcycle silhouette with subtle technical HUD ring */}
        <div className="relative flex items-center justify-center w-56 h-36">
          {/* Subtle radar / telemetry ring */}
          <div className="absolute inset-0 rounded-full border border-[#2a2a29] scale-110 animate-pulse pointer-events-none" />
          <div className="absolute inset-0 rounded-full border border-[#ffbb13]/20 scale-125 pointer-events-none" />

          {/* Motorcycle Silhouette */}
          <MotorcycleSilhouette className="w-48 h-auto" glow={true} />
        </div>

        {/* 3 Animated Yellow Dots */}
        <div className="flex items-center justify-center gap-2.5 pt-2">
          <span
            className="w-3 h-3 rounded-full bg-[#ffbb13] shadow-[0_0_12px_#ffbb13] animate-bounce"
            style={{ animationDuration: '0.8s', animationDelay: '0s' }}
          />
          <span
            className="w-3 h-3 rounded-full bg-[#ffbb13] shadow-[0_0_12px_#ffbb13] animate-bounce"
            style={{ animationDuration: '0.8s', animationDelay: '0.2s' }}
          />
          <span
            className="w-3 h-3 rounded-full bg-[#ffbb13] shadow-[0_0_12px_#ffbb13] animate-bounce"
            style={{ animationDuration: '0.8s', animationDelay: '0.4s' }}
          />
        </div>

        {/* Technical Status Copy */}
        <div className="flex flex-col items-center gap-1 mt-1">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#e4e2e0] uppercase font-mono">
            {message}
          </span>
          <span className="text-[11px] text-[#8e9192] font-mono">
            {subText}
          </span>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-40 h-1 bg-[#252627] rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-[#ffbb13] rounded-full transition-all duration-1000 ease-out"
            style={{ width: isFading ? '100%' : '75%' }}
          />
        </div>
      </div>
    </div>
  );
};
