import React from 'react';
import { Vehicle } from '../types';

interface MoreScreenProps {
  vehicle: Vehicle;
  vehicles?: Vehicle[];
  onAddVehicle: () => void;
  onResetData: () => void;
  onExportLedger: () => void;
  onShowLoadingScreen?: () => void;
  onOpenDeleteVehicle?: () => void;
  onDeleteVehicle?: (vehicleId: string) => void;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({
  vehicle,
  vehicles = [],
  onAddVehicle,
  onResetData,
  onExportLedger,
  onShowLoadingScreen,
  onOpenDeleteVehicle,
  onDeleteVehicle,
}) => {
  return (
    <div className="flex flex-col w-full text-[#e4e2e0] pb-24">
      <section className="px-4 pt-3 pb-3 flex flex-col gap-3">
        <div>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[#8e9192]">
            FLEET PREFERENCES
          </span>
          <h2 className="text-[22px] font-bold tracking-tight text-[#e4e2e0]">
            System &amp; Settings
          </h2>
        </div>

        {/* Vehicle Management */}
        <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl overflow-hidden divide-y divide-[#2a2a29]">
          <button
            onClick={onAddVehicle}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#252627] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2a2a29] flex items-center justify-center text-[#ffbb13]">
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
              </div>
              <div>
                <span className="text-[13px] font-semibold text-[#e4e2e0] block">Add New Motorcycle</span>
                <span className="text-[11px] text-[#8e9192]">Expand your garage fleet</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#8e9192]">chevron_right</span>
          </button>

          {onShowLoadingScreen && (
            <button
              onClick={onShowLoadingScreen}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#252627] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2a2a29] flex items-center justify-center text-[#ffbb13]">
                  <span className="material-symbols-outlined text-[18px]">motion_photos_on</span>
                </div>
                <div>
                  <span className="text-[13px] font-semibold text-[#e4e2e0] block">
                    Play Telemetry Boot Animation
                  </span>
                  <span className="text-[11px] text-[#8e9192]">
                    Motorcycle silhouette &amp; 3 yellow dots loader
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] text-[#8e9192]">play_arrow</span>
            </button>
          )}

          <button
            onClick={onExportLedger}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#252627] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2a2a29] flex items-center justify-center text-[#ffbb13]">
                <span className="material-symbols-outlined text-[18px]">download</span>
              </div>
              <div>
                <span className="text-[13px] font-semibold text-[#e4e2e0] block">Export Service Ledger</span>
                <span className="text-[11px] text-[#8e9192]">Backup JSON/CSV records &amp; invoices</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#8e9192]">chevron_right</span>
          </button>
        </div>

        {/* Fleet Motorcycles Management & Delete */}
        {vehicles.length > 0 && (
          <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-3.5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-[12px] uppercase font-bold text-[#8e9192] tracking-wider">
                Garage Fleet Motorcycles ({vehicles.length})
              </h3>
              <span className="text-[10px] text-[#8e9192]">Manage &amp; Delete</span>
            </div>

            <div className="divide-y divide-[#2a2a29]">
              {vehicles.map((v) => (
                <div key={v.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#2a2a29] flex items-center justify-center text-[#c6c6c6] shrink-0">
                      <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-[13px] font-semibold text-[#e4e2e0] block truncate">
                        {v.name}
                      </span>
                      <span className="text-[11px] text-[#8e9192] font-mono">
                        {v.odometer.toLocaleString('en-IN')} km · {v.components.length} parts
                      </span>
                    </div>
                  </div>

                  {onDeleteVehicle && (
                    <button
                      type="button"
                      disabled={vehicles.length <= 1}
                      onClick={() => {
                        if (vehicles.length > 1) {
                          onDeleteVehicle(v.id);
                        }
                      }}
                      title={vehicles.length <= 1 ? 'Cannot delete only remaining motorcycle' : `Delete ${v.name}`}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                        vehicles.length <= 1
                          ? 'opacity-40 text-[#8e9192] cursor-not-allowed'
                          : 'bg-[#93000a]/20 hover:bg-[#93000a]/40 text-[#ffb4ab] cursor-pointer'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Configuration settings */}
        <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-3.5 flex flex-col gap-3">
          <h3 className="text-[12px] uppercase font-bold text-[#8e9192] tracking-wider">
            Telemetry Preferences
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-[13px] font-semibold text-[#e4e2e0] block">Measurement Units</span>
              <span className="text-[11px] text-[#8e9192]">Metric system (Kilometers, Litres)</span>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded bg-[#2a2a29] text-[#ffbb13] font-mono font-semibold">
              KM / LTR
            </span>
          </div>

          <div className="h-px bg-[#2a2a29]"></div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-[13px] font-semibold text-[#e4e2e0] block">Currency System</span>
              <span className="text-[11px] text-[#8e9192]">Indian Rupee (INR)</span>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded bg-[#2a2a29] text-[#ffbb13] font-mono font-semibold">
              ₹ (INR)
            </span>
          </div>
        </div>

        {/* Reset Demo State */}
        <div className="pt-2">
          <button
            onClick={onResetData}
            className="w-full py-3 px-4 rounded-xl border border-[#93000a]/40 bg-[#93000a]/10 hover:bg-[#93000a]/20 text-[#ffb4ab] text-[12px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Reset Demo Data to Initial Preset</span>
          </button>
        </div>
      </section>
    </div>
  );
};
