import React, { useState } from 'react';
import { Vehicle } from '../types';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newVehicle: Vehicle) => void;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [year, setYear] = useState(2024);
  const [displacement, setDisplacement] = useState('390 cc');
  const [category, setCategory] = useState('Adventure Touring');
  const [odometer, setOdometer] = useState(1500);
  const [photoUrl, setPhotoUrl] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = `bike-${Date.now()}`;
    const newV: Vehicle = {
      id,
      name,
      shortName: shortName.trim() || name.split(' ')[0],
      vin: `····${Math.floor(1000 + Math.random() * 9000)}`,
      year,
      displacement,
      category,
      odometer: Number(odometer),
      weeklyDeltaKm: 50,
      lastServiceDate: '01 Oct 2026',
      lastServiceOdo: Math.max(0, odometer - 500),
      totalSpend: 1500,
      serviceCount: 1,
      nextDueKm: 4500,
      nextDueDays: 90,
      nextMilestoneKm: odometer + 4500,
      healthPercent: 95,
      monitoredPartsCount: 8,
      healthyCount: 8,
      dueSoonCount: 0,
      actionReqCount: 0,
      photoUrl: photoUrl || undefined,
      components: [
        {
          id: `engine-oil-${id}`,
          name: 'Engine Oil',
          category: 'Engine',
          spec: '10W-50',
          intervalKm: 7500,
          usedKm: 500,
          remainingKm: 7000,
          percentage: 7,
          status: 'healthy',
          icon: 'oil_barrel',
          lastChangedDate: '01 Oct 2026',
          lastChangedOdo: odometer - 500,
          nextDueDate: '01 Oct 2027',
          nextDueOdo: odometer + 7000,
          specDetail: 'Full Synthetic SAE 10W-50',
          capacity: '1.7 Litres',
        },
        {
          id: `chain-${id}`,
          name: 'Drive Chain',
          category: 'Chassis',
          spec: 'Slack 25mm',
          intervalKm: 700,
          usedKm: 120,
          remainingKm: 580,
          percentage: 17,
          status: 'healthy',
          icon: 'link',
          lastChangedDate: '01 Oct 2026',
          lastChangedOdo: odometer - 500,
          nextDueDate: '15 Nov 2026',
          nextDueOdo: odometer + 580,
          specDetail: '520 O-Ring Chain',
          capacity: 'Chain lube spray',
        },
      ],
      serviceHistory: [
        {
          id: `log-init-${id}`,
          vehicleId: id,
          date: '01 Oct 2026',
          odometer: Math.max(0, odometer - 500),
          title: 'Initial Registration & PDI Inspection',
          action: 'Inspected',
          targetComponent: 'Engine Oil',
          description: 'PDI checklist completed. Fluids and chain checked.',
          partsCost: 1500,
          labourCost: 0,
          isDiy: true,
        },
      ],
    };

    onAdd(newV);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0e0e0e]/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1f201f] border border-[#2a2a29] rounded-2xl w-full max-w-sm p-4 flex flex-col gap-3 shadow-2xl">
        <div className="flex items-center justify-between pb-1 border-b border-[#2a2a29]">
          <h3 className="text-[16px] font-bold text-[#e4e2e0]">Add Motorcycle to Garage</h3>
          <button
            onClick={onClose}
            className="text-[#8e9192] hover:text-[#e4e2e0] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-[13px]">
          <div>
            <label className="block text-[10px] uppercase font-semibold text-[#8e9192] mb-1">
              Vehicle Model Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. KTM 390 Adventure"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#2a2a29] border border-[#353534] rounded-lg px-3 py-2 text-[#e4e2e0] focus:outline-none focus:border-[#ffbb13]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] uppercase font-semibold text-[#8e9192] mb-1">
                Badge / Short Name
              </label>
              <input
                type="text"
                placeholder="e.g. 390 Adv"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                className="w-full bg-[#2a2a29] border border-[#353534] rounded-lg px-3 py-2 text-[#e4e2e0] focus:outline-none focus:border-[#ffbb13]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-semibold text-[#8e9192] mb-1">
                Model Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-[#2a2a29] border border-[#353534] rounded-lg px-3 py-2 text-[#e4e2e0] focus:outline-none focus:border-[#ffbb13]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] uppercase font-semibold text-[#8e9192] mb-1">
                Engine Displacement
              </label>
              <input
                type="text"
                value={displacement}
                onChange={(e) => setDisplacement(e.target.value)}
                className="w-full bg-[#2a2a29] border border-[#353534] rounded-lg px-3 py-2 text-[#e4e2e0] focus:outline-none focus:border-[#ffbb13]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-semibold text-[#8e9192] mb-1">
                Current Odometer (km)
              </label>
              <input
                type="number"
                value={odometer}
                onChange={(e) => setOdometer(Number(e.target.value))}
                className="w-full bg-[#2a2a29] border border-[#353534] rounded-lg px-3 py-2 text-[#e4e2e0] focus:outline-none focus:border-[#ffbb13]"
              />
            </div>
          </div>

          {/* Motorcycle Picture Option */}
          <div>
            <label className="block text-[10px] uppercase font-semibold text-[#8e9192] mb-1">
              Motorcycle Picture (Optional)
            </label>
            <div className="flex items-center gap-2">
              <label className="flex-1 py-2 px-3 rounded-lg bg-[#2a2a29] hover:bg-[#353534] border border-[#353534] flex items-center justify-center gap-1.5 text-[11px] text-[#e4e2e0] font-medium cursor-pointer">
                <span className="material-symbols-outlined text-[16px] text-[#ffbb13]">add_a_photo</span>
                <span>{photoUrl ? 'Photo Selected' : 'Upload from Device'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              {photoUrl && (
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#ffbb13]">
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-[#8e9192] hover:text-[#e4e2e0] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#ffbb13] text-[#131313] font-bold rounded-lg cursor-pointer hover:brightness-105"
            >
              Add Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
