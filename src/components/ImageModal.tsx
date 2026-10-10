import React from 'react';
import { X, ZoomIn, Download } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  subtitle?: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  subtitle,
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-900 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-700/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 bg-slate-800/80 border-b border-slate-700 text-white">
          <div className="flex items-center gap-2">
            <ZoomIn className="w-4 h-4 text-blue-400" />
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-100">{title}</h3>
              {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              download="ranot-inspection-evidence.jpg"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
              title="ดาวน์โหลดรูปภาพ"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Image Body */}
        <div className="p-2 sm:p-4 flex items-center justify-center bg-slate-950 min-h-[300px] max-h-[75vh] overflow-auto">
          <img
            src={imageUrl}
            alt="หลักฐานการตรวจเขต"
            className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain shadow-md"
          />
        </div>
      </div>
    </div>
  );
};
