import React from 'react';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  showBack = false,
  onProfileClick,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#131313]/90 backdrop-blur-xl border-b border-[#242526] shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <div className="h-14 px-4 flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex items-center gap-2 min-w-0">
          {showBack && (
            <button
              aria-label="Back"
              onClick={onBack}
              className="w-10 h-10 -ml-2 flex items-center justify-center text-[#e4e2e0] hover:text-[#ffbb13] transition-colors shrink-0 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
            </button>
          )}

          <img
            alt="MotoLedger Logo"
            className="h-8 w-auto object-contain shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1WZuYgOQ4ItHJMFfbvLDauI7m8nUIcXfJG5MMC5u4RtP0IwpoO_xVVWtofx-V_I7S14KJDkThdxCJK47Pq2eSsMMopNbqIVnEqvTfQeOeflCln0-ZveHU7973osJTg4iyDmzTzeNB1JAD3a6WbYfb_kdRjhS9POpNnRJc16Ax2625JhBuy-a2cCw_uwKMuvrf4PC6uIzW5kkYRamJs2whMB0B_OD33eXKdyLgUchvmS5UUdlWjkZe7elwg"
          />

          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-semibold text-[#8e9192] uppercase tracking-wider truncate leading-tight">
              MotoLedger
            </span>
            <h1 className="text-[16px] text-[#e4e2e0] font-semibold tracking-tight truncate leading-tight">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onProfileClick}
            aria-label="User profile"
            className="w-8 h-8 rounded-full bg-[#c6c6c6] hover:bg-[#e4e2e0] active:scale-95 transition-all flex items-center justify-center shrink-0 text-[#2f3131] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
