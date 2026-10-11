import React from 'react';

interface AttachmentModalProps {
  url: string | null;
  name: string;
  onClose: () => void;
}

export const AttachmentModal: React.FC<AttachmentModalProps> = ({ url, name, onClose }) => {
  if (!url) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0e0e0e]/95 backdrop-blur-md flex flex-col justify-between p-4">
      {/* Top bar */}
      <div className="flex items-center justify-between text-[#e4e2e0]">
        <div className="flex flex-col min-w-0 pr-4">
          <span className="text-[10px] text-[#8e9192] uppercase font-semibold">
            Attached Document
          </span>
          <h3 className="text-[15px] font-bold truncate">{name}</h3>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-[#2a2a29] flex items-center justify-center text-[#e4e2e0] hover:text-[#ffbb13] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Main Image View */}
      <div className="flex-1 flex items-center justify-center py-4 overflow-hidden">
        <img
          src={url}
          alt={name}
          className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl border border-[#2a2a29]"
        />
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between pt-2 border-t border-[#2a2a29]">
        <span className="text-[11px] text-[#8e9192]">Verified Proof &amp; Ledger Attachment</span>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-[#ffbb13] text-[#131313] text-[12px] font-bold rounded-lg flex items-center gap-1 hover:brightness-105 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          <span>Open Full View</span>
        </a>
      </div>
    </div>
  );
};
