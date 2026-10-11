import React, { useState } from 'react';
import { MotorcycleSilhouette } from './MotorcycleSilhouette';

interface BikeVisualProps {
  type?: 'xpulse' | 'gt650' | 'himalayan';
  photoUrl?: string;
  onUploadPhoto?: () => void;
  className?: string;
}

export const BikeVisual: React.FC<BikeVisualProps> = ({
  type = 'xpulse',
  photoUrl,
  onUploadPhoto,
  className = 'w-full h-auto',
}) => {
  const [viewMode, setViewMode] = useState<'default' | 'silhouette'>(
    photoUrl ? 'default' : 'default'
  );

  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-[#141516] p-3 group ${className}`}>
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2a2b2c]/60 via-[#161718]/40 to-transparent pointer-events-none" />

      {/* Switcher & Upload Action buttons overlay */}
      <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
        {photoUrl && (
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'default' ? 'silhouette' : 'default')}
            title="Toggle Picture / Silhouette"
            className="px-2 py-1 rounded-lg bg-[#1f201f]/90 border border-[#353534] text-[10px] text-[#e4e2e0] hover:text-[#ffbb13] flex items-center gap-1 shadow-md cursor-pointer transition-colors backdrop-blur-sm"
          >
            <span className="material-symbols-outlined text-[14px]">
              {viewMode === 'default' ? 'contrast' : 'photo'}
            </span>
            <span>{viewMode === 'default' ? 'Silhouette' : 'Photo'}</span>
          </button>
        )}

        {onUploadPhoto && (
          <button
            type="button"
            onClick={onUploadPhoto}
            title="Upload Motorcycle Picture"
            className="px-2 py-1 rounded-lg bg-[#1f201f]/90 border border-[#353534] text-[10px] text-[#e4e2e0] hover:text-[#ffbb13] flex items-center gap-1 shadow-md cursor-pointer transition-colors backdrop-blur-sm"
          >
            <span className="material-symbols-outlined text-[14px]">add_a_photo</span>
            <span>{photoUrl ? 'Change' : 'Add Photo'}</span>
          </button>
        )}
      </div>

      {/* VIEW 1: Custom Photo if provided and in default mode */}
      {photoUrl && viewMode === 'default' ? (
        <div className="relative w-full aspect-[16/9] max-h-[260px] flex items-center justify-center rounded-lg overflow-hidden">
          <img
            src={photoUrl}
            alt="Motorcycle"
            className="w-full h-full object-cover rounded-lg filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141516]/80 via-transparent to-transparent pointer-events-none" />
        </div>
      ) : viewMode === 'silhouette' ? (
        /* VIEW 2: Pure Minimalist Silhouette */
        <div className="w-full py-6 flex items-center justify-center">
          <MotorcycleSilhouette className="w-72 max-w-full h-auto text-[#c6c6c6]" glow={true} />
        </div>
      ) : (
        /* VIEW 3: Detailed Technical Vector Motorcycle */
        <svg
          viewBox="0 0 460 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full max-w-[420px] h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] select-none"
        >
          {/* Ground shadow */}
          <ellipse cx="230" cy="242" rx="180" ry="10" fill="#000000" fillOpacity="0.8" />
          <ellipse cx="230" cy="242" rx="130" ry="6" fill="#050505" fillOpacity="0.9" />

          {/* REAR WHEEL */}
          <g id="rear-wheel">
            <circle cx="100" cy="180" r="54" stroke="#222426" strokeWidth="14" fill="#0d0e0f" />
            <circle cx="100" cy="180" r="46" stroke="#383a3d" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="100" cy="180" r="38" stroke="#1c1d1f" strokeWidth="3" />
            <line x1="100" y1="180" x2="100" y2="128" stroke="#4a4d52" strokeWidth="1.2" strokeOpacity="0.6" />
            <line x1="100" y1="180" x2="100" y2="232" stroke="#4a4d52" strokeWidth="1.2" strokeOpacity="0.6" />
            <line x1="100" y1="180" x2="48" y2="180" stroke="#4a4d52" strokeWidth="1.2" strokeOpacity="0.6" />
            <line x1="100" y1="180" x2="152" y2="180" stroke="#4a4d52" strokeWidth="1.2" strokeOpacity="0.6" />
            <line x1="100" y1="180" x2="63" y2="143" stroke="#4a4d52" strokeWidth="1.2" strokeOpacity="0.6" />
            <line x1="100" y1="180" x2="137" y2="217" stroke="#4a4d52" strokeWidth="1.2" strokeOpacity="0.6" />
            <line x1="100" y1="180" x2="63" y2="217" stroke="#4a4d52" strokeWidth="1.2" strokeOpacity="0.6" />
            <line x1="100" y1="180" x2="137" y2="143" stroke="#4a4d52" strokeWidth="1.2" strokeOpacity="0.6" />
            <circle cx="100" cy="180" r="24" stroke="#5a5e64" strokeWidth="2" fill="#141516" />
            <circle cx="100" cy="180" r="16" fill="#202224" />
            <circle cx="100" cy="180" r="7" fill="#404347" />
            <circle cx="100" cy="180" r="60" stroke="#18191a" strokeWidth="3" strokeDasharray="4 6" />
          </g>

          {/* FRONT WHEEL */}
          <g id="front-wheel">
            <circle cx="360" cy="172" r="62" stroke="#222426" strokeWidth="14" fill="#0d0e0f" />
            <circle cx="360" cy="172" r="54" stroke="#383a3d" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="360" cy="172" r="44" stroke="#1c1d1f" strokeWidth="3" />
            <line x1="360" y1="172" x2="360" y2="112" stroke="#4a4d52" strokeWidth="1.2" strokeOpacity="0.6" />
            <line x1="360" y1="172" x2="360" y2="232" stroke="#4a4d52" strokeWidth="1.2" strokeOpacity="0.6" />
            <line x1="360" y1="172" x2="300" y2="172" stroke="#4a4d52" strokeWidth="1.2" strokeOpacity="0.6" />
            <line x1="360" y1="172" x2="420" y2="172" stroke="#4a4d52" strokeWidth="1.2" strokeOpacity="0.6" />
            <line x1="360" y1="172" x2="318" y2="130" stroke="#4a4d52" strokeWidth="1.2" strokeOpacity="0.6" />
            <line x1="360" y1="172" x2="402" y2="214" stroke="#4a4d52" strokeWidth="1.2" strokeOpacity="0.6" />
            <line x1="360" y1="172" x2="318" y2="214" stroke="#4a4d52" strokeWidth="1.2" strokeOpacity="0.6" />
            <line x1="360" y1="172" x2="402" y2="130" stroke="#4a4d52" strokeWidth="1.2" strokeOpacity="0.6" />
            <circle cx="360" cy="172" r="28" stroke="#686d75" strokeWidth="2.5" strokeDasharray="6 2" fill="none" />
            <circle cx="360" cy="172" r="14" fill="#202224" />
            <circle cx="360" cy="172" r="6" fill="#404347" />
            <path d="M344 158 L348 184 L336 182 L332 162 Z" fill="#303236" stroke="#4a4e54" strokeWidth="1" />
            <circle cx="360" cy="172" r="68" stroke="#18191a" strokeWidth="3" strokeDasharray="4 6" />
          </g>

          {/* SWINGARM & REAR MONOSHOCK */}
          <path d="M100 180 L195 174 L205 186 L100 184 Z" fill="#2b2d30" stroke="#3b3e42" strokeWidth="1.5" />
          <path d="M165 174 L180 138 L190 142 L175 176 Z" fill="#1d1e20" />
          <line x1="175" y1="140" x2="168" y2="170" stroke="#ffbb13" strokeWidth="6" strokeDasharray="4 3" />

          {/* DRIVE CHAIN */}
          <path d="M100 180 Q150 184 195 172" stroke="#4d5054" strokeWidth="3" strokeDasharray="3 2" fill="none" />
          <path d="M100 180 Q150 174 195 168" stroke="#4d5054" strokeWidth="2.5" strokeDasharray="3 2" fill="none" />

          {/* CRADLE FRAME & CHASSIS */}
          <path d="M195 174 L210 115 L295 105 L300 70 L260 78 L200 100 L185 140 Z" fill="#1d1f21" stroke="#2c2e32" strokeWidth="1.5" />
          <path d="M195 125 L110 115 L150 148 Z" fill="#222426" stroke="#323438" strokeWidth="1.2" />

          {/* ENGINE BLOCK */}
          <rect x="180" y="145" width="65" height="52" rx="8" fill="#1b1c1e" stroke="#2d2f33" strokeWidth="1.5" />
          <line x1="184" y1="152" x2="240" y2="152" stroke="#35383c" strokeWidth="2" />
          <line x1="184" y1="158" x2="240" y2="158" stroke="#35383c" strokeWidth="2" />
          <line x1="184" y1="164" x2="240" y2="164" stroke="#35383c" strokeWidth="2" />
          <line x1="184" y1="170" x2="240" y2="170" stroke="#35383c" strokeWidth="2" />
          <circle cx="215" cy="180" r="16" fill="#25272a" stroke="#404347" strokeWidth="1.5" />
          <circle cx="215" cy="180" r="6" fill="#141516" stroke="#ffbb13" strokeWidth="0.8" />
          <path d="M175 198 L248 198 L255 175 L248 175 L242 192 L180 192 Z" fill="#303236" stroke="#474b52" strokeWidth="1.2" />

          {/* EXHAUST SYSTEM */}
          <path d="M235 158 Q248 165 240 185 Q220 205 160 178 Q130 160 115 130" stroke="#3b3e42" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          <path d="M150 148 L100 125 L95 110 L155 136 Z" fill="#2a2c30" stroke="#50545c" strokeWidth="1.5" />
          <line x1="105" y1="120" x2="148" y2="142" stroke="#ffbb13" strokeWidth="1.5" strokeOpacity="0.8" />

          {/* FUEL TANK */}
          <path d="M205 105 C215 90 235 70 270 72 C295 73 310 88 295 115 C275 125 220 120 205 105 Z" fill="#1e2022" stroke="#35383c" strokeWidth="1.5" />
          <path d="M245 80 L285 88 L270 102 L235 95 Z" fill="#2c2e32" />
          <path d="M255 86 L278 92" stroke="#ffbb13" strokeWidth="2" strokeLinecap="round" />

          {/* SEAT */}
          <path d="M130 115 C150 115 180 112 215 105 C222 103 232 108 228 114 C205 118 160 122 135 120 Z" fill="#131415" stroke="#252729" strokeWidth="1.5" />
          <line x1="150" y1="116" x2="200" y2="111" stroke="#2d2f33" strokeWidth="1" strokeDasharray="2 3" />

          {/* REAR TAIL */}
          <path d="M125 116 L90 112 L75 120 L110 126 Z" fill="#1d1e20" stroke="#303236" strokeWidth="1.2" />
          <rect x="72" y="116" width="6" height="5" rx="1" fill="#ff4a4a" />

          {/* FRONT SUSPENSION FORKS */}
          <line x1="300" y1="70" x2="360" y2="172" stroke="#2e3034" strokeWidth="8" strokeLinecap="round" />
          <line x1="325" y1="112" x2="358" y2="168" stroke="#4b4e54" strokeWidth="6" strokeLinecap="round" />
          <line x1="312" y1="90" x2="332" y2="124" stroke="#18191a" strokeWidth="9" strokeDasharray="2 2" strokeLinecap="round" />

          {/* HIGH BEAK FENDER */}
          <path d="M305 92 L365 85 L390 94 L325 108 Z" fill="#1e2022" stroke="#35383c" strokeWidth="1.5" />

          {/* HEADLIGHT & FLYSCREEN */}
          <path d="M308 65 L322 30 L334 38 L318 72 Z" fill="#1f2226" fillOpacity="0.8" stroke="#454950" strokeWidth="1.2" />
          <path d="M312 66 L332 68 L328 85 L310 82 Z" fill="#25272a" stroke="#3a3d42" strokeWidth="1.2" />
          <circle cx="324" cy="74" r="7" fill="#141516" stroke="#e4e2e0" strokeWidth="1" />
          <circle cx="324" cy="74" r="3" fill="#ffffff" fillOpacity="0.9" />

          {/* HANDLEBARS & MIRRORS */}
          <path d="M295 64 L308 50 L330 48" stroke="#404348" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M330 46 Q338 48 335 55" stroke="#ffbb13" strokeWidth="3" strokeLinecap="round" fill="none" />
          <line x1="305" y1="52" x2="295" y2="34" stroke="#35373a" strokeWidth="1.8" />
          <circle cx="293" cy="32" r="5" fill="#202224" stroke="#45484e" strokeWidth="1" />
        </svg>
      )}
    </div>
  );
};
