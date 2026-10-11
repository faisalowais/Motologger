import React, { useState } from 'react';

interface UploadBikePhotoModalProps {
  isOpen: boolean;
  bikeName: string;
  currentPhotoUrl?: string;
  onClose: () => void;
  onSavePhoto: (photoUrl?: string) => void;
}

export const UploadBikePhotoModal: React.FC<UploadBikePhotoModalProps> = ({
  isOpen,
  bikeName,
  currentPhotoUrl,
  onClose,
  onSavePhoto,
}) => {
  const [photoUrl, setPhotoUrl] = useState(currentPhotoUrl || '');
  const [previewUrl, setPreviewUrl] = useState(currentPhotoUrl || '');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPhotoUrl(url);
    }
  };

  const samplePresets = [
    {
      name: 'XPulse Stealth Matte Black',
      url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'Adventure Dual Sport Cockpit',
      url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'Rally Track Dirt Profile',
      url: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  const handleSave = () => {
    onSavePhoto(photoUrl || undefined);
    onClose();
  };

  const handleResetToSilhouette = () => {
    onSavePhoto(undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0e0e0e]/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1f201f] border border-[#2a2a29] rounded-2xl w-full max-w-sm p-4 flex flex-col gap-3.5 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-[#2a2a29]">
          <div>
            <h3 className="text-[15px] font-bold text-[#e4e2e0]">Motorcycle Picture</h3>
            <span className="text-[11px] text-[#8e9192] truncate block">{bikeName}</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#8e9192] hover:text-[#e4e2e0] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Preview box */}
        <div className="relative aspect-[16/9] w-full rounded-xl bg-[#141516] border border-[#2a2a29] overflow-hidden flex items-center justify-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Motorcycle Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-[#8e9192]">
              <span className="material-symbols-outlined text-[32px]">two_wheeler</span>
              <span className="text-[11px]">Using Technical Vector Silhouette</span>
            </div>
          )}
        </div>

        {/* Upload File button */}
        <div>
          <label className="w-full py-2.5 px-3 rounded-xl bg-[#2a2a29] hover:bg-[#353534] border border-[#444748] flex items-center justify-center gap-2 text-[#e4e2e0] text-[12px] font-semibold cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-[18px] text-[#ffbb13]">upload_file</span>
            <span>Upload Picture from Device</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Image URL input */}
        <div>
          <label className="block text-[10px] uppercase font-semibold text-[#8e9192] mb-1">
            Or Paste Web Image URL
          </label>
          <input
            type="url"
            placeholder="https://..."
            value={photoUrl}
            onChange={(e) => {
              setPhotoUrl(e.target.value);
              setPreviewUrl(e.target.value);
            }}
            className="w-full bg-[#2a2a29] border border-[#353534] rounded-lg px-3 py-2 text-[12px] text-[#e4e2e0] focus:outline-none focus:border-[#ffbb13]"
          />
        </div>

        {/* Quick sample presets */}
        <div>
          <span className="block text-[10px] uppercase font-semibold text-[#8e9192] mb-1.5">
            Sample Garage Presets
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPhotoUrl(preset.url);
                  setPreviewUrl(preset.url);
                }}
                className="p-1 rounded-lg bg-[#2a2a29] hover:bg-[#353534] border border-[#353534] text-[10px] text-[#c4c7c7] truncate text-center cursor-pointer"
              >
                Preset {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-[#2a2a29]">
          <button
            type="button"
            onClick={handleResetToSilhouette}
            className="text-[11px] text-[#ffb4ab] hover:underline cursor-pointer"
          >
            Reset to Silhouette
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-[12px] text-[#8e9192] hover:text-[#e4e2e0] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 bg-[#ffbb13] text-[#131313] text-[12px] font-bold rounded-lg cursor-pointer hover:brightness-105"
            >
              Save Picture
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
