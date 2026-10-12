import React from 'react';
import { Vehicle } from '../types';

interface DeleteVehicleModalProps {
  isOpen: boolean;
  vehicle: Vehicle;
  canDelete: boolean;
  onClose: () => void;
  onConfirmDelete: (vehicleId: string) => void;
}

export const DeleteVehicleModal: React.FC<DeleteVehicleModalProps> = ({
  isOpen,
  vehicle,
  canDelete,
  onClose,
  onConfirmDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0e0e0e]/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1f201f] border border-[#2a2a29] rounded-2xl w-full max-w-sm p-4 flex flex-col gap-3.5 shadow-2xl">
        <div className="flex items-center gap-3 pb-2 border-b border-[#2a2a29]">
          <div className="w-10 h-10 rounded-full bg-[#93000a]/20 border border-[#93000a]/40 flex items-center justify-center text-[#ffb4ab] shrink-0">
            <span className="material-symbols-outlined text-[20px]">delete_forever</span>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#e4e2e0]">Delete Motorcycle</h3>
            <span className="text-[11px] text-[#8e9192]">Remove from fleet</span>
          </div>
        </div>

        {canDelete ? (
          <>
            <p className="text-[13px] text-[#c4c7c7] leading-relaxed">
              Are you sure you want to permanently remove{' '}
              <strong className="text-[#e4e2e0]">{vehicle.name}</strong> from your garage?
            </p>
            <p className="text-[11px] text-[#8e9192]">
              All telemetry, {vehicle.components.length} tracked service line items, and {vehicle.serviceCount} service history logs will be removed.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#2a2a29]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-[12px] text-[#8e9192] hover:text-[#e4e2e0] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirmDelete(vehicle.id);
                  onClose();
                }}
                className="px-4 py-2 bg-[#93000a] hover:bg-[#ba1a1a] text-[#ffdad6] text-[12px] font-bold rounded-lg cursor-pointer transition-colors shadow-md"
              >
                Delete Motorcycle
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="p-3 rounded-lg bg-[#251516] border border-[#ffb4ab]/30 text-[#ffb4ab] text-[12px] flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] shrink-0">warning</span>
              <span>
                Cannot delete <strong>{vehicle.name}</strong>. Your garage must have at least one active motorcycle in your fleet.
              </span>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#2a2a29] text-[#e4e2e0] text-[12px] font-semibold rounded-lg cursor-pointer"
              >
                Understood
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
