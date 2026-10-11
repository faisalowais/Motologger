import React, { useState } from 'react';
import { Vehicle, ComponentItem, ServiceRecord } from '../types';

interface ComponentDetailScreenProps {
  vehicle: Vehicle;
  component: ComponentItem;
  onBack: () => void;
  onLogMaintenance: (componentId: string) => void;
  onViewAttachment?: (url: string, name: string) => void;
}

export const ComponentDetailScreen: React.FC<ComponentDetailScreenProps> = ({
  vehicle,
  component,
  onBack,
  onLogMaintenance,
  onViewAttachment,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const relevantHistory = vehicle.serviceHistory.filter(
    (h) => h.targetComponent.toLowerCase().includes(component.name.toLowerCase()) ||
           component.name.toLowerCase().includes(h.targetComponent.toLowerCase()) ||
           h.targetComponent === 'Engine Oil' // fallback to show rich logs for demo
  );

  const triggerToast = () => {
    setToastMessage(`Ready to record maintenance for ${vehicle.odometer.toLocaleString('en-IN')} km`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <div className="flex flex-col w-full text-[#e4e2e0] pb-16">
      {/* Top Action & Navigation Row */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <button
          aria-label="Go Back"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#1f201f] border border-[#2a2a29] flex items-center justify-center text-[#e4e2e0] hover:text-[#ffbb13] active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <div className="flex items-center gap-1">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#c4c7c7] bg-[#2a2a29] px-3 py-1 rounded-full font-mono">
            {vehicle.shortName}
          </span>
        </div>

        <button
          aria-label="More actions"
          onClick={triggerToast}
          className="w-10 h-10 rounded-full bg-[#1f201f] border border-[#2a2a29] flex items-center justify-center text-[#e4e2e0] hover:text-[#ffbb13] active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">more_horiz</span>
        </button>
      </div>

      {/* Hero Component Identity Header */}
      <div className="flex flex-col items-center text-center px-4 pt-4 pb-4">
        <div className="relative w-20 h-20 rounded-full bg-[#2a2a29] border border-[#353534] flex items-center justify-center mb-3 shadow-inner">
          <span className="material-symbols-outlined text-[38px] text-[#ffbb13]">
            {component.icon}
          </span>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#ffbb13] flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[#131313] text-[14px] font-bold">
              check
            </span>
          </div>
        </div>

        <h2 className="text-[24px] font-bold text-[#e4e2e0] tracking-tight">
          {component.name}
        </h2>
        <p className="text-[13px] text-[#8e9192] mt-1 max-w-[280px]">
          Replace every {component.intervalKm.toLocaleString('en-IN')} km or {component.intervalMonths || 12} months
        </p>
      </div>

      {/* Main Metric Gauge Card */}
      <div className="px-4 mb-4">
        <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-4 flex flex-col shadow-sm">
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[28px] font-bold text-[#e4e2e0] tracking-tight font-mono">
                {component.percentage}%
              </span>
              <span className="text-[11px] font-semibold text-[#8e9192] uppercase tracking-wider">
                consumed
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#ffbb13]">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span className="text-[12px] font-semibold">
                {component.status === 'due_soon' ? 'Service Due Soon' : 'Wear Nominal'}
              </span>
            </div>
          </div>

          {/* Linear Wear Track */}
          <div className="w-full h-2.5 bg-[#353534] rounded-full overflow-hidden p-0.5 flex mb-3">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                component.percentage > 70 ? 'bg-[#ffbb13]' : 'bg-[#c6c6c6]'
              }`}
              style={{ width: `${component.percentage}%` }}
            ></div>
          </div>

          {/* Telemetry Subtext */}
          <div className="flex items-center justify-between text-[#8e9192] pt-1">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8e9192]">
                Traveled
              </span>
              <span className="text-[18px] font-bold text-[#e4e2e0] font-mono">
                {component.usedKm.toLocaleString('en-IN')}{' '}
                <span className="text-[11px] text-[#8e9192] font-normal">km</span>
              </span>
            </div>

            <div className="h-6 w-px bg-[#2a2a29]"></div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8e9192]">
                Safe Allowance
              </span>
              <span className="text-[18px] font-bold text-[#ffbb13] font-mono">
                {component.remainingKm.toLocaleString('en-IN')}{' '}
                <span className="text-[11px] text-[#8e9192] font-normal">km left</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="px-4 mb-5">
        <button
          onClick={() => onLogMaintenance(component.id)}
          className="w-full h-12 rounded-xl bg-[#ffbb13] text-[#131313] font-bold text-[14px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer shadow-md hover:brightness-105"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Log Maintenance</span>
        </button>
      </div>

      {/* Technical Telemetry / Apple Health-style List */}
      <div className="px-4 mb-5">
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-[11px] uppercase tracking-wider text-[#8e9192] font-bold">
            Service Parameters
          </h3>
          <span className="text-[10px] text-[#8e9192]">Manufacturer Spec</span>
        </div>

        <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl overflow-hidden shadow-sm flex flex-col divide-y divide-[#2a2a29]">
          {/* Item 1: Last Changed */}
          <div className="p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#2a2a29] flex items-center justify-center shrink-0 text-[#8e9192]">
                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#8e9192] uppercase tracking-wider font-semibold">
                  Last Changed
                </span>
                <span className="text-[13px] text-[#e4e2e0] font-semibold truncate">
                  {component.lastChangedDate}
                </span>
              </div>
            </div>
            <span className="text-[12px] text-[#8e9192] font-mono whitespace-nowrap">
              at {component.lastChangedOdo.toLocaleString('en-IN')} km
            </span>
          </div>

          {/* Item 2: Next Due */}
          <div className="p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#2a2a29] flex items-center justify-center shrink-0 text-[#ffbb13]">
                <span className="material-symbols-outlined text-[20px]">alarm</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#8e9192] uppercase tracking-wider font-semibold">
                  Next Due
                </span>
                <span className="text-[13px] text-[#e4e2e0] font-semibold truncate font-mono">
                  {component.nextDueOdo.toLocaleString('en-IN')} km
                </span>
              </div>
            </div>
            <span className="text-[11px] text-[#8e9192] bg-[#2a2a29] px-2 py-0.5 rounded font-mono">
              or {component.nextDueDate}
            </span>
          </div>

          {/* Item 3: Specification */}
          <div className="p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#2a2a29] flex items-center justify-center shrink-0 text-[#8e9192]">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#8e9192] uppercase tracking-wider font-semibold">
                  Specification
                </span>
                <span className="text-[13px] text-[#e4e2e0] font-semibold truncate">
                  {component.spec}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-[#8e9192] whitespace-nowrap text-right">
              {component.specDetail}
            </span>
          </div>

          {/* Item 4: Capacity */}
          <div className="p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#2a2a29] flex items-center justify-center shrink-0 text-[#8e9192]">
                <span className="material-symbols-outlined text-[20px]">opacity</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#8e9192] uppercase tracking-wider font-semibold">
                  Capacity
                </span>
                <span className="text-[13px] text-[#e4e2e0] font-semibold">
                  {component.capacity.split(' ')[0]} {component.capacity.split(' ')[1] || ''}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-[#8e9192] text-right truncate">
              {component.capacity}
            </span>
          </div>
        </div>
      </div>

      {/* Historical Service Logs */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-[11px] uppercase tracking-wider text-[#8e9192] font-bold">
            Service History
          </h3>
          <span className="text-[11px] text-[#ffbb13] font-mono">
            View All ({relevantHistory.length})
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {relevantHistory.map((log, index) => (
            <div
              key={log.id}
              className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-3.5 shadow-sm flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      index === 0 ? 'bg-[#ffbb13]' : 'bg-[#353534]'
                    }`}
                  ></div>
                  <span className="text-[13px] font-semibold text-[#e4e2e0]">
                    {log.date}
                  </span>
                </div>
                <span className="text-[11px] text-[#8e9192] bg-[#2a2a29] px-2 py-0.5 rounded font-mono">
                  {log.odometer.toLocaleString('en-IN')} km
                </span>
              </div>

              <p className="text-[12px] text-[#c4c7c7] pl-4 leading-relaxed">
                {log.description}
              </p>

              {/* Media Attachments */}
              {log.attachments && log.attachments.length > 0 && (
                <div className="mt-1 pl-4 flex flex-col gap-2">
                  {log.attachments.map((att) => (
                    <div
                      key={att.id}
                      onClick={() => onViewAttachment?.(att.url, att.name)}
                      className="flex items-center gap-3 p-2 bg-[#171818] border border-[#2a2a29] rounded-lg cursor-pointer hover:border-[#444748] transition-colors"
                    >
                      <div className="w-12 h-12 rounded bg-[#2a2a29] overflow-hidden shrink-0">
                        <img
                          src={att.url}
                          alt={att.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0 justify-center">
                        <span className="text-[12px] font-semibold text-[#e4e2e0] truncate">
                          {att.name}
                        </span>
                        <span className="text-[11px] text-[#8e9192]">
                          {att.label || 'Attached document'} {att.size ? `• ${att.size}` : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Floating toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-4 right-4 bg-[#2a2a29] border border-[#444748] text-[#e4e2e0] p-3 rounded-xl shadow-2xl flex items-center justify-between z-50 animate-bounce">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffbb13] text-[20px]">
              build_circle
            </span>
            <span className="text-[12px] font-medium">{toastMessage}</span>
          </div>
          <button
            onClick={() => onLogMaintenance(component.id)}
            className="text-[#ffbb13] text-[11px] uppercase tracking-wider font-bold px-2 py-1"
          >
            Open
          </button>
        </div>
      )}
    </div>
  );
};
