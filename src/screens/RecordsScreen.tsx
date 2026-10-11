import React, { useState } from 'react';
import { Vehicle, ServiceRecord } from '../types';

interface RecordsScreenProps {
  vehicle: Vehicle;
  onLogMaintenance: () => void;
  onViewAttachment: (url: string, name: string) => void;
}

export const RecordsScreen: React.FC<RecordsScreenProps> = ({
  vehicle,
  onLogMaintenance,
  onViewAttachment,
}) => {
  const [filterAction, setFilterAction] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const records = vehicle.serviceHistory.filter((rec) => {
    if (filterAction !== 'All' && rec.action !== filterAction) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        rec.title.toLowerCase().includes(q) ||
        rec.description.toLowerCase().includes(q) ||
        rec.targetComponent.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalSpent = vehicle.serviceHistory.reduce(
    (sum, r) => sum + r.partsCost + r.labourCost,
    0
  );

  return (
    <div className="flex flex-col w-full text-[#e4e2e0] pb-24">
      {/* Header Summary */}
      <section className="px-4 pt-3 pb-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#8e9192]">
              MAINTENANCE LEDGER
            </span>
            <h2 className="text-[22px] font-bold tracking-tight text-[#e4e2e0]">
              Service Records
            </h2>
          </div>
          <button
            onClick={onLogMaintenance}
            className="px-3.5 py-1.5 bg-[#ffbb13] text-[#131313] text-[12px] font-bold rounded-lg flex items-center gap-1 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Log</span>
          </button>
        </div>

        {/* Ledger quick metric summary */}
        <div className="grid grid-cols-3 gap-2 bg-[#1f201f] border border-[#2a2a29] rounded-xl p-3 text-center">
          <div>
            <span className="text-[10px] text-[#8e9192] uppercase block font-semibold">
              Total Spend
            </span>
            <span className="text-[16px] font-bold text-[#ffbb13] font-mono">
              ₹{totalSpent.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#8e9192] uppercase block font-semibold">
              Logs Count
            </span>
            <span className="text-[16px] font-bold text-[#e4e2e0] font-mono">
              {vehicle.serviceHistory.length}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#8e9192] uppercase block font-semibold">
              Avg / Service
            </span>
            <span className="text-[16px] font-bold text-[#e4e2e0] font-mono">
              ₹{vehicle.serviceHistory.length ? Math.round(totalSpent / vehicle.serviceHistory.length).toLocaleString('en-IN') : 0}
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined text-[18px] text-[#8e9192] absolute left-3">
            search
          </span>
          <input
            type="text"
            placeholder="Search records, parts, fluids..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1b1c1b] border border-[#2a2a29] rounded-xl pl-9 pr-3 py-2 text-[13px] text-[#e4e2e0] placeholder-[#8e9192] focus:outline-none focus:border-[#ffbb13]"
          />
        </div>

        {/* Action Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {['All', 'Replaced', 'Inspected', 'Cleaned', 'Lubricated'].map((action) => (
            <button
              key={action}
              onClick={() => setFilterAction(action)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-colors cursor-pointer ${
                filterAction === action
                  ? 'bg-[#ffbb13] text-[#131313]'
                  : 'bg-[#2a2a29] text-[#8e9192] hover:text-[#e4e2e0]'
              }`}
            >
              {action}
            </button>
          ))}
        </div>
      </section>

      {/* Records Timeline List */}
      <section className="px-4 flex flex-col gap-3">
        {records.length === 0 ? (
          <div className="text-center py-12 text-[#8e9192] text-[13px]">
            No maintenance records found matching your filter.
          </div>
        ) : (
          records.map((rec) => (
            <div
              key={rec.id}
              className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-3.5 flex flex-col gap-2 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#2a2a29] text-[#ffbb13] font-semibold font-mono">
                      {rec.action}
                    </span>
                    <span className="text-[14px] font-bold text-[#e4e2e0]">
                      {rec.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8e9192] mt-0.5 block">
                    {rec.date} · {rec.targetComponent}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[14px] font-bold text-[#ffbb13] font-mono block">
                    ₹{(rec.partsCost + rec.labourCost).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-[#8e9192] font-mono">
                    {rec.odometer.toLocaleString('en-IN')} km
                  </span>
                </div>
              </div>

              <p className="text-[12px] text-[#c4c7c7] leading-relaxed">
                {rec.description}
              </p>

              {/* Financial details breakdown */}
              <div className="flex items-center gap-3 text-[11px] text-[#8e9192] pt-1 border-t border-[#2a2a29]">
                <span>Parts: <span className="text-[#e4e2e0] font-mono">₹{rec.partsCost}</span></span>
                <span>Labour: <span className="text-[#e4e2e0] font-mono">₹{rec.labourCost}</span> {rec.isDiy ? '(DIY)' : ''}</span>
                {rec.fluidQty && (
                  <span>Qty: <span className="text-[#e4e2e0] font-mono">{rec.fluidQty}L</span></span>
                )}
              </div>

              {/* Attachments if any */}
              {rec.attachments && rec.attachments.length > 0 && (
                <div className="flex gap-2 pt-1 overflow-x-auto no-scrollbar">
                  {rec.attachments.map((att) => (
                    <button
                      key={att.id}
                      onClick={() => onViewAttachment(att.url, att.name)}
                      className="flex items-center gap-2 p-1.5 bg-[#171818] border border-[#2a2a29] rounded-lg shrink-0 cursor-pointer hover:border-[#444748]"
                    >
                      <div className="w-8 h-8 rounded bg-[#2a2a29] overflow-hidden shrink-0">
                        <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left">
                        <span className="text-[11px] font-semibold text-[#e4e2e0] block max-w-[120px] truncate">
                          {att.name}
                        </span>
                        <span className="text-[9px] text-[#8e9192]">Receipt View</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
};
