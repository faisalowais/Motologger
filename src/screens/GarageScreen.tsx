import React from 'react';
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
}) => {
  const kmSinceService = currentVehicle.odometer - currentVehicle.lastServiceOdo;

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
            className="w-10 h-10 rounded-full bg-[#2a2a29] hover:bg-[#353534] active:scale-95 transition-all flex items-center justify-center text-[#e4e2e0] cursor-pointer"
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
        <div className="bg-[#1b1c1b] border border-[#2a2a29] rounded-2xl p-4 flex flex-col gap-3.5">
          {/* Header row */}
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
            <button
              onClick={onNavigateToHealth}
              aria-label="Bike telemetry menu"
              className="w-8 h-8 rounded-full bg-[#2a2a29] hover:bg-[#353534] flex items-center justify-center text-[#c4c7c7] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">more_horiz</span>
            </button>
          </div>

          {/* Large Hero Motorcycle Visual */}
          <div className="w-full rounded-xl overflow-hidden bg-[#121314] border border-[#262728]">
            <BikeVisual
              type={currentVehicle.id === 'gt-650' ? 'gt650' : 'xpulse'}
              photoUrl={currentVehicle.photoUrl}
              onUploadPhoto={onUploadPhoto}
            />
          </div>

          {/* 2-Column Telemetry Gauges */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Odometer */}
            <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-[#8e9192]">
                <span className="material-symbols-outlined text-[15px]">speed</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  CURRENT ODOMETER
                </span>
              </div>
              <div className="mt-1 flex flex-col">
                <span className="text-[22px] font-bold text-[#e4e2e0] font-mono tracking-tight leading-none">
                  {currentVehicle.odometer.toLocaleString('en-IN')}{' '}
                  <span className="text-[12px] font-normal text-[#8e9192]">km</span>
                </span>
                <span className="text-[11px] text-[#8e9192] mt-1">
                  +{currentVehicle.weeklyDeltaKm} km this week
                </span>
              </div>
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
          className="w-full bg-[#1b1c1b] hover:bg-[#202120] border border-[#2a2a29] rounded-xl p-3.5 flex items-center justify-between text-left transition-all active:scale-[0.99] cursor-pointer"
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

      {/* FLEET HEALTH OVERVIEW CARD */}
      <section className="px-4 pb-4">
        <div
          onClick={onNavigateToHealth}
          className="bg-[#1b1c1b] border border-[#2a2a29] rounded-2xl p-4 flex flex-col gap-3 cursor-pointer hover:border-[#444748] transition-all"
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

          {/* Quick status pills */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToComponent('engine-oil');
              }}
              className="py-1.5 px-2 bg-[#202120] hover:bg-[#282928] border border-[#2a2a29] rounded-lg text-[11px] truncate text-[#c4c7c7]"
            >
              <span className="text-[#ffbb13] font-semibold">Engine Oil:</span> 73% life
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToComponent('front-brake-pads');
              }}
              className="py-1.5 px-2 bg-[#202120] hover:bg-[#282928] border border-[#2a2a29] rounded-lg text-[11px] truncate text-[#c4c7c7]"
            >
              <span className="text-[#c6c6c6] font-semibold">Brake Pads:</span> Good
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToComponent('drive-chain');
              }}
              className="py-1.5 px-2 bg-[#202120] hover:bg-[#282928] border border-[#2a2a29] rounded-lg text-[11px] truncate text-[#c4c7c7]"
            >
              <span className="text-[#c6c6c6] font-semibold">Chain:</span> Lubed
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
