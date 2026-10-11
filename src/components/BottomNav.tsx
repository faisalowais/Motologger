import React from 'react';

export type TabType = 'garage' | 'health' | 'records' | 'insights' | 'more';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'garage', label: 'Garage', icon: 'two_wheeler' },
    { id: 'health', label: 'Health', icon: 'monitoring' },
    { id: 'records', label: 'Records', icon: 'receipt_long' },
    { id: 'insights', label: 'Insights', icon: 'insights' },
    { id: 'more', label: 'More', icon: 'tune' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 bg-[#131313]/90 backdrop-blur-xl border-t border-[#242526] shadow-[0_-1px_12px_rgba(0,0,0,0.5)]">
      <div className="h-16 px-2 flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-12 transition-all cursor-pointer ${
                isActive
                  ? 'text-[#ffbb13] font-semibold scale-105'
                  : 'text-[#8e9192] hover:text-[#c7c6c6]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">
                {tab.icon}
              </span>
              <span className="text-[10px] tracking-wide font-medium">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
