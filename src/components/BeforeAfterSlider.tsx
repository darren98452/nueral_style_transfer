import React, { useState, useRef, useEffect } from 'react';
import { Download, StretchHorizontal, SquareArrowOutUpRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  contentImage: string;
  resultImage: string;
  styleName: string;
  timestamp: string;
}

export default function BeforeAfterSlider({
  contentImage,
  resultImage,
  styleName,
  timestamp,
}: BeforeAfterSliderProps) {
  const [sliderIndex, setSliderIndex] = useState(50); // percentage (0 - 100)
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Handle pointer updates (mouse & touch)
  const handleUpdate = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderIndex(percentage);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    handleUpdate(e.clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    handleUpdate(e.clientX);
  };

  // Touch triggers for mobile optimization
  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      handleUpdate(e.touches[0].clientX);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    const touchMoveHandler = (event: TouchEvent) => handleTouchMove(event);
    const touchEndHandler = () => {
      document.removeEventListener('touchmove', touchMoveHandler);
      document.removeEventListener('touchend', touchEndHandler);
    };
    
    document.addEventListener('touchmove', touchMoveHandler, { passive: true });
    document.addEventListener('touchend', touchEndHandler);
  };

  // Safe manual slider download
  const downloadResult = () => {
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `pistyle_${styleName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#0f111a]/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 animate-fade-in">
      {/* Label and Actions bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-slate-800/60 pb-3 gap-3">
        <div>
          <span className="text-[11px] text-cyan-400 font-mono tracking-wider font-semibold uppercase">Reconstruction Output</span>
          <h3 className="text-white font-sans font-bold text-lg leading-snug">
            Stylized Masterpiece
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Applied preset: <span className="text-purple-400">{styleName}</span> • Generated {timestamp}
          </p>
        </div>

        <button
          id="down-result-btn"
          onClick={downloadResult}
          className="flex items-center space-x-1.5 px-4.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 font-mono text-xs font-semibold text-white shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/20 active:scale-[0.98] transition cursor-pointer md:w-auto w-full justify-center"
        >
          <Download className="w-4 h-4" />
          <span>Save Artwork JPG</span>
        </button>
      </div>

      {/* Frame Comparison Canvas Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative h-96 w-full select-none rounded-xl overflow-hidden border border-slate-800 bg-slate-950 cursor-ew-resize flex items-center justify-center shadow-2xl"
      >
        {/* Underlay / Background block: Content Original */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950 p-2">
          <img
            src={contentImage}
            alt="Original input"
            className="max-w-full max-h-full object-contain pointer-events-none select-none"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Overlay block: Stylized Result clipped accordingly */}
        <div
          className="absolute inset-0 flex items-center justify-center bg-slate-950 p-2 overflow-hidden"
          style={{ width: `${sliderIndex}%` }}
        >
          {/* Prevent scaling stretching by mapping full dimension relative to parent width */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center p-2">
            <img
              src={resultImage}
              alt="Stylized output"
              className="max-w-full max-h-full object-contain pointer-events-none select-none"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Sliding scrubber control line */}
        <div
          className="absolute top-0 bottom-0 w-[3px] bg-cyan-400 cursor-ew-resize pointer-events-none flex items-center justify-center"
          style={{ left: `${sliderIndex}%` }}
        >
          {/* Draggable button tag knob */}
          <div className="p-2.5 bg-cyan-500 hover:bg-cyan-400 rounded-full text-slate-950 shadow-md transform -translate-x-1/2 flex items-center justify-center shrink-0 border-2 border-slate-950">
            <StretchHorizontal className="w-3.5 h-3.5 font-bold" />
          </div>
        </div>

        {/* Corner descriptive overlays for context help */}
        <div className="absolute bottom-3 left-3 px-2 py-1 bg-slate-950/85 backdrop-blur-sm rounded border border-slate-800 text-[10px] text-slate-400 font-mono uppercase tracking-wider pointer-events-none">
          Before
        </div>

        <div className="absolute bottom-3 right-3 px-2 py-1 bg-slate-950/85 backdrop-blur-sm rounded border border-slate-800 text-[10px] text-cyan-300 font-mono uppercase tracking-wider pointer-events-none">
          Stylized
        </div>
      </div>

      {/* Guide text */}
      <p className="text-center text-[11px] text-slate-500 font-mono select-none">
        ← Drag the central blue bar left and right to inspect feature reconstruction →
      </p>
    </div>
  );
}
