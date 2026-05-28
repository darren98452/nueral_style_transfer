import React from 'react';
import { Download, Trash2, Calendar, HardDrive, Eye } from 'lucide-react';
import { GenerationHistory } from '../types';

interface HistoryGalleryProps {
  history: GenerationHistory[];
  onDeleteHistory: (id: string) => void;
  onSelectFromHistory: (item: GenerationHistory) => void;
}

export default function HistoryGallery({
  history,
  onDeleteHistory,
  onSelectFromHistory,
}: HistoryGalleryProps) {
  if (history.length === 0) {
    return (
      <div className="bg-[#0f111a]/50 border border-slate-900 rounded-2xl p-8 py-10 text-center space-y-3">
        <div className="mx-auto w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/20 flex items-center justify-center text-slate-500">
          <HardDrive className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-slate-300 text-sm font-sans font-medium">No stylized history found</p>
          <p className="text-slate-500 text-[11px] font-mono leading-relaxed max-w-sm mx-auto">
            Artwork synthesized using the simulator or the physical Raspberry Pi Flask backend will persist in your local history array.
          </p>
        </div>
      </div>
    );
  }

  // Helper inside loop for download link
  const triggerDownload = (item: GenerationHistory, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = item.resultImage;
    link.download = `pistyle_saved_${item.styleName.toLowerCase().replace(/\s+/g, '_')}_${item.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Label and Count */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
        <div>
          <h3 className="font-sans font-bold text-white text-base">Generation Canvas History</h3>
          <p className="text-[10px] text-slate-400 font-mono">Captured outputs stored on device sandbox</p>
        </div>
        <span className="text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 px-2 py-0.5 rounded-full uppercase tracking-wider">
          {history.length} {history.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Grid of history cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {history.map((item) => {
          return (
            <div
              id={`history-card-${item.id}`}
              key={item.id}
              onClick={() => onSelectFromHistory(item)}
              className="group cursor-pointer bg-[#0f111a]/80 hover:bg-[#121522] border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden shadow-md hover:shadow-cyan-500/5 transition duration-300 flex flex-col justify-between"
            >
              {/* Image Frame */}
              <div className="relative h-44 bg-slate-950 flex items-center justify-center overflow-hidden">
                {/* Lazy rendered content preview */}
                <img
                  src={item.resultImage}
                  alt={item.styleName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102 select-none"
                  referrerPolicy="no-referrer"
                />

                {/* Overlapped layout indicators */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Quick actions popup overlay */}
                <div className="absolute inset-0 flex items-center justify-center space-x-2.5 opacity-0 group-hover:opacity-100 bg-[#060810]/45 backdrop-blur-xs transition duration-300">
                  <span className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-medium shadow-md transition-all active:scale-95">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View comparison</span>
                  </span>
                </div>

                {/* Small overlay style pill */}
                <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded px-2 py-0.5 text-[9px] font-mono text-purple-300 shadow">
                  {item.styleName}
                </span>

                {/* Strengths indicator badge */}
                <span className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded px-1.5 py-0.5 text-[9px] font-mono text-pink-300 shadow">
                  Str: {item.strength}%
                </span>
              </div>

              {/* Description Body */}
              <div className="p-3.5 space-y-2.5 bg-slate-900/40">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-500 mr-0.5" />
                      <span>{item.timestamp}</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Res: <span className="text-slate-400">{item.resolution}</span>
                    </p>
                  </div>
                </div>

                {/* Controls bar */}
                <div className="flex gap-2 border-t border-slate-800/60 pt-2.5">
                  <button
                    id={`down-history-${item.id}-btn`}
                    onClick={(e) => triggerDownload(item, e)}
                    className="flex-1 flex items-center justify-center space-x-1 py-1 px-2 text-[10px] font-mono text-slate-300 bg-slate-800/40 hover:bg-slate-800 rounded border border-slate-700/60 transition"
                    title="Download high-resolution master copy"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                  <button
                    id={`del-history-${item.id}-btn`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteHistory(item.id);
                    }}
                    className="p-1 px-2.5 text-[10px] font-mono text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 rounded border border-red-950/30 hover:border-red-900/30 transition flex items-center justify-center"
                    title="Remove item from historical browser storage"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
