import React, { useState } from 'react';
import { Vehicle } from '../types';
import { BikeVisual } from '../components/BikeVisual';

interface GarageScreenProps {
  vehicles: Vehicle[];
  currentVehicle: Vehicle;
  onSelectVehicle: (id: string) => void;
  onNavigateToHealth: () => void;
  onNavigateToRecords: () => void;
  onNavigateToLogService: () => void;
  onNavigateToComponent: (componentId: string) => void;
  onAddVehicle: () => void;
  onUploadPhoto?: () => void;
  onOpenDeleteVehicle: () => void;
  onOpenUpdateOdometer: () => void;
  onUpdateOdometer?: (newKm: number) => void;
}

export const GarageScreen: React.FC<GarageScreenProps> = ({
  vehicles,
  currentVehicle,
  onSelectVehicle,
  onNavigateToHealth,
  onNavigateToRecords,
  onNavigateToLogService,
  onNavigateToComponent,
  onAddVehicle,
  onUploadPhoto,
  onOpenDeleteVehicle,
  onOpenUpdateOdometer,
  onUpdateOdometer,
}) => {
  const kmSinceService = currentVehicle.odometer - currentVehicle.lastServiceOdo;

  // Key line items to display dynamically from the schedule table (matched across any bike model)
  const keyKeywords = ['oil', 'spark', 'filter', 'chain', 'plug', 'brake', 'valve', 'tappet', 'fluid', 'battery', 'tyre', 'fork'];
  const previewComps = currentVehicle.components
    .filter((c) => keyKeywords.some((kw) => c.name.toLowerCase().includes(kw) || c.id.toLowerCase().includes(kw)))
    .slice(0, 8);

  return (
    <div className="flex flex-col w-full pb-24 text-[#e4e2e0]">
      {/* VEHICLE FLEET & My Garage */}
      <section className="px-4 pt-3 pb-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#8e9192]">
              VEHICLE FLEET
            </span>
            <h2 className="text-[24px] font-bold tracking-tight text-[#e4e2e0]">
              My Garage
            </h2>
          </div>
          <button
            onClick={onAddVehicle}
            aria-label="Add vehicle"
            title="Add motorcycle to garage"
            className="w-10 h-10 rounded-full bg-[#2a2a29] hover:bg-[#353534] active:scale-95 transition-all flex items-center justify-center text-[#e4e2e0] cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>

        {/* Bike fleet horizontal cards */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          {vehicles.map((v) => {
            const isSelected = v.id === currentVehicle.id;
            return (
              <button
                key={v.id}
                onClick={() => onSelectVehicle(v.id)}
                className={`relative flex flex-col justify-between p-3 rounded-xl min-w-[130px] h-[105px] border transition-all text-left cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#1f201f] border-[#444748] shadow-md ring-1 ring-[#c6c6c6]/20'
                    : 'bg-[#181919] border-[#2a2a29] hover:bg-[#202121]'
                }`}
              >
                {/* Active indicator dot */}
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#ffbb13]" />
                )}

                {/* Bike icon / preview */}
                <div className="w-full flex items-center justify-center h-11 overflow-hidden">
                  {v.photoUrl ? (
                    <img
                      src={v.photoUrl}
                      alt={v.shortName}
                      className="w-16 h-10 object-cover rounded-md opacity-90 shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-10 opacity-80 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[30px] text-[#c6c6c6]">
                        two_wheeler
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-[#e4e2e0] truncate">
                    {v.shortName}
                  </span>
                  <span className="text-[10px] text-[#8e9192] font-mono">
                    {v.odometer.toLocaleString('en-IN')} km
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ACTIVE TELEMETRY CARD */}
      <section className="px-4 pb-3 flex flex-col gap-2.5">
        <div className="bg-[#1b1c1b] border border-[#2a2a29] rounded-2xl p-4 flex flex-col gap-3.5 shadow-md">
          {/* Header row with Delete Motorcycle option */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#8e9192]">
                ACTIVE TELEMETRY
              </span>
              <h3 className="text-[20px] font-bold text-[#e4e2e0] tracking-tight">
                {currentVehicle.name}
              </h3>
              <p className="text-[12px] text-[#8e9192]">
                {currentVehicle.year} · {currentVehicle.displacement} · {currentVehicle.category}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenDeleteVehicle}
                aria-label="Delete motorcycle"
                title="Delete this motorcycle from garage"
                className="w-8 h-8 rounded-full bg-[#2a2a29] hover:bg-[#93000a]/30 text-[#8e9192] hover:text-[#ffb4ab] flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">delete</span>
              </button>
              <button
                onClick={onNavigateToHealth}
                aria-label="Bike telemetry menu"
                className="w-8 h-8 rounded-full bg-[#2a2a29] hover:bg-[#353534] flex items-center justify-center text-[#c4c7c7] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">more_horiz</span>
              </button>
            </div>
          </div>

          {/* Large Hero Motorcycle Visual */}
          <div className="w-full rounded-xl overflow-hidden bg-[#121314] border border-[#262728]">
            <BikeVisual
              type={currentVehicle.id === 'gt-650' ? 'gt650' : 'xpulse'}
              photoUrl={currentVehicle.photoUrl}
              onUploadPhoto={onUploadPhoto}
            />
          </div>

          {/* DEDICATED BUTTON TO LOG ANY WORK DONE TO THE BIKE */}
          <div className="flex flex-col gap-1.5">
            <button
              onClick={onNavigateToLogService}
              className="w-full py-3 bg-[#ffbb13] hover:brightness-105 active:scale-[0.98] text-[#131313] font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                add_circle
              </span>
              <span>Log Work Done to Motorcycle</span>
            </button>

            {/* Quick Action Logging Shortcuts */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] text-[#8e9192] uppercase font-semibold shrink-0">Quick Log:</span>
              <button
                type="button"
                onClick={() => {
                  const comp = currentVehicle.components.find((c) => c.name.toLowerCase().includes('oil'));
                  if (comp) onNavigateToComponent(comp.id);
                  else onNavigateToLogService();
                }}
                className="px-2.5 py-1 rounded-lg bg-[#252627] hover:bg-[#303133] border border-[#353637] text-[11px] font-medium text-[#ffbb13] shrink-0 cursor-pointer transition-colors"
              >
                + Engine Oil
              </button>
              <button
                type="button"
                onClick={() => {
                  const comp = currentVehicle.components.find((c) => c.name.toLowerCase().includes('spark'));
                  if (comp) onNavigateToComponent(comp.id);
                  else onNavigateToLogService();
                }}
                className="px-2.5 py-1 rounded-lg bg-[#252627] hover:bg-[#303133] border border-[#353637] text-[11px] font-medium text-[#e4e2e0] shrink-0 cursor-pointer transition-colors"
              >
                + Spark Plug
              </button>
              <button
                type="button"
                onClick={() => {
                  const comp = currentVehicle.components.find((c) => c.name.toLowerCase().includes('brake'));
                  if (comp) onNavigateToComponent(comp.id);
                  else onNavigateToLogService();
                }}
                className="px-2.5 py-1 rounded-lg bg-[#252627] hover:bg-[#303133] border border-[#353637] text-[11px] font-medium text-[#e4e2e0] shrink-0 cursor-pointer transition-colors"
              >
                + Brake Pads
              </button>
              <button
                type="button"
                onClick={() => {
                  const comp = currentVehicle.components.find((c) => c.name.toLowerCase().includes('chain'));
                  if (comp) onNavigateToComponent(comp.id);
                  else onNavigateToLogService();
                }}
                className="px-2.5 py-1 rounded-lg bg-[#252627] hover:bg-[#303133] border border-[#353637] text-[11px] font-medium text-[#e4e2e0] shrink-0 cursor-pointer transition-colors"
              >
                + Chain Lube
              </button>
              <button
                type="button"
                onClick={() => {
                  const comp = currentVehicle.components.find((c) => c.name.toLowerCase().includes('air'));
                  if (comp) onNavigateToComponent(comp.id);
                  else onNavigateToLogService();
                }}
                className="px-2.5 py-1 rounded-lg bg-[#252627] hover:bg-[#303133] border border-[#353637] text-[11px] font-medium text-[#e4e2e0] shrink-0 cursor-pointer transition-colors"
              >
                + Air Filter
              </button>
              <button
                type="button"
                onClick={onNavigateToLogService}
                className="px-2.5 py-1 rounded-lg bg-[#252627] hover:bg-[#303133] border border-[#353637] text-[11px] font-medium text-[#8e9192] shrink-0 cursor-pointer transition-colors"
              >
                + Custom Repair
              </button>
            </div>
          </div>

          {/* 2-Column Telemetry Gauges (Interactive Odometer & Last Service) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Odometer with Quick Update KM Button */}
            <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-3 flex flex-col justify-between relative group">
              <div className="flex items-center justify-between text-[#8e9192]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">speed</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider">
                    CURRENT ODOMETER
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onOpenUpdateOdometer}
                  title="Update kilometers"
                  className="w-6 h-6 rounded bg-[#2a2a29] hover:bg-[#353534] hover:text-[#ffbb13] flex items-center justify-center text-[13px] text-[#8e9192] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                </button>
              </div>

              <div
                onClick={onOpenUpdateOdometer}
                className="mt-1 flex flex-col cursor-pointer"
                title="Click to update kilometers"
              >
                <span className="text-[22px] font-bold text-[#e4e2e0] font-mono tracking-tight leading-none group-hover:text-[#ffbb13] transition-colors">
                  {currentVehicle.odometer.toLocaleString('en-IN')}{' '}
                  <span className="text-[12px] font-normal text-[#8e9192]">km</span>
                </span>
                <span className="text-[11px] text-[#8e9192] mt-1 flex items-center justify-between">
                  <span>+{currentVehicle.weeklyDeltaKm} km this week</span>
                  <span className="text-[10px] text-[#ffbb13] underline">Edit km</span>
                </span>
              </div>

              {/* Quick Increment pills */}
              {onUpdateOdometer && (
                <div className="flex items-center gap-1 pt-1.5 mt-1 border-t border-[#2a2a29] overflow-x-auto no-scrollbar">
                  {[100, 500, 1000].map((add) => (
                    <button
                      key={add}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateOdometer(currentVehicle.odometer + add);
                      }}
                      className="px-1.5 py-0.5 rounded bg-[#2a2a29] hover:bg-[#353534] text-[9px] font-mono text-[#c6c6c6] hover:text-[#ffbb13] cursor-pointer shrink-0 transition-colors"
                      title={`Add ${add} km`}
                    >
                      +{add}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Last Service */}
            <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-[#8e9192]">
                <span className="material-symbols-outlined text-[15px]">history</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  LAST SERVICE
                </span>
              </div>
              <div className="mt-1 flex flex-col">
                <span className="text-[16px] font-bold text-[#e4e2e0] tracking-tight leading-none">
                  {currentVehicle.lastServiceDate}
                </span>
                <span className="text-[11px] text-[#8e9192] font-mono mt-1">
                  at {currentVehicle.lastServiceOdo.toLocaleString('en-IN')} km
                </span>
              </div>
            </div>
          </div>

          {/* 3-Column Quick Metrics Bar */}
          <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-3 grid grid-cols-3 divide-x divide-[#2a2a29] text-center">
            {/* Service logs */}
            <button
              onClick={onNavigateToRecords}
              className="flex flex-col items-center justify-center px-1 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="material-symbols-outlined text-[18px] text-[#8e9192] mb-0.5">
                receipt_long
              </span>
              <span className="text-[16px] font-bold text-[#e4e2e0] font-mono">
                {currentVehicle.serviceCount}
              </span>
              <span className="text-[10px] text-[#8e9192]">Service Logs</span>
            </button>

            {/* Total spend */}
            <button
              onClick={onNavigateToRecords}
              className="flex flex-col items-center justify-center px-1 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="material-symbols-outlined text-[18px] text-[#8e9192] mb-0.5">
                payments
              </span>
              <span className="text-[16px] font-bold text-[#e4e2e0] font-mono">
                ₹{currentVehicle.totalSpend.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-[#8e9192]">Total Spend</span>
            </button>

            {/* Distance since service */}
            <div className="flex flex-col items-center justify-center px-1">
              <span className="material-symbols-outlined text-[18px] text-[#8e9192] mb-0.5">
                location_on
              </span>
              <span className="text-[16px] font-bold text-[#e4e2e0] font-mono">
                {kmSinceService} km
              </span>
              <span className="text-[10px] text-[#8e9192]">Since Service</span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE DUE NEXT CARD */}
      <section className="px-4 pb-3">
        <button
          onClick={onNavigateToLogService}
          className="w-full bg-[#1b1c1b] hover:bg-[#202120] border border-[#2a2a29] rounded-xl p-3.5 flex items-center justify-between text-left transition-all active:scale-[0.99] cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2a2a29] flex items-center justify-center text-[#ffbb13] shrink-0">
              <span className="material-symbols-outlined text-[20px]">build</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffbb13] animate-pulse" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#ffbb13]">
                  SERVICE DUE NEXT
                </span>
              </div>
              <span className="text-[14px] font-bold text-[#e4e2e0]">
                In {currentVehicle.nextDueKm.toLocaleString('en-IN')} km or {currentVehicle.nextDueDays} days
              </span>
              <span className="text-[11px] text-[#8e9192] font-mono">
                Target milestone: {currentVehicle.nextMilestoneKm.toLocaleString('en-IN')} km
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[20px] text-[#8e9192]">
            chevron_right
          </span>
        </button>
      </section>

      {/* FLEET HEALTH OVERVIEW CARD (Line Items Updating According to Km Input) */}
      <section className="px-4 pb-4">
        <div
          onClick={onNavigateToHealth}
          className="bg-[#1b1c1b] border border-[#2a2a29] rounded-2xl p-4 flex flex-col gap-3 cursor-pointer hover:border-[#444748] transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#ffbb13]">
                verified_user
              </span>
              <h4 className="text-[14px] font-bold text-[#e4e2e0]">Fleet Health Overview</h4>
            </div>
            <span className="text-[11px] text-[#8e9192]">
              {currentVehicle.healthyCount} of {currentVehicle.monitoredPartsCount} systems rated green
            </span>
          </div>

          {/* Visual silhouette representation */}
          <div className="w-full bg-[#141515] rounded-xl p-2 border border-[#242526] overflow-hidden">
            <BikeVisual type={currentVehicle.id === 'gt-650' ? 'gt650' : 'xpulse'} />
          </div>

          {/* Dynamic Service Line Items (Updated According to Km) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px] text-[#8e9192] px-1">
              <span className="uppercase font-semibold text-[10px]">Manual Schedule Wear ({currentVehicle.odometer} km)</span>
              <span className="text-[#ffbb13] font-mono">Tap for all {currentVehicle.components.length} parts →</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {previewComps.map((comp) => {
                const isAlert = comp.status === 'due_soon' || comp.status === 'action_req';
                return (
                  <button
                    key={comp.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToComponent(comp.id);
                    }}
                    className={`py-2 px-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                      isAlert
                        ? 'bg-[#252627] border-[#ffbb13]/40 hover:bg-[#2c2d2f]'
                        : 'bg-[#202120] border-[#2a2a29] hover:bg-[#282928]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#e4e2e0] truncate max-w-[100px]">
                        {comp.name}
                      </span>
                      <span
                        className={`text-[11px] font-bold font-mono ${
                          isAlert ? 'text-[#ffbb13]' : 'text-[#c6c6c6]'
                        }`}
                      >
                        {comp.percentage}%
                      </span>
                    </div>

                    <div className="w-full h-1 rounded-full bg-[#353534] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isAlert ? 'bg-[#ffbb13]' : 'bg-[#767777]'}`}
                        style={{ width: `${comp.percentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[9px] text-[#8e9192] font-mono">
                      <span>{comp.usedKm} km used</span>
                      <span className={isAlert ? 'text-[#ffbb13] font-semibold' : ''}>
                        {comp.remainingKm} km left
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
