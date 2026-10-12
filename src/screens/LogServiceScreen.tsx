import React, { useState } from 'react';
import { Vehicle, ServiceRecord, AttachmentItem } from '../types';

interface LogServiceScreenProps {
  vehicle: Vehicle;
  preselectedComponentId?: string;
  onBack: () => void;
  onSaveRecord: (record: ServiceRecord, resetComponentId?: string) => void;
}

export const LogServiceScreen: React.FC<LogServiceScreenProps> = ({
  vehicle,
  preselectedComponentId = 'engine-oil',
  onBack,
  onSaveRecord,
}) => {
  const selectedComp = vehicle.components.find((c) => c.id === preselectedComponentId) || vehicle.components[0];

  const [serviceDate, setServiceDate] = useState('12 Oct 2026');
  const [odometer, setOdometer] = useState(vehicle.odometer);
  const [targetComponent, setTargetComponent] = useState(selectedComp ? selectedComp.name : 'Engine Oil');
  const [actionPerformed, setActionPerformed] = useState<'Replaced' | 'Inspected' | 'Cleaned' | 'Lubricated' | 'Topped Up'>('Replaced');
  
  // Parts & Specs
  const [oilBrand, setOilBrand] = useState('Motul');
  const [viscosity, setViscosity] = useState('10W-40 (7100 4T)');
  const [fluidQty, setFluidQty] = useState(1.2);
  const [filterChanged, setFilterChanged] = useState(true);
  const [strainerCleaned, setStrainerCleaned] = useState(false);

  // Financials
  const [isDiy, setIsDiy] = useState(true);
  const [partsCost, setPartsCost] = useState(1150);
  const [labourCost, setLabourCost] = useState(250);

  // Notes & Attachments
  const [notes, setNotes] = useState('Did it at home. Oil drain plug torqued to 25 Nm. New crush washer installed.');
  const [attachments, setAttachments] = useState<AttachmentItem[]>([
    {
      id: 'att-oil',
      name: 'Motul 300V/7100',
      label: 'Oil Bottle',
      type: 'image',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCb7U-KGJyCwyL6nmor_EUVuqFJLtioifve5BrGQl-aSJ5hPpI3qFTSv7Lh5QT3Y7p2F1mI_tzSinBo9ltcQKGlJ2431wsLaxFirsXgxK_RN5nWjbmoVyWYYimHeC5sFdbixx3Z7C8U5zEv5ApWr2Gkhdr0oZeLW3tmuKfAie8EUceWQj2UvenPOwnVde44bzgUeoUTzrRc-QUzvcD4MFxmYt1ET40B8PA64bXIsn4HzqaLFW8OKHQb',
    },
    {
      id: 'att-odo',
      name: 'Digital Cockpit Odo',
      label: 'Odo Read',
      type: 'image',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZYDqZF3xru3yNrjpA-RSJFOQFg08hGK2rwFcQsvibqY8ZkqSM_jKy3bL2E7X7JfHHNXS1oFXwsPXtmvAzdJDNTmAySG-ldXBjBy3SA86AMYeSHYxdWSBpfhG0kJ8rLiQe0N5Lj5b0edVKHAVYcZgc46djAVVe77OyHV3MPSGwLNbFZG67S0oN9M6QydlM1TRGIBn84sCH05LWY9ujXtyuH-XTbBltQaOihEQDGztjQpVLwEwpknbZ',
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Gemini Bill Scanning State
  const [isScanningBill, setIsScanningBill] = useState(false);
  const [scanSuccessMessage, setScanSuccessMessage] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // Calcs
  const currentLabour = isDiy ? 0 : labourCost;
  const netTotalCost = partsCost + currentLabour;
  const deltaKm = odometer - vehicle.lastServiceOdo;

  const handleAdjustQty = (delta: number) => {
    setFluidQty((prev) => Math.max(0.1, Math.round((prev + delta) * 10) / 10));
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddPhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setAttachments((prev) => [
          ...prev,
          {
            id: `att-${Date.now()}`,
            name: file.name,
            label: 'Workshop Pic',
            type: 'image',
            url,
          },
        ]);
      }
    };
    input.click();
  };

  // Process uploaded bill with Gemini
  const handleUploadBillFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningBill(true);
    setScanError(null);
    setScanSuccessMessage(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        await scanBillWithApi(base64Data, file.type, file.name);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setScanError(err?.message || 'Failed to read bill file');
      setIsScanningBill(false);
    }
  };

  // Test with sample invoice
  const handleScanSampleInvoice = async () => {
    setIsScanningBill(true);
    setScanError(null);
    setScanSuccessMessage(null);

    const sampleUrl =
      'https://lh3.googleusercontent.com/aida-public/AB6AXuABUn-Pk0H7ZSjjJ5N8prTYplL_wABmtSz_WLzm2LzXTfpKUbbRtVUok6L8VA-MxgRA6Pbgz6_Xl3eX9-wgIJOEJxweLSCx56HFTRQ3cVmfeVhqJRJOwEWJnURrgvAzjSkg0XtzPzAvwPaf0DLzhTH9vYMhmUsZhj9gRAOpQc5sAJykAD447FNxKEEZvHv7EAtFpBJ5aSOHFnpdRPxtzgtK4BOq7aVRmph89RL9_vGkjTE5p72kbagM';

    try {
      // Send sample receipt text and url to server
      const res = await fetch('/api/gemini/parse-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billText:
            'Motul 7100 4T 10W-40 1.2L Engine Oil ₹1,150. OEM Hero Oil filter replacement ₹180. Workshop labour fee ₹250. Odometer: 12,213 km. Date: 12 Oct 2026. Oil drain plug torqued to 25 Nm.',
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        applyParsedBillData(json.data, sampleUrl, 'Sample_Invoice_Receipt.jpg');
      } else {
        throw new Error(json.error || 'Gemini could not parse sample bill');
      }
    } catch (err: any) {
      setScanError(err?.message || 'Error communicating with Gemini');
    } finally {
      setIsScanningBill(false);
    }
  };

  const scanBillWithApi = async (base64Data: string, mimeType: string, fileName: string) => {
    try {
      const res = await fetch('/api/gemini/parse-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        applyParsedBillData(json.data, base64Data, fileName);
      } else {
        throw new Error(json.error || 'Gemini could not parse invoice numbers');
      }
    } catch (err: any) {
      setScanError(err?.message || 'Failed to scan bill');
    } finally {
      setIsScanningBill(false);
    }
  };

  const applyParsedBillData = (data: any, previewUrl: string, fileName: string) => {
    if (data.odometer) setOdometer(Number(data.odometer));
    if (data.serviceDate) setServiceDate(data.serviceDate);
    if (data.targetComponent) setTargetComponent(data.targetComponent);
    if (data.action) setActionPerformed(data.action);
    if (data.partsCost !== undefined) setPartsCost(Number(data.partsCost));
    if (data.labourCost !== undefined) {
      setLabourCost(Number(data.labourCost));
      setIsDiy(Number(data.labourCost) === 0);
    }
    if (data.oilBrand) setOilBrand(data.oilBrand);
    if (data.viscosity) setViscosity(data.viscosity);
    if (data.fluidQty) setFluidQty(Number(data.fluidQty));
    if (data.filterChanged !== undefined) setFilterChanged(Boolean(data.filterChanged));
    if (data.strainerCleaned !== undefined) setStrainerCleaned(Boolean(data.strainerCleaned));
    if (data.notes) setNotes(data.notes);

    // Append invoice to attachments
    setAttachments((prev) => [
      {
        id: `att-bill-${Date.now()}`,
        name: fileName,
        label: 'Scanned Bill',
        type: 'image',
        url: previewUrl,
        size: 'Auto-scanned',
      },
      ...prev,
    ]);

    setScanSuccessMessage(
      `Gemini successfully read numbers: ₹${((data.partsCost || 0) + (data.labourCost || 0)).toLocaleString('en-IN')} net cost, ${data.odometer || odometer} km, ${data.oilBrand || ''} ${data.viscosity || ''} auto-updated!`
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);

      const newRecord: ServiceRecord = {
        id: `log-${Date.now()}`,
        vehicleId: vehicle.id,
        date: serviceDate,
        odometer: Number(odometer),
        title: `${actionPerformed} ${targetComponent}`,
        action: actionPerformed,
        targetComponent,
        description: notes,
        partsCost,
        labourCost: currentLabour,
        isDiy,
        oilBrand,
        oilViscosity: viscosity,
        fluidQty,
        filterReplaced: filterChanged,
        strainerCleaned,
        attachments,
      };

      const matchedComp = vehicle.components.find(
        (c) => c.name.toLowerCase() === targetComponent.toLowerCase()
      );

      onSaveRecord(newRecord, matchedComp?.id || preselectedComponentId);
    }, 600);
  };

  const actionPills: ('Replaced' | 'Inspected' | 'Cleaned' | 'Lubricated' | 'Topped Up')[] = [
    'Replaced',
    'Inspected',
    'Cleaned',
    'Lubricated',
    'Topped Up',
  ];

  return (
    <div className="flex flex-col w-full text-[#e4e2e0] pb-24 select-none">
      {/* Sub-header bar / Bike context badge */}
      <div className="px-4 pt-2 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#ffbb13] animate-pulse"></div>
          <span className="text-[11px] font-semibold text-[#8e9192] uppercase tracking-wider">
            Logging to:
          </span>
          <span className="text-[13px] text-[#e4e2e0] font-bold">
            {vehicle.name}
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2a2a29] text-[#8e9192] font-mono">
          VIN: {vehicle.vin}
        </span>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-4 px-4">
        {/* GEMINI BILL OCR AUTO-SCANNER BANNER */}
        <section className="bg-gradient-to-r from-[#1f201f] to-[#252627] border border-[#ffbb13]/30 rounded-xl p-3 flex flex-col gap-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#ffbb13] flex items-center justify-center text-[#131313] font-bold">
                <span className="material-symbols-outlined text-[18px]">document_scanner</span>
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-[#e4e2e0] flex items-center gap-1.5">
                  Scan Maintenance Bill with Gemini
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#ffbb13]/20 text-[#ffbb13] uppercase font-mono font-semibold">
                    AI Auto-Fill
                  </span>
                </h4>
                <p className="text-[10px] text-[#8e9192]">
                  Upload receipt to auto-extract date, odo, costs &amp; fluid specs
                </p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            <label className="flex-1 py-2 px-3 rounded-lg bg-[#2a2a29] hover:bg-[#353534] border border-[#444748] flex items-center justify-center gap-1.5 text-[11px] text-[#e4e2e0] font-semibold cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-[16px] text-[#ffbb13]">upload_file</span>
              <span>{isScanningBill ? 'Scanning with Gemini...' : 'Upload Bill / Receipt'}</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                disabled={isScanningBill}
                className="hidden"
                onChange={handleUploadBillFile}
              />
            </label>

            <button
              type="button"
              disabled={isScanningBill}
              onClick={handleScanSampleInvoice}
              className="py-2 px-3 rounded-lg bg-[#1b1c1b] hover:bg-[#202120] border border-[#353534] text-[11px] text-[#ffbb13] font-semibold cursor-pointer shrink-0 transition-colors"
            >
              Try Sample Receipt
            </button>
          </div>

          {/* Loading indicator */}
          {isScanningBill && (
            <div className="flex items-center gap-2.5 py-1.5 px-2.5 bg-[#141516] rounded-lg border border-[#ffbb13]/40">
              <span className="material-symbols-outlined text-[18px] text-[#ffbb13] animate-spin">
                progress_activity
              </span>
              <span className="text-[11px] text-[#ffbb13] font-mono animate-pulse">
                Gemini is reading invoice lines &amp; updating telemetry numbers...
              </span>
            </div>
          )}

          {/* Success Banner */}
          {scanSuccessMessage && (
            <div className="flex items-start gap-2 py-1.5 px-2.5 bg-[#142017] border border-[#4ade80]/40 rounded-lg text-[#4ade80] text-[11px]">
              <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">check_circle</span>
              <span className="flex-1 leading-snug">{scanSuccessMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {scanError && (
            <div className="flex items-start gap-2 py-1.5 px-2.5 bg-[#251516] border border-[#ffb4ab]/40 rounded-lg text-[#ffb4ab] text-[11px]">
              <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
              <span className="flex-1 leading-snug">{scanError}</span>
            </div>
          )}
        </section>

        {/* SECTION 1: TELEMETRY & LOG DATE */}
        <section className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase tracking-wider text-[#8e9192] font-bold">
              Telemetry &amp; Log Date
            </span>
            <span className="text-[10px] text-[#ffbb13] flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[13px]">verified</span> Pre-synced
            </span>
          </div>

          <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-2.5 flex flex-col gap-2">
            {/* Date Row */}
            <div className="bg-[#2a2a29] rounded-lg p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#1b1c1b] flex items-center justify-center text-[#ffbb13]">
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                </div>
                <div>
                  <label className="block text-[10px] text-[#8e9192] uppercase font-semibold">
                    Service Date
                  </label>
                  <input
                    className="bg-transparent text-[14px] text-[#e4e2e0] font-semibold focus:outline-none w-32"
                    type="text"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-[#1b1c1b] flex items-center justify-center text-[#8e9192] hover:text-[#e4e2e0]"
              >
                <span className="material-symbols-outlined text-[18px]">edit_calendar</span>
              </button>
            </div>

            {/* Odometer Row */}
            <div className="bg-[#2a2a29] rounded-lg p-2.5 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 flex-1">
                  <div className="w-8 h-8 rounded bg-[#1b1c1b] flex items-center justify-center text-[#ffbb13]">
                    <span className="material-symbols-outlined text-[20px]">speed</span>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-[#8e9192] uppercase font-semibold">
                      Odometer Reading
                    </label>
                    <div className="flex items-baseline gap-1">
                      <input
                        className="bg-transparent text-[18px] text-[#e4e2e0] font-bold focus:outline-none w-32 font-mono"
                        type="number"
                        value={odometer}
                        onChange={(e) => setOdometer(Number(e.target.value))}
                      />
                      <span className="text-[12px] text-[#8e9192] font-mono">km</span>
                    </div>
                  </div>
                </div>

                <div className="px-2 py-1 rounded bg-[#1b1c1b] text-right">
                  <span className="block text-[9px] text-[#8e9192] leading-none uppercase font-semibold">
                    Last Logged
                  </span>
                  <span className="text-[11px] text-[#c7c6c6] font-mono">
                    {vehicle.lastServiceOdo.toLocaleString('en-IN')} km
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-1 px-1 text-[#8e9192] text-[11px]">
                <span className="material-symbols-outlined text-[14px] text-[#ffbb13]">info</span>
                <span>
                  Delta:{' '}
                  <span className="font-semibold text-[#ffbb13] font-mono">
                    +{deltaKm} km
                  </span>{' '}
                  since last major inspection
                </span>
              </div>
            </div>

            {/* Component Selector Row */}
            <div className="bg-[#2a2a29] rounded-lg p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#1b1c1b] flex items-center justify-center text-[#ffbb13]">
                  <span className="material-symbols-outlined text-[20px]">
                    {selectedComp?.icon || 'oil_barrel'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#8e9192] uppercase font-semibold">
                    Service Target
                  </span>
                  <select
                    value={targetComponent}
                    onChange={(e) => setTargetComponent(e.target.value)}
                    className="bg-transparent text-[14px] text-[#e4e2e0] font-semibold focus:outline-none cursor-pointer"
                  >
                    {vehicle.components.map((c) => (
                      <option key={c.id} value={c.name} className="bg-[#1f201f] text-[#e4e2e0]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <span className="text-[10px] px-2 py-1 rounded bg-[#ffbb13] text-[#131313] font-bold uppercase tracking-wider">
                Critical
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 2: WORK PERFORMED */}
        <section className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase tracking-wider text-[#8e9192] font-bold">
              Action Performed
            </span>
            <span className="text-[10px] text-[#8e9192] font-mono">1 Selected</span>
          </div>

          <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-2.5">
            <div className="flex flex-wrap gap-2">
              {actionPills.map((action) => {
                const isActive = actionPerformed === action;
                return (
                  <button
                    key={action}
                    type="button"
                    onClick={() => setActionPerformed(action)}
                    className={`px-3 py-1.5 rounded-full text-[12px] transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#ffbb13] text-[#131313] font-bold shadow-sm'
                        : 'bg-[#2a2a29] text-[#8e9192] hover:text-[#e4e2e0]'
                    }`}
                  >
                    {action}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 3: PARTS & SPECIFICATIONS */}
        <section className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase tracking-wider text-[#8e9192] font-bold">
              Parts &amp; Specs Telemetry
            </span>
            <span className="text-[10px] text-[#8e9192]">JASO MA2 OEM Spec</span>
          </div>

          <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-2.5 flex flex-col gap-2">
            {/* 2-col Brand & Viscosity Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#2a2a29] rounded-lg p-2.5">
                <label className="block text-[10px] text-[#8e9192] uppercase font-semibold">
                  Oil Brand
                </label>
                <input
                  className="w-full bg-transparent text-[14px] text-[#e4e2e0] font-semibold focus:outline-none mt-0.5"
                  type="text"
                  value={oilBrand}
                  onChange={(e) => setOilBrand(e.target.value)}
                />
              </div>
              <div className="bg-[#2a2a29] rounded-lg p-2.5">
                <label className="block text-[10px] text-[#8e9192] uppercase font-semibold">
                  Viscosity / Grade
                </label>
                <input
                  className="w-full bg-transparent text-[14px] text-[#e4e2e0] font-semibold focus:outline-none mt-0.5 truncate"
                  type="text"
                  value={viscosity}
                  onChange={(e) => setViscosity(e.target.value)}
                />
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="bg-[#2a2a29] rounded-lg p-2.5 flex items-center justify-between">
              <div>
                <label className="block text-[10px] text-[#8e9192] uppercase font-semibold">
                  Fluid Quantity
                </label>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-[18px] font-bold text-[#e4e2e0] font-mono">
                    {fluidQty.toFixed(1)}
                  </span>
                  <span className="text-[11px] text-[#8e9192] font-mono">Litres</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-[#1b1c1b] p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => handleAdjustQty(-0.1)}
                  className="w-7 h-7 rounded bg-[#2a2a29] flex items-center justify-center text-[#e4e2e0] hover:text-[#ffbb13] transition-colors active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">remove</span>
                </button>
                <span className="text-[10px] font-mono px-1 text-[#8e9192]">STEP 0.1</span>
                <button
                  type="button"
                  onClick={() => handleAdjustQty(0.1)}
                  className="w-7 h-7 rounded bg-[#2a2a29] flex items-center justify-center text-[#e4e2e0] hover:text-[#ffbb13] transition-colors active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
            </div>

            {/* Auxiliary Switches */}
            <div className="flex flex-col gap-1.5 pt-1">
              {/* Toggle 1: Oil Filter Changed */}
              <div className="flex items-center justify-between p-2.5 bg-[#2a2a29] rounded-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-[#1b1c1b] flex items-center justify-center text-[#ffbb13]">
                    <span className="material-symbols-outlined text-[18px]">filter_alt</span>
                  </div>
                  <div>
                    <span className="block text-[13px] text-[#e4e2e0] font-medium leading-none">
                      Oil Filter Changed
                    </span>
                    <span className="text-[10px] text-[#8e9192]">OEM Cartridge replaced</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFilterChanged(!filterChanged)}
                  className={`w-12 h-7 rounded-full p-0.5 transition-colors flex items-center cursor-pointer ${
                    filterChanged ? 'bg-[#ffbb13] justify-end' : 'bg-[#1b1c1b] justify-start'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full transition-transform ${
                      filterChanged ? 'bg-[#131313]' : 'bg-[#8e9192]'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Strainer Mesh Cleaned */}
              <div className="flex items-center justify-between p-2.5 bg-[#2a2a29] rounded-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-[#1b1c1b] flex items-center justify-center text-[#8e9192]">
                    <span className="material-symbols-outlined text-[18px]">cleaning_services</span>
                  </div>
                  <div>
                    <span className="block text-[13px] text-[#e4e2e0] font-medium leading-none">
                      Strainer Mesh Cleaned
                    </span>
                    <span className="text-[10px] text-[#8e9192]">Metal gauze flush performed</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStrainerCleaned(!strainerCleaned)}
                  className={`w-12 h-7 rounded-full p-0.5 transition-colors flex items-center cursor-pointer ${
                    strainerCleaned ? 'bg-[#ffbb13] justify-end' : 'bg-[#1b1c1b] justify-start'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full transition-transform ${
                      strainerCleaned ? 'bg-[#131313]' : 'bg-[#8e9192]'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: LEDGER & FINANCIALS */}
        <section className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase tracking-wider text-[#8e9192] font-bold">
              Ledger &amp; Financials
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#8e9192]">DIY Mode</span>
              <button
                type="button"
                onClick={() => setIsDiy(!isDiy)}
                className={`w-8 h-4 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
                  isDiy ? 'bg-[#ffbb13] justify-end' : 'bg-[#2a2a29] justify-start'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    isDiy ? 'bg-[#131313]' : 'bg-[#8e9192]'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-2.5 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#2a2a29] rounded-lg p-2.5">
                <label className="block text-[10px] text-[#8e9192] uppercase font-semibold">
                  Parts / Consumables
                </label>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-[12px] text-[#ffbb13]">₹</span>
                  <input
                    className="w-full bg-transparent text-[16px] text-[#e4e2e0] font-bold focus:outline-none font-mono"
                    type="number"
                    value={partsCost}
                    onChange={(e) => setPartsCost(Number(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="bg-[#2a2a29] rounded-lg p-2.5">
                <label className="block text-[10px] text-[#8e9192] uppercase font-semibold">
                  Labour / Bay Fee
                </label>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-[12px] text-[#ffbb13]">₹</span>
                  <input
                    disabled={isDiy}
                    className={`w-full bg-transparent text-[16px] font-bold focus:outline-none font-mono ${
                      isDiy ? 'text-[#8e9192]' : 'text-[#e4e2e0]'
                    }`}
                    type="number"
                    value={isDiy ? 0 : labourCost}
                    onChange={(e) => setLabourCost(Number(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            {/* Calculated Summary Banner */}
            <div className="bg-[#171818] rounded-lg p-2.5 flex items-center justify-between border border-[#2a2a29]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffbb13] text-[20px]">
                  receipt_long
                </span>
                <span className="text-[12px] text-[#c4c7c7] font-medium">
                  Net Maintenance Cost
                </span>
              </div>
              <div className="flex items-baseline gap-0.5 font-mono">
                <span className="text-[13px] text-[#ffbb13] font-bold">₹</span>
                <span className="text-[20px] text-[#ffbb13] font-bold tracking-tight">
                  {netTotalCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: SERVICE NOTES & LOGS */}
        <section className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase tracking-wider text-[#8e9192] font-bold">
              Service Notes &amp; Logs
            </span>
            <span className="text-[10px] text-[#8e9192] font-mono">Torque verified</span>
          </div>

          <div className="bg-[#1f201f] border border-[#2a2a29] rounded-xl p-2.5 flex flex-col gap-2">
            <div className="bg-[#2a2a29] rounded-lg p-2.5">
              <textarea
                className="w-full bg-transparent text-[13px] text-[#e4e2e0] placeholder-[#8e9192] focus:outline-none resize-none leading-relaxed"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add technical notes, torque values, or observations..."
              />
            </div>

            {/* Image attachment strip */}
            <div>
              <span className="block text-[10px] text-[#8e9192] uppercase font-semibold mb-2">
                Attachments &amp; Receipts ({attachments.length})
              </span>
              <div className="grid grid-cols-3 gap-2">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="relative aspect-square rounded-lg overflow-hidden bg-[#2a2a29] group border border-[#353534]"
                  >
                    <img
                      src={att.url}
                      alt={att.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 left-1 bg-[#0e0e0e]/80 px-1.5 py-0.5 rounded text-[10px] text-[#e4e2e0] font-medium">
                      {att.label || 'Photo'}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#0e0e0e]/90 flex items-center justify-center text-[#e4e2e0] hover:text-[#ffb4ab] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[13px]">close</span>
                    </button>
                  </div>
                ))}

                {/* Add Attachment Tile */}
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="aspect-square rounded-lg bg-[#2a2a29] hover:bg-[#353534] border border-dashed border-[#444748] flex flex-col items-center justify-center gap-1 text-[#8e9192] hover:text-[#ffbb13] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[24px]">add_a_photo</span>
                  <span className="text-[10px] font-medium">Add Photo</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Master Action CTA */}
        <div className="pt-2 flex flex-col gap-1.5">
          <button
            type="submit"
            disabled={isSaving}
            className={`w-full h-12 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-lg ${
              savedSuccess
                ? 'bg-[#4ade80] text-[#131313]'
                : 'bg-[#ffbb13] text-[#131313] hover:brightness-105'
            }`}
          >
            {isSaving ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                <span>Committed to Ledger...</span>
              </>
            ) : savedSuccess ? (
              <>
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>Record Logged Successfully!</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">save</span>
                <span>Save Maintenance Record</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 py-1 text-[#8e9192] text-[11px]">
            <span className="material-symbols-outlined text-[14px]">history_edu</span>
            <span>Will reset {targetComponent} wear gauge to 100% capacity</span>
          </div>
        </div>
      </form>
    </div>
  );
};
