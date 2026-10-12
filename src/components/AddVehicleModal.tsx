import React, { useState } from 'react';
import { Vehicle, ServiceRecord, ComponentItem } from '../types';
import { createDefaultMotorcycleComponents } from '../data';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newVehicle: Vehicle) => void;
}

interface UploadedDoc {
  name: string;
  data: string;
  mimeType: string;
  type: 'records' | 'manual';
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [year, setYear] = useState(2024);
  const [displacement, setDisplacement] = useState('390 cc');
  const [category, setCategory] = useState('Adventure Touring');
  const [odometer, setOdometer] = useState(1500);
  const [photoUrl, setPhotoUrl] = useState('');

  // AI Document Analysis States
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [notesContext, setNotesContext] = useState('');
  const [isAnalyzingDocs, setIsAnalyzingDocs] = useState(false);
  const [analysisSuccessMsg, setAnalysisSuccessMsg] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [extractedHistory, setExtractedHistory] = useState<ServiceRecord[] | null>(null);
  const [extractedComponents, setExtractedComponents] = useState<ComponentItem[] | null>(null);
  const [extractedTotalSpend, setExtractedTotalSpend] = useState<number | null>(null);

  if (!isOpen) return null;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadDoc = (e: React.ChangeEvent<HTMLInputElement>, docType: 'records' | 'manual') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setUploadedDocs((prev) => [
          ...prev,
          {
            name: file.name,
            data: base64,
            mimeType: file.type || 'image/jpeg',
            type: docType,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveDoc = (index: number) => {
    setUploadedDocs((prev) => prev.filter((_, i) => i !== index));
  };

  // Sample data quick test for KTM 390 Adventure
  const handleLoadSampleKTM = () => {
    setNotesContext(
      'KTM 390 Adventure 2024. Factory Manual intervals: Engine oil Motul 7100 10W-50 every 7,500 km or 12 mo (Capacity 1.7L). Spark plug every 15,000 km. Valve clearance check every 15,000 km. Chain clean every 500 km.\n\nPrevious service records:\n- 1st Free Run-in Service on 20 May 2024 at 1,005 km: Motul 10W-50 replaced, oil filter replaced, screen clean. Parts: ₹1,450, Labour: ₹0. (Authorized KTM Service)\n- Intermediate Oil Change on 15 Dec 2024 at 4,820 km: Motul 7100 10W-50 oil change, chain slack adjusted to 25mm. Parts: ₹1,550, Labour: ₹350. (DIY & Workshop)\n- Pre-ride Checkup on 10 Aug 2025 at 6,400 km: Front & rear brake pads inspected, brake fluid checked. Parts: ₹200, Labour: ₹150.\nCurrent Odo: 6,850 km.'
    );
  };

  // Run Gemini analysis on the uploaded documents and manuals
  const handleAnalyzeWithGemini = async () => {
    setIsAnalyzingDocs(true);
    setAnalysisError(null);
    setAnalysisSuccessMsg(null);

    try {
      const payload = {
        documents: uploadedDocs.map((d) => ({
          data: d.data,
          mimeType: d.mimeType,
          name: d.name,
        })),
        recordsText: notesContext,
        manualText: notesContext,
        vehicleHint: name || 'Motorcycle service records and owner manual',
      };

      const res = await fetch('/api/gemini/parse-vehicle-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        if (d.name) setName(d.name);
        if (d.shortName) setShortName(d.shortName);
        if (d.year) setYear(Number(d.year));
        if (d.displacement) setDisplacement(d.displacement);
        if (d.category) setCategory(d.category);
        if (d.odometer) setOdometer(Number(d.odometer));

        if (d.serviceHistory && Array.isArray(d.serviceHistory)) {
          setExtractedHistory(d.serviceHistory);
        }
        if (d.components && Array.isArray(d.components)) {
          setExtractedComponents(d.components);
        }
        if (d.totalSpend) {
          setExtractedTotalSpend(Number(d.totalSpend));
        }

        setAnalysisSuccessMsg(
          `✓ Gemini successfully analyzed documents! Extracted ${d.name || 'model'}, ${d.serviceHistory?.length || 0} historical service records, and calibrated ${d.components?.length || 0} maintenance components.`
        );
      } else {
        throw new Error(json.error || 'Failed to analyze documents with Gemini.');
      }
    } catch (err: any) {
      setAnalysisError(err?.message || 'Error communicating with Gemini.');
    } finally {
      setIsAnalyzingDocs(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = `bike-${Date.now()}`;

    // Components list: use extracted or full factory roster
    const isLiquid =
      category.toLowerCase().includes('liquid') ||
      displacement.includes('390') ||
      displacement.includes('450');

    const defaultRoster = createDefaultMotorcycleComponents(id, name, odometer, isLiquid);

    const finalComponents: ComponentItem[] =
      extractedComponents && extractedComponents.length > 0
        ? extractedComponents.map((c, i) => ({
            ...c,
            id: `${c.id || 'comp'}-${id}-${i}`,
            category: (c.category as any) || 'Engine',
            status: (c.status as any) || 'healthy',
          }))
        : defaultRoster;

    // Service history: use extracted or default
    const finalHistory: ServiceRecord[] = extractedHistory && extractedHistory.length > 0
      ? extractedHistory.map((h, i) => ({
          ...h,
          id: `log-${id}-${i}`,
          vehicleId: id,
          action: (h.action as any) || 'Replaced',
        }))
      : [
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
        ];

    const healthyCount = finalComponents.filter((c) => c.status === 'healthy').length;
    const dueSoonCount = finalComponents.filter((c) => c.status === 'due_soon').length;
    const actionReqCount = finalComponents.filter((c) => c.status === 'action_req').length;
    const healthPercent = finalComponents.length ? Math.round((healthyCount / finalComponents.length) * 100) : 90;

    const totalSpend = extractedTotalSpend || finalHistory.reduce((sum, h) => sum + (h.partsCost || 0) + (h.labourCost || 0), 0);
    const lastServiceOdo = finalHistory.length ? Math.max(...finalHistory.map((h) => h.odometer)) : Math.max(0, odometer - 500);
    const lastServiceDate = finalHistory[0]?.date || '01 Oct 2026';

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
      lastServiceDate,
      lastServiceOdo,
      totalSpend,
      serviceCount: finalHistory.length,
      nextDueKm: 4500,
      nextDueDays: 90,
      nextMilestoneKm: odometer + 4500,
      healthPercent,
      monitoredPartsCount: finalComponents.length,
      healthyCount,
      dueSoonCount,
      actionReqCount,
      photoUrl: photoUrl || undefined,
      components: finalComponents,
      serviceHistory: finalHistory,
    };

    onAdd(newV);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0e0e0e]/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1f201f] border border-[#2a2a29] rounded-2xl w-full max-w-md p-4 flex flex-col gap-3.5 shadow-2xl my-auto max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#2a2a29]">
          <div>
            <h3 className="text-[16px] font-bold text-[#e4e2e0]">Add Motorcycle to Garage</h3>
            <span className="text-[11px] text-[#8e9192]">AI-Assisted Fleet Setup</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#8e9192] hover:text-[#e4e2e0] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* AI AUTO-SETUP BANNER: Upload Previous Service Records & User Manual */}
        <div className="bg-gradient-to-br from-[#1b1c1b] via-[#202122] to-[#272829] border border-[#ffbb13]/30 rounded-xl p-3 flex flex-col gap-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#ffbb13] flex items-center justify-center text-[#131313] font-bold shrink-0">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-[#e4e2e0] flex items-center gap-1.5">
                  Import Past Records &amp; Manual
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#ffbb13]/20 text-[#ffbb13] uppercase font-mono font-semibold">
                    Gemini AI
                  </span>
                </h4>
                <p className="text-[10px] text-[#8e9192]">
                  Upload old workshop bills or user manual to auto-reconstruct history &amp; wear
                </p>
              </div>
            </div>
          </div>

          {/* Upload Buttons for Records and Manual */}
          <div className="grid grid-cols-2 gap-2">
            <label className="py-2 px-2.5 rounded-lg bg-[#2a2a29] hover:bg-[#353534] border border-[#353534] flex items-center justify-center gap-1.5 text-[11px] text-[#e4e2e0] font-medium cursor-pointer transition-colors text-center">
              <span className="material-symbols-outlined text-[16px] text-[#ffbb13]">receipt_long</span>
              <span>Past Bills / Records</span>
              <input
                type="file"
                multiple
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => handleUploadDoc(e, 'records')}
              />
            </label>

            <label className="py-2 px-2.5 rounded-lg bg-[#2a2a29] hover:bg-[#353534] border border-[#353534] flex items-center justify-center gap-1.5 text-[11px] text-[#e4e2e0] font-medium cursor-pointer transition-colors text-center">
              <span className="material-symbols-outlined text-[16px] text-[#ffbb13]">menu_book</span>
              <span>User Manual Excerpt</span>
              <input
                type="file"
                multiple
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => handleUploadDoc(e, 'manual')}
              />
            </label>
          </div>

          {/* Uploaded files chips */}
          {uploadedDocs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {uploadedDocs.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#171818] border border-[#2a2a29] text-[10px] text-[#c4c7c7]"
                >
                  <span className="material-symbols-outlined text-[12px] text-[#ffbb13]">
                    {doc.type === 'records' ? 'receipt' : 'menu_book'}
                  </span>
                  <span className="max-w-[120px] truncate">{doc.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(i)}
                    className="text-[#8e9192] hover:text-[#ffb4ab]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Textarea for pasting records transcript or manual notes */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] uppercase font-semibold text-[#8e9192]">
                Or Paste Records Transcript / Service Table
              </label>
              <button
                type="button"
                onClick={handleLoadSampleKTM}
                className="text-[10px] text-[#ffbb13] hover:underline cursor-pointer"
              >
                Try Sample KTM 390 Records
              </button>
            </div>
            <textarea
              rows={2}
              value={notesContext}
              onChange={(e) => setNotesContext(e.target.value)}
              placeholder="e.g. Past service invoices, warranty stamps, or manual oil interval..."
              className="w-full bg-[#1b1c1b] border border-[#353534] rounded-lg p-2 text-[11px] text-[#e4e2e0] placeholder-[#8e9192] focus:outline-none focus:border-[#ffbb13] resize-none"
            />
          </div>

          {/* AI Trigger Action */}
          <button
            type="button"
            disabled={isAnalyzingDocs || (uploadedDocs.length === 0 && !notesContext.trim())}
            onClick={handleAnalyzeWithGemini}
            className={`w-full py-2 px-3 rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isAnalyzingDocs || (uploadedDocs.length === 0 && !notesContext.trim())
                ? 'bg-[#2a2a29] text-[#8e9192] cursor-not-allowed'
                : 'bg-[#ffbb13] text-[#131313] hover:brightness-105 active:scale-[0.99] shadow-md'
            }`}
          >
            {isAnalyzingDocs ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                <span>Gemini is reading records &amp; manual...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                <span>Analyze &amp; Auto-Populate with Gemini</span>
              </>
            )}
          </button>

          {/* Success Banner */}
          {analysisSuccessMsg && (
            <div className="p-2 rounded-lg bg-[#142017] border border-[#4ade80]/40 text-[#4ade80] text-[11px] flex items-start gap-1.5">
              <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">check_circle</span>
              <span className="leading-snug">{analysisSuccessMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {analysisError && (
            <div className="p-2 rounded-lg bg-[#251516] border border-[#ffb4ab]/40 text-[#ffb4ab] text-[11px] flex items-start gap-1.5">
              <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
              <span className="leading-snug">{analysisError}</span>
            </div>
          )}
        </div>

        {/* Form Fields (Auto-populated or Manual) */}
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
                className="w-full bg-[#2a2a29] border border-[#353534] rounded-lg px-3 py-2 text-[#e4e2e0] focus:outline-none focus:border-[#ffbb13] font-mono"
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
                  onChange={handlePhotoChange}
                />
              </label>
              {photoUrl && (
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#ffbb13]">
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Reconstructed records preview if Gemini extracted */}
          {extractedHistory && extractedHistory.length > 0 && (
            <div className="bg-[#171818] border border-[#2a2a29] rounded-xl p-2.5 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#ffbb13] font-semibold">
                  Reconstructed History ({extractedHistory.length} logs)
                </span>
                <span className="text-[#8e9192] font-mono">
                  Total Spend: ₹{(extractedTotalSpend || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="max-h-24 overflow-y-auto no-scrollbar space-y-1">
                {extractedHistory.map((h, idx) => (
                  <div key={idx} className="flex justify-between text-[10px] text-[#c4c7c7] border-b border-[#242526] pb-0.5">
                    <span className="truncate max-w-[180px]">{h.date} · {h.title}</span>
                    <span className="font-mono text-[#ffbb13]">₹{(h.partsCost || 0) + (h.labourCost || 0)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#2a2a29]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-[#8e9192] hover:text-[#e4e2e0] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#ffbb13] text-[#131313] font-bold rounded-lg cursor-pointer hover:brightness-105 shadow-md active:scale-[0.98]"
            >
              Confirm &amp; Add Motorcycle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
