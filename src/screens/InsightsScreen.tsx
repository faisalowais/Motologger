import React from 'react';
import { Vehicle } from '../types';

interface InsightsScreenProps {
  vehicle: Vehicle;
  allVehicles: Vehicle[];
}

export const InsightsScreen: React.FC<InsightsScreenProps> = ({ vehicle, allVehicles }) => {
  const costPerKm = vehicle.odometer > 0 ? (vehicle.totalSpend / vehicle.odometer).toFixed(2) : '0.00';
  const kmSinceService = vehicle.odometer - vehicle.lastServiceOdo;

  const categories = [
    { name: 'Engine & Fluids', percent: 52, color: 'bg-[#ffbb13]', amount: Math.round(vehicle.totalSpend * 0.52) },
    { name: 'Chassis & Brakes', percent: 28, color: 'bg-[#c6c6c6]', amount: Math.round(vehicle.totalSpend * 0.28) },
    { name: 'Consumables & Chain', percent: 12, color: 'bg-[#767777]', amount: Math.round(vehicle.totalSpend * 0.12) },
    { name: 'Workshop Labour', percent: 8, color: 'bg-[#444748]', amount: Math.round(vehicle.totalSpend * 0.08) },
  ];

  return (
    <div className="flex flex-col w-full text-[#e4e2e0] pb-24">
      <section className="px-4 pt-3 pb-3 flex flex-col gap-3">
        <div>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[#8e9192]">
            TELEMETRY ANALYTICS
          </span>
          <h2 className="text-[22px] font-bold tracking-tight text-[#e4e2e0]">
            Fleet Insights
          </h2>
        </div>

        {/* Efficiency Metric Card */}
        <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#8e9192] font-semibold">
              Cost Efficiency Index
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#2a2a29] text-[#ffbb13] font-mono">
              {vehicle.shortName}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-[#ffbb13] font-mono leading-none">
              ₹{costPerKm}
            </span>
            <span className="text-[13px] text-[#8e9192] font-medium">/ km maintenance spend</span>
          </div>

          <p className="text-[11px] text-[#8e9192] leading-relaxed">
            Calculated across {vehicle.odometer.toLocaleString('en-IN')} total lifetime kilometers and {vehicle.serviceCount} logged maintenance services.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#2a2a29]">
            <div>
              <span className="text-[10px] text-[#8e9192] block uppercase font-semibold">Weekly Burn Rate</span>
              <span className="text-[14px] font-bold text-[#e4e2e0] font-mono">
                ~{vehicle.weeklyDeltaKm} km / week
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#8e9192] block uppercase font-semibold">Interval Elapsed</span>
              <span className="text-[14px] font-bold text-[#e4e2e0] font-mono">
                {kmSinceService} km since service
              </span>
            </div>
          </div>
        </div>

        {/* Spend Category Breakdown */}
        <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-[#e4e2e0]">Expense Distribution</h3>
            <span className="text-[11px] text-[#ffbb13] font-mono font-semibold">
              ₹{vehicle.totalSpend.toLocaleString('en-IN')} Total
            </span>
          </div>

          {/* Stacked bar */}
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#121314]">
            {categories.map((c) => (
              <div
                key={c.name}
                className={`h-full ${c.color}`}
                style={{ width: `${c.percent}%` }}
                title={`${c.name}: ${c.percent}%`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-2 pt-1">
            {categories.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${c.color}`}></span>
                  <span className="text-[#c4c7c7]">{c.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[#8e9192]">{c.percent}%</span>
                  <span className="text-[#e4e2e0] font-semibold">₹{c.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Comparison */}
        <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-4 flex flex-col gap-2.5">
          <h3 className="text-[13px] font-bold text-[#e4e2e0]">Fleet Health Scorecard</h3>
          <div className="divide-y divide-[#2a2a29]">
            {allVehicles.map((v) => (
              <div key={v.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-[#2a2a29] flex items-center justify-center text-[#c6c6c6]">
                    <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
                  </div>
                  <div>
                    <span className="text-[13px] font-semibold text-[#e4e2e0] block">{v.shortName}</span>
                    <span className="text-[10px] text-[#8e9192] font-mono">{v.odometer.toLocaleString('en-IN')} km</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[13px] font-bold text-[#ffbb13] font-mono block">{v.healthPercent}%</span>
                    <span className="text-[9px] text-[#8e9192] uppercase">Rating</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
