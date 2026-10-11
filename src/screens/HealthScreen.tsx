import React, { useState } from 'react';
import { Vehicle, ComponentItem } from '../types';

interface HealthScreenProps {
  vehicles: Vehicle[];
  currentVehicle: Vehicle;
  onSelectVehicle: (id: string) => void;
  onSelectComponent: (componentId: string) => void;
  onLogMaintenance: (componentId?: string) => void;
}

export const HealthScreen: React.FC<HealthScreenProps> = ({
  vehicles,
  currentVehicle,
  onSelectVehicle,
  onSelectComponent,
  onLogMaintenance,
}) => {
  const [activeSegment, setActiveSegment] = useState<'components' | 'timeline' | 'specs'>('components');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Engine' | 'Chassis' | 'Electrical' | 'Consumables'>('All');
  const [showVehiclePicker, setShowVehiclePicker] = useState(false);

  // Filter components
  const filteredComponents = currentVehicle.components.filter((c) => {
    if (activeFilter === 'All') return true;
    return c.category === activeFilter;
  });

  return (
    <div className="flex flex-col w-full text-[#e4e2e0] pb-28">
      {/* Motorcycle Switcher Header */}
      <section className="px-4 pt-2 pb-3 flex flex-col gap-1 relative">
        <div className="flex items-center justify-between">
          <button
            aria-label="Switch motorcycle"
            onClick={() => setShowVehiclePicker(!showVehiclePicker)}
            className="flex items-center gap-1 group focus:outline-none cursor-pointer"
            type="button"
          >
            <span className="text-[20px] font-semibold text-[#e4e2e0] tracking-tight group-hover:text-[#ffbb13] transition-colors">
              {currentVehicle.shortName}
            </span>
            <span className="material-symbols-outlined text-[#8e9192] transition-transform group-hover:translate-y-0.5 text-[22px]">
              keyboard_arrow_down
            </span>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a2a29]">
            <span className="material-symbols-outlined text-[14px] text-[#ffbb13]">speed</span>
            <span className="text-[11px] font-semibold text-[#c7c6c6] font-mono">
              {currentVehicle.odometer.toLocaleString('en-IN')} km
            </span>
          </div>
        </div>

        {/* Vehicle Picker Dropdown */}
        {showVehiclePicker && (
          <div className="absolute top-12 left-4 z-30 w-64 bg-[#1f201f] border border-[#353534] rounded-xl shadow-2xl p-1.5 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-semibold text-[#8e9192] px-2 py-1">
              Select Fleet Motorcycle
            </span>
            {vehicles.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  onSelectVehicle(v.id);
                  setShowVehiclePicker(false);
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-left text-[13px] transition-colors ${
                  v.id === currentVehicle.id
                    ? 'bg-[#2a2a29] text-[#ffbb13] font-semibold'
                    : 'text-[#e4e2e0] hover:bg-[#252627]'
                }`}
              >
                <span>{v.name}</span>
                <span className="text-[11px] text-[#8e9192] font-mono">{v.odometer} km</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-[#8e9192]">
          <p className="text-[11px] text-[#8e9192]">Service interval status &amp; component health</p>
          <span className="text-[11px] text-[#ffbb13] font-medium flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ffbb13] animate-pulse"></span>
            Synced Today
          </span>
        </div>
      </section>

      {/* Segmented Primary View Navigation */}
      <section className="px-4 pb-3">
        <div className="flex p-1 bg-[#0e0e0e] border border-[#242526] rounded-xl">
          <button
            onClick={() => setActiveSegment('components')}
            className={`flex-1 py-1.5 text-center rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
              activeSegment === 'components'
                ? 'bg-[#2a2a29] text-[#e4e2e0] shadow-sm'
                : 'text-[#8e9192] hover:text-[#e4e2e0]'
            }`}
            type="button"
          >
            Components
          </button>
          <button
            onClick={() => setActiveSegment('timeline')}
            className={`flex-1 py-1.5 text-center rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
              activeSegment === 'timeline'
                ? 'bg-[#2a2a29] text-[#e4e2e0] shadow-sm'
                : 'text-[#8e9192] hover:text-[#e4e2e0]'
            }`}
            type="button"
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveSegment('specs')}
            className={`flex-1 py-1.5 text-center rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
              activeSegment === 'specs'
                ? 'bg-[#2a2a29] text-[#e4e2e0] shadow-sm'
                : 'text-[#8e9192] hover:text-[#e4e2e0]'
            }`}
            type="button"
          >
            Specs
          </button>
        </div>
      </section>

      {/* OVERALL RIG TELEMETRY CARD */}
      <section className="px-4 pb-4">
        <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#ffbb13]"></div>
              <span className="text-[10px] uppercase tracking-wider text-[#8e9192] font-semibold">
                Overall Rig Telemetry
              </span>
            </div>
            <span className="text-[10px] text-[#c4c7c7] font-medium font-mono">
              {currentVehicle.monitoredPartsCount} Monitored Parts
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Circular Radial Gauge Chart */}
            <div className="relative w-22 h-22 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  className="text-[#353534]"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                />
                {/* Active amber segment */}
                <circle
                  className="text-[#ffbb13]"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="currentColor"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - currentVehicle.healthPercent / 100)}
                  strokeLinecap="round"
                  strokeWidth="8"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[18px] font-bold text-[#e4e2e0] leading-none font-mono">
                  {currentVehicle.healthPercent}%
                </span>
                <span className="text-[10px] text-[#8e9192]">Healthy</span>
              </div>
            </div>

            {/* Metric Breakdown */}
            <div className="flex flex-col flex-1 justify-center gap-1 min-w-0">
              <h3 className="text-[14px] text-[#e4e2e0] font-semibold truncate">
                Components within limit
              </h3>
              <p className="text-[11px] text-[#8e9192]">
                Next schedule check expected in 1,680 km
              </p>
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 pt-1 text-[11px]">
                <span className="inline-flex items-center gap-1.5 text-[#e4e2e0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#393938]"></span>
                  <span className="font-semibold text-[#c6c6c6]">{currentVehicle.healthyCount}</span> Healthy
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#e4e2e0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffbb13]"></span>
                  <span className="font-semibold text-[#ffbb13]">{currentVehicle.dueSoonCount}</span> Due Soon
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#c4c7c7]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c7c6c6]"></span>
                  <span className="font-semibold text-[#e4e2e0]">{currentVehicle.actionReqCount}</span> Action Req.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* View Segment Switch: Components vs Timeline vs Specs */}
      {activeSegment === 'components' && (
        <>
          {/* Horizontal Filter Pills */}
          <section className="px-4 pb-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {(['All', 'Engine', 'Chassis', 'Electrical', 'Consumables'] as const).map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold shrink-0 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#ffbb13] text-[#131313]'
                        : 'bg-[#2a2a29] text-[#8e9192] hover:text-[#e4e2e0]'
                    }`}
                    type="button"
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </section>

          {/* High-Density Component Maintenance List */}
          <section className="px-4 flex flex-col gap-2.5 pb-6">
            <div className="flex items-center justify-between py-1 px-1">
              <span className="text-[10px] uppercase tracking-wider text-[#8e9192] font-semibold">
                Component Lifecycle Telemetry
              </span>
              <span className="text-[10px] text-[#8e9192]">Wear / Limit</span>
            </div>

            {filteredComponents.map((comp) => {
              const isAlert = comp.status === 'due_soon' || comp.status === 'action_req';

              return (
                <div
                  key={comp.id}
                  onClick={() => onSelectComponent(comp.id)}
                  className={`rounded-xl p-3.5 transition-all flex flex-col gap-2.5 cursor-pointer border ${
                    isAlert
                      ? 'bg-[#252627] border-[#383a3c] hover:bg-[#2c2d2f]'
                      : 'bg-[#1f201f] border-[#2a2a29] hover:bg-[#262726]'
                  }`}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#353534] flex items-center justify-center shrink-0">
                        <span
                          className={`material-symbols-outlined text-[20px] ${
                            isAlert ? 'text-[#ffbb13]' : 'text-[#c7c6c6]'
                          }`}
                        >
                          {comp.icon}
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-[15px] text-[#e4e2e0] font-semibold truncate">
                            {comp.name}
                          </h4>
                          {comp.status === 'due_soon' && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ffbb13]/20 text-[#ffbb13] font-medium">
                              Due Soon
                            </span>
                          )}
                          {comp.status === 'action_req' && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ffb4ab]/20 text-[#ffb4ab] font-medium">
                              Action Req.
                            </span>
                          )}
                          {comp.spec && comp.status === 'healthy' && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#353534] text-[#8e9192]">
                              {comp.spec}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#8e9192] truncate">
                          Replace every {comp.intervalKm.toLocaleString('en-IN')} km
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[17px] font-bold font-mono ${
                          isAlert ? 'text-[#ffbb13]' : 'text-[#e4e2e0]'
                        }`}
                      >
                        {comp.percentage}%
                      </span>
                      <span className="material-symbols-outlined text-[20px] text-[#8e9192]">
                        chevron_right
                      </span>
                    </div>
                  </div>

                  {/* Wear Bar */}
                  <div className="flex flex-col gap-1.5">
                    <div className="w-full h-1.5 rounded-full bg-[#353534] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isAlert ? 'bg-[#ffbb13]' : 'bg-[#767777]'
                        }`}
                        style={{ width: `${comp.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#8e9192] font-mono">
                      <span>{comp.usedKm.toLocaleString('en-IN')} km used</span>
                      <span className={isAlert ? 'text-[#ffbb13] font-medium' : ''}>
                        {comp.remainingKm.toLocaleString('en-IN')} km remaining
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </>
      )}

      {/* Timeline View */}
      {activeSegment === 'timeline' && (
        <section className="px-4 flex flex-col gap-3 pb-8">
          <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-4">
            <h4 className="text-[14px] font-semibold text-[#e4e2e0] mb-2">
              Upcoming Maintenance Milestones
            </h4>
            <div className="space-y-4 border-l border-[#353534] pl-4 ml-2">
              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#ffbb13]"></span>
                <span className="text-[11px] text-[#ffbb13] font-mono font-semibold">13,893 km (in ~1,680 km)</span>
                <p className="text-[13px] text-[#e4e2e0] font-medium">Rear Brake Pads Inspection</p>
                <p className="text-[11px] text-[#8e9192]">Thickness check and disc caliper clean</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#ffbb13]"></span>
                <span className="text-[11px] text-[#ffbb13] font-mono font-semibold">15,400 km (or 26 Feb 2027)</span>
                <p className="text-[13px] text-[#e4e2e0] font-medium">Engine Oil &amp; Sump Refresh</p>
                <p className="text-[11px] text-[#8e9192]">Motul 7100 10W-40 4T Full Synthetic (1.2L)</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#767777]"></span>
                <span className="text-[11px] text-[#8e9192] font-mono">18,213 km (Major Milestone)</span>
                <p className="text-[13px] text-[#e4e2e0] font-medium">Major Periodic Service #5</p>
                <p className="text-[11px] text-[#8e9192]">Air filter, spark plug, valve clearance adjustment</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Specs View */}
      {activeSegment === 'specs' && (
        <section className="px-4 flex flex-col gap-3 pb-8">
          <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-4 flex flex-col gap-2.5">
            <h4 className="text-[14px] font-semibold text-[#e4e2e0]">
              Factory Mechanical Specifications
            </h4>
            <div className="divide-y divide-[#2a2a29] text-[12px]">
              <div className="py-2 flex justify-between">
                <span className="text-[#8e9192]">Engine Model</span>
                <span className="text-[#e4e2e0] font-mono">199.6 cc 4-Stroke 4-Valve SOHC</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#8e9192]">Engine Oil Spec</span>
                <span className="text-[#e4e2e0] font-mono">SAE 10W-40 JASO MA2 API SL</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#8e9192]">Oil Capacity</span>
                <span className="text-[#e4e2e0] font-mono">1.05 L (Drain), 1.2 L (Dry)</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#8e9192]">Spark Plug</span>
                <span className="text-[#e4e2e0] font-mono">NGK CPR8EA-9 (0.8-0.9mm)</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#8e9192]">Chain Slack Freeplay</span>
                <span className="text-[#e4e2e0] font-mono">25 - 30 mm</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#8e9192]">Tire Pressure (F / R)</span>
                <span className="text-[#e4e2e0] font-mono">25 PSI / 33 PSI (Solo)</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Floating Action Log Bar (Compact Mechanical Utility) */}
      <aside className="fixed bottom-20 left-0 right-0 px-4 w-full z-30 pointer-events-none max-w-md mx-auto">
        <div className="pointer-events-auto w-full p-2 bg-[#252627]/95 backdrop-blur-md border border-[#353534] rounded-2xl flex items-center justify-between gap-3 shadow-2xl">
          <div className="flex items-center gap-2 pl-2">
            <span className="material-symbols-outlined text-[20px] text-[#ffbb13]">
              build_circle
            </span>
            <span className="text-[12px] text-[#e4e2e0] font-medium truncate">
              Perform shop work?
            </span>
          </div>
          <button
            onClick={() => onLogMaintenance()}
            className="px-4 py-2 bg-[#ffbb13] text-[#131313] text-[13px] font-bold rounded-xl flex items-center gap-1.5 hover:opacity-95 active:scale-95 transition-all cursor-pointer shadow-md"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Log Maintenance</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
