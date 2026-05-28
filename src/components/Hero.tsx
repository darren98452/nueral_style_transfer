import React from 'react';
import { Sparkles, Brain, Cpu, Image as ImageIcon } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-[#08090f] pt-10 pb-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[11px] text-slate-400 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>NEURAL RENDER ENGINE</span>
        </div>

        <h1 className="font-sans font-extrabold text-2xl sm:text-3xl tracking-tight text-white leading-tight">
          Neural Style Transfer on Raspberry Pi
        </h1>

        <p className="max-w-xl mx-auto text-slate-400 text-xs sm:text-sm leading-relaxed">
          Blends style reference textures with content layouts using optimization loops. 
          Upload assets or use standard presets to begin rendering.
        </p>

        {/* Dynamic Architectural Formula Representation */}
        <div className="grid grid-cols-7 items-center max-w-md mx-auto bg-slate-900/45 p-3 rounded-xl border border-slate-800 text-slate-400 text-[10px] sm:text-xs">
          <div className="space-y-1">
            <div className="mx-auto w-7 h-7 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400">
              <ImageIcon className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono text-[10px] text-slate-500">Content</span>
          </div>
          
          <div className="font-sans text-xs text-slate-600">+</div>

          <div className="space-y-1">
            <div className="mx-auto w-7 h-7 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <span className="font-mono text-[10px] text-slate-500">Style</span>
          </div>

          <div className="font-sans text-xs text-slate-600">=</div>

          <div className="space-y-1">
            <div className="mx-auto w-7 h-7 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400">
              <Brain className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono text-[10px] text-slate-500">Model</span>
          </div>

          <div className="font-sans text-xs text-slate-600">→</div>

          <div className="space-y-1">
            <div className="mx-auto w-7 h-7 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono text-emerald-300 font-medium text-[9px]">Output</span>
          </div>
        </div>
      </div>
    </div>
  );
}

