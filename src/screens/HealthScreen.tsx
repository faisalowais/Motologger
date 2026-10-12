import React, { useState, useEffect } from 'react';
import { Vehicle, ComponentItem } from '../types';

interface HealthScreenProps {
  vehicles: Vehicle[];
  currentVehicle: Vehicle;
  onSelectVehicle: (id: string) => void;
  onSelectComponent: (componentId: string) => void;
  onLogMaintenance: (componentId?: string) => void;
  onOpenUpdateOdometer?: () => void;
  onUpdateOdometer?: (newKm: number) => void;
}

export const HealthScreen: React.FC<HealthScreenProps> = ({
  vehicles,
  currentVehicle,
  onSelectVehicle,
  onSelectComponent,
  onLogMaintenance,
  onOpenUpdateOdometer,
  onUpdateOdometer,
}) => {
  const [activeSegment, setActiveSegment] = useState<'components' | 'timeline' | 'specs'>('components');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Engine' | 'Chassis' | 'Electrical' | 'Consumables'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showVehiclePicker, setShowVehiclePicker] = useState(false);
  const [customKmInput, setCustomKmInput] = useState(String(currentVehicle.odometer));

  useEffect(() => {
    setCustomKmInput(String(currentVehicle.odometer));
  }, [currentVehicle.odometer]);

  // Filter components by category and search
  const filteredComponents = currentVehicle.components.filter((c) => {
    if (activeFilter !== 'All' && c.category !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.spec.toLowerCase().includes(q) ||
        (c.specDetail && c.specDetail.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return currentVehicle.components.length;
    return currentVehicle.components.filter((c) => c.category === cat).length;
  };

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

          {/* Odometer badge with update button */}
          <button
            type="button"
            onClick={onOpenUpdateOdometer}
            title="Click to update odometer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a2a29] hover:bg-[#353534] border border-[#353534] transition-colors cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[14px] text-[#ffbb13]">speed</span>
            <span className="text-[11px] font-semibold text-[#c7c6c6] font-mono group-hover:text-[#ffbb13]">
              {currentVehicle.odometer.toLocaleString('en-IN')} km
            </span>
            <span className="material-symbols-outlined text-[12px] text-[#8e9192]">edit</span>
          </button>
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
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-left text-[13px] transition-colors cursor-pointer ${
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
          <p className="text-[11px] text-[#8e9192]">
            Factory maintenance schedule ({currentVehicle.components.length} monitored parts)
          </p>
          <span className="text-[11px] text-[#ffbb13] font-medium flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ffbb13] animate-pulse"></span>
            Synced to {currentVehicle.odometer} km
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
            Components ({currentVehicle.components.length})
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
            Factory Schedule
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
              {currentVehicle.monitoredPartsCount} Monitored Line Items
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Circular Radial Gauge Chart */}
            <div className="relative w-22 h-22 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-[#353534]"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                />
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
                Next schedule check in {currentVehicle.nextDueKm} km
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
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]"></span>
                  <span className="font-semibold text-[#ffb4ab]">{currentVehicle.actionReqCount}</span> Action Req.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* View Segment Switch: Components vs Timeline vs Specs */}
      {activeSegment === 'components' && (
        <>
          {/* DEDICATED BUTTON TO LOG ANY WORK DONE TO THE BIKE */}
          <section className="px-4 pb-3 flex flex-col gap-1.5">
            <button
              onClick={() => onLogMaintenance()}
              className="w-full py-3 bg-[#ffbb13] hover:brightness-105 active:scale-[0.98] text-[#131313] font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                add_circle
              </span>
              <span>Log Work Done to Motorcycle</span>
            </button>

            {/* Quick Component Shortcuts */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] text-[#8e9192] uppercase font-semibold shrink-0">Log Line Item:</span>
              <button
                type="button"
                onClick={() => {
                  const comp = currentVehicle.components.find((c) => c.name.toLowerCase().includes('oil'));
                  onLogMaintenance(comp?.id);
                }}
                className="px-2 py-0.5 rounded-lg bg-[#252627] hover:bg-[#303133] border border-[#353637] text-[11px] text-[#ffbb13] shrink-0 cursor-pointer"
              >
                + Engine Oil
              </button>
              <button
                type="button"
                onClick={() => {
                  const comp = currentVehicle.components.find((c) => c.name.toLowerCase().includes('spark'));
                  onLogMaintenance(comp?.id);
                }}
                className="px-2 py-0.5 rounded-lg bg-[#252627] hover:bg-[#303133] border border-[#353637] text-[11px] text-[#e4e2e0] shrink-0 cursor-pointer"
              >
                + Spark Plug
              </button>
              <button
                type="button"
                onClick={() => {
                  const comp = currentVehicle.components.find((c) => c.name.toLowerCase().includes('brake'));
                  onLogMaintenance(comp?.id);
                }}
                className="px-2 py-0.5 rounded-lg bg-[#252627] hover:bg-[#303133] border border-[#353637] text-[11px] text-[#e4e2e0] shrink-0 cursor-pointer"
              >
                + Brake Pads
              </button>
              <button
                type="button"
                onClick={() => {
                  const comp = currentVehicle.components.find((c) => c.name.toLowerCase().includes('chain'));
                  onLogMaintenance(comp?.id);
                }}
                className="px-2 py-0.5 rounded-lg bg-[#252627] hover:bg-[#303133] border border-[#353637] text-[11px] text-[#e4e2e0] shrink-0 cursor-pointer"
              >
                + Chain Lube
              </button>
              <button
                type="button"
                onClick={() => {
                  const comp = currentVehicle.components.find((c) => c.name.toLowerCase().includes('filter'));
                  onLogMaintenance(comp?.id);
                }}
                className="px-2 py-0.5 rounded-lg bg-[#252627] hover:bg-[#303133] border border-[#353637] text-[11px] text-[#e4e2e0] shrink-0 cursor-pointer"
              >
                + Air Filter
              </button>
            </div>
          </section>

          {/* REAL-TIME KILOMETER INPUT & TESTER BAR */}
          <section className="px-4 pb-3">
            <div className="bg-[#1b1c1b] border border-[#2a2a29] rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#ffbb13]">speed</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e9192]">
                    Input Kilometers (Updates Line Items Live)
                  </span>
                </div>
                <span className="text-[10px] text-[#ffbb13] font-mono">
                  Synced: {currentVehicle.odometer.toLocaleString('en-IN')} km
                </span>
              </div>

              {/* Input field + quick apply */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 flex items-center">
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter odometer km..."
                    value={customKmInput}
                    onChange={(e) => {
                      setCustomKmInput(e.target.value);
                      const num = Number(e.target.value);
                      if (num >= 0 && onUpdateOdometer) {
                        onUpdateOdometer(num);
                      }
                    }}
                    className="w-full bg-[#2a2a29] border border-[#353534] rounded-lg px-3 py-1.5 text-[14px] font-bold font-mono text-[#e4e2e0] focus:outline-none focus:border-[#ffbb13]"
                  />
                  <span className="absolute right-3 text-[11px] font-mono text-[#8e9192]">KM</span>
                </div>

                {onOpenUpdateOdometer && (
                  <button
                    type="button"
                    onClick={onOpenUpdateOdometer}
                    className="px-3 py-1.5 bg-[#2a2a29] hover:bg-[#353534] border border-[#353534] rounded-lg text-[11px] font-semibold text-[#c4c7c7] cursor-pointer shrink-0 transition-colors"
                  >
                    Modal Editor
                  </button>
                )}
              </div>

              {/* Quick increment buttons */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
                <span className="text-[9px] uppercase font-semibold text-[#8e9192] shrink-0">Quick Add:</span>
                {[100, 500, 1000, 2500, 5000].map((addKm) => (
                  <button
                    key={addKm}
                    type="button"
                    onClick={() => {
                      const next = currentVehicle.odometer + addKm;
                      setCustomKmInput(String(next));
                      if (onUpdateOdometer) onUpdateOdometer(next);
                    }}
                    className="px-2 py-0.5 rounded bg-[#252627] hover:bg-[#323335] text-[10px] font-mono text-[#c6c6c6] shrink-0 cursor-pointer transition-colors"
                  >
                    +{addKm} km
                  </button>
                ))}
              </div>
            </div>
          </section>
          {/* Search Box for Components */}
          <section className="px-4 pb-2.5">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-[18px] text-[#8e9192] absolute left-3">
                search
              </span>
              <input
                type="text"
                placeholder="Search engine oil, spark plug, chain, pads, bearings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1b1c1b] border border-[#2a2a29] rounded-xl pl-9 pr-3 py-2 text-[12px] text-[#e4e2e0] placeholder-[#8e9192] focus:outline-none focus:border-[#ffbb13]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-[#8e9192] hover:text-[#e4e2e0]"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>
          </section>

          {/* Horizontal Filter Pills with Counts */}
          <section className="px-4 pb-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {(['All', 'Engine', 'Chassis', 'Electrical', 'Consumables'] as const).map((filter) => {
                const isActive = activeFilter === filter;
                const count = getCategoryCount(filter);
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#ffbb13] text-[#131313]'
                        : 'bg-[#2a2a29] text-[#8e9192] hover:text-[#e4e2e0]'
                    }`}
                    type="button"
                  >
                    <span>{filter}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-[#131313]/20' : 'bg-[#1b1c1b]'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* High-Density Component Maintenance List */}
          <section className="px-4 flex flex-col gap-2.5 pb-6">
            <div className="flex items-center justify-between py-1 px-1">
              <span className="text-[10px] uppercase tracking-wider text-[#8e9192] font-semibold">
                Factory Schedule Lifecycle Telemetry ({filteredComponents.length} parts)
              </span>
              <span className="text-[10px] text-[#8e9192]">Wear / Limit</span>
            </div>

            {filteredComponents.length === 0 ? (
              <div className="py-8 text-center text-[#8e9192] text-[12px] bg-[#1f201f] rounded-xl border border-[#2a2a29]">
                No maintenance components found matching "{searchQuery}".
              </div>
            ) : (
              filteredComponents.map((comp) => {
                const isAlert = comp.status === 'due_soon' || comp.status === 'action_req';

                return (
                  <div
                    key={comp.id}
                    onClick={() => onSelectComponent(comp.id)}
                    className={`rounded-xl p-3.5 transition-all flex flex-col gap-2.5 cursor-pointer border shadow-sm ${
                      comp.status === 'action_req'
                        ? 'bg-[#281a1b] border-[#ffb4ab]/40 hover:bg-[#321e20]'
                        : isAlert
                        ? 'bg-[#252627] border-[#ffbb13]/40 hover:bg-[#2c2d2f]'
                        : 'bg-[#1f201f] border-[#2a2a29] hover:bg-[#262726]'
                    }`}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            comp.status === 'action_req'
                              ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                              : isAlert
                              ? 'bg-[#ffbb13]/20 text-[#ffbb13]'
                              : 'bg-[#353534] text-[#c7c6c6]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {comp.icon}
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-[14px] text-[#e4e2e0] font-semibold truncate">
                              {comp.name}
                            </h4>
                            {comp.status === 'due_soon' && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#ffbb13]/20 text-[#ffbb13] font-semibold uppercase">
                                Due Soon
                              </span>
                            )}
                            {comp.status === 'action_req' && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#ffb4ab]/20 text-[#ffb4ab] font-semibold uppercase">
                                Action Req.
                              </span>
                            )}
                            {comp.spec && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#353534] text-[#8e9192]">
                                {comp.spec}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#8e9192] truncate mt-0.5">
                            Interval: every {comp.intervalKm.toLocaleString('en-IN')} km
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[17px] font-bold font-mono ${
                            comp.status === 'action_req'
                              ? 'text-[#ffb4ab]'
                              : isAlert
                              ? 'text-[#ffbb13]'
                              : 'text-[#e4e2e0]'
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
                            comp.status === 'action_req'
                              ? 'bg-[#ffb4ab]'
                              : isAlert
                              ? 'bg-[#ffbb13]'
                              : 'bg-[#767777]'
                          }`}
                          style={{ width: `${comp.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#8e9192] font-mono">
                        <span>{comp.usedKm.toLocaleString('en-IN')} km used</span>
                        <span
                          className={
                            comp.status === 'action_req'
                              ? 'text-[#ffb4ab] font-bold'
                              : isAlert
                              ? 'text-[#ffbb13] font-medium'
                              : ''
                          }
                        >
                          {comp.remainingKm.toLocaleString('en-IN')} km remaining
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        </>
      )}

      {/* Timeline View */}
      {activeSegment === 'timeline' && (
        <section className="px-4 flex flex-col gap-3 pb-8">
          <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-4">
            <h4 className="text-[14px] font-semibold text-[#e4e2e0] mb-2">
              Upcoming Factory Maintenance Milestones
            </h4>
            <div className="space-y-4 border-l border-[#353534] pl-4 ml-2">
              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#ffbb13]"></span>
                <span className="text-[11px] text-[#ffbb13] font-mono font-semibold">12,738 km (in 525 km)</span>
                <p className="text-[13px] text-[#e4e2e0] font-medium">Drive Chain Clean, Lube &amp; Slack Adjust</p>
                <p className="text-[11px] text-[#8e9192]">700 km periodic interval inspection</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#ffbb13]"></span>
                <span className="text-[11px] text-[#ffbb13] font-mono font-semibold">13,426 km (in ~1,213 km)</span>
                <p className="text-[13px] text-[#e4e2e0] font-medium">Rear Brake Pads &amp; Valve Clearance Check</p>
                <p className="text-[11px] text-[#8e9192]">Thickness inspection and SOHC tappet adjustment</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#767777]"></span>
                <span className="text-[11px] text-[#8e9192] font-mono">18,000 km (Suspension Milestone)</span>
                <p className="text-[13px] text-[#e4e2e0] font-medium">Front Fork Oil &amp; Seals Renewal</p>
                <p className="text-[11px] text-[#8e9192]">350ml 10W per fork leg service</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#767777]"></span>
                <span className="text-[11px] text-[#8e9192] font-mono">23,338 km</span>
                <p className="text-[13px] text-[#e4e2e0] font-medium">Engine Oil &amp; Full Filter Clean (12k km milestone)</p>
                <p className="text-[11px] text-[#8e9192]">Centrifugal rotor, strainer mesh &amp; magnetic bolt</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Factory Schedule Specs View */}
      {activeSegment === 'specs' && (
        <section className="px-4 flex flex-col gap-3 pb-8">
          <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-4 flex flex-col gap-2.5">
            <h4 className="text-[14px] font-semibold text-[#e4e2e0]">
              Hero XPulse 200 Maintenance Manual (Pages 56 &amp; 57)
            </h4>
            <div className="divide-y divide-[#2a2a29] text-[12px]">
              <div className="py-2 flex justify-between">
                <span className="text-[#8e9192]">Engine Oil Replacement</span>
                <span className="text-[#e4e2e0] font-mono font-semibold">Every 12,000 km (Top-up at 6,000 km)</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#8e9192]">Oil Strainer &amp; Centrifugal Filter</span>
                <span className="text-[#e4e2e0] font-mono">Clean every 12,000 km</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#8e9192]">Drive Chain (I, C, L, A)</span>
                <span className="text-[#e4e2e0] font-mono font-semibold">Every 700 km (Slack 25-30mm)</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#8e9192]">Valve Clearance (Tappets)</span>
                <span className="text-[#e4e2e0] font-mono">Inspect/Adjust every 6,000 km</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#8e9192]">Spark Plug (CPR8EA-9)</span>
                <span className="text-[#e4e2e0] font-mono">Clean at 6k, Replace at 12,000 km</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#8e9192]">Air Cleaner Element</span>
                <span className="text-[#e4e2e0] font-mono">Clean at 6k, Replace at 12,000 km</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#8e9192]">Front Fork Oil &amp; Seals</span>
                <span className="text-[#e4e2e0] font-mono">Renew every 18,000 km</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#8e9192]">Brake Fluid DOT 4</span>
                <span className="text-[#e4e2e0] font-mono">Replace every 30,000 km / 2 Years</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Floating Action Log Bar */}
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
            className="px-4 py-2 bg-[#ffbb13] text-[#131313] text-[13px] font-bold rounded-xl flex items-center gap-1.5 hover:brightness-105 active:scale-95 transition-all cursor-pointer shadow-md"
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
