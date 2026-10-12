import React, { useState } from 'react';
import { Vehicle } from '../types';

interface UpdateOdometerModalProps {
  isOpen: boolean;
  vehicle: Vehicle;
  onClose: () => void;
  onUpdateOdometer: (newKm: number) => void;
}

export const UpdateOdometerModal: React.FC<UpdateOdometerModalProps> = ({
  isOpen,
  vehicle,
  onClose,
  onUpdateOdometer,
}) => {
  const [kmInput, setKmInput] = useState(vehicle.odometer);

  if (!isOpen) return null;

  const delta = kmInput - vehicle.odometer;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (kmInput >= 0) {
      onUpdateOdometer(Number(kmInput));
      onClose();
    }
  };

  const quickAdds = [50, 200, 500, 1000, 2500];

  return (
    <div className="fixed inset-0 z-50 bg-[#0e0e0e]/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1f201f] border border-[#2a2a29] rounded-2xl w-full max-w-sm p-4 flex flex-col gap-3.5 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-[#2a2a29]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#ffbb13] flex items-center justify-center text-[#131313] font-bold">
              <span className="material-symbols-outlined text-[20px]">speed</span>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#e4e2e0]">Update Odometer (km)</h3>
              <span className="text-[11px] text-[#8e9192]">{vehicle.name}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8e9192] hover:text-[#e4e2e0] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-[10px] uppercase font-semibold text-[#8e9192] mb-1">
              Current Odometer Reading
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                min="0"
                value={kmInput}
                onChange={(e) => setKmInput(Number(e.target.value))}
                className="w-full bg-[#2a2a29] border border-[#353534] rounded-xl px-4 py-3 text-[22px] font-bold text-[#e4e2e0] font-mono focus:outline-none focus:border-[#ffbb13]"
              />
              <span className="absolute right-4 text-[13px] text-[#8e9192] font-mono font-medium">
                KM
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#8e9192] mt-1.5 px-1">
              <span>Last Logged: <strong className="text-[#e4e2e0] font-mono">{vehicle.odometer} km</strong></span>
              <span className={delta >= 0 ? 'text-[#ffbb13] font-mono' : 'text-[#ffb4ab] font-mono'}>
                {delta >= 0 ? `+${delta}` : delta} km delta
              </span>
            </div>
          </div>

          {/* Quick add kilometer buttons */}
          <div>
            <span className="block text-[10px] uppercase font-semibold text-[#8e9192] mb-1.5">
              Quick Increment
            </span>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {quickAdds.map((add) => (
                <button
                  key={add}
                  type="button"
                  onClick={() => setKmInput((prev) => prev + add)}
                  className="px-2.5 py-1 rounded-lg bg-[#2a2a29] hover:bg-[#353534] border border-[#353534] text-[11px] font-mono text-[#c4c7c7] cursor-pointer shrink-0 transition-colors"
                >
                  +{add} km
                </button>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#141516] border border-[#2a2a29] text-[11px] text-[#8e9192] flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#ffbb13]">autorenew</span>
            <span>All 33 service line items will automatically update wear % and status.</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#2a2a29]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-[12px] text-[#8e9192] hover:text-[#e4e2e0] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#ffbb13] text-[#131313] font-bold text-[12px] rounded-lg cursor-pointer hover:brightness-105 shadow-md active:scale-[0.98]"
            >
              Update Telemetry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
