import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, Sparkles, RefreshCw, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { compressAndValidateImage } from '../utils/imageOptimizer';

interface SampleItem {
  id: string;
  name: string;
  artist?: string;
  url: string;
}

interface UploadCardProps {
  id: string;
  title: string;
  type: 'content' | 'style';
  image: string | null;
  onImageChanged: (base64: string | null) => void;
  samples: SampleItem[];
  maxSizeBytes: number;
}

export default function UploadCard({
  id,
  title,
  type,
  image,
  onImageChanged,
  samples,
  maxSizeBytes,
}: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [optimizerStats, setOptimizerStats] = useState<{ original: number; compressed: number } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when unmounting or switching states
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  const handleFile = async (file: File) => {
    try {
      setWebcamError(null);
      const result = await compressAndValidateImage(file, maxSizeBytes);
      onImageChanged(result.base64);
      setOptimizerStats({
        original: result.originalSize,
        compressed: result.compressedSize,
      });
    } catch (err: any) {
      setWebcamError(err?.message || 'Error processing image.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // Webcam stream handlers
  const startWebcam = async () => {
    setWebcamError(null);
    setIsWebcamActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setWebcamError('Unable to access device camera. Please grant permission.');
      setIsWebcamActive(false);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
  };

  const captureSnapshot = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(-1, 1); // Mirror snapshot to match user perspective
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onImageChanged(dataUrl);
        setOptimizerStats(null); // Snapshot has no compression ratio stats
        stopWebcam();
      }
    }
  };

  // Human clean stats sizes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = 1;
    const sizes = ['bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-[#0f111a]/80 backdrop-blur-md rounded-2xl p-5 border border-slate-800 flex flex-col space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
        <div>
          <h3 className="font-sans font-semibold text-white text-[15px] tracking-tight flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${type === 'content' ? 'bg-cyan-400' : 'bg-pink-400'}`} />
            <span>{title}</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-mono">
            {type === 'content' ? 'Source layout template' : 'Art direction reference'}
          </p>
        </div>

        {image && (
          <button
            id={`reset-${id}-image-btn`}
            onClick={() => {
              onImageChanged(null);
              setOptimizerStats(null);
              setWebcamError(null);
            }}
            className="flex items-center space-x-1 text-[11px] font-mono text-pink-400 hover:text-pink-300 bg-pink-500/10 px-2 py-1 rounded border border-pink-500/20 transition"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Main view frame */}
      <div className="relative">
        {/* Dynamic Drag State Overlay / Body Slot */}
        {!image && !isWebcamActive ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer group flex flex-col items-center justify-center border-2 border-dashed rounded-xl h-52 transition-all p-4 text-center ${
              isDragging
                ? 'border-cyan-400 bg-cyan-500/5 scale-[0.99]'
                : 'border-slate-800 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900/60'
            }`}
          >
            <input
              id={`${id}-upload-file-input`}
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="p-3 bg-slate-800/60 text-slate-400 group-hover:text-white rounded-xl mb-3 shadow-sm border border-slate-700/10 group-hover:scale-105 transition duration-300">
              <Upload className="w-5 h-5" />
            </div>

            <p className="text-xs text-white font-medium">
              Drag &amp; drop image here
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              or <span className="text-cyan-400 font-semibold underline">browse hardware files</span>
            </p>
            <span className="text-[9px] text-slate-500 mt-2 font-mono">
              JPEG, PNG, WEBP, GIF up to {(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB
            </span>
          </div>
        ) : null}

        {/* Live Camera Feed Screen */}
        {isWebcamActive && (
          <div className="relative bg-black rounded-xl overflow-hidden h-52 border border-slate-700/50">
            <video
              ref={videoRef}
              className="w-full h-full object-cover scale-x-[-1]"
              muted
              playsInline
            />
            
            {/* Capture controls panel */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2 px-4">
              <button
                id={`cancel-${id}-webcam-btn`}
                type="button"
                onClick={stopWebcam}
                className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-900 text-[11px] font-mono border border-slate-700 text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                id={`snap-${id}-snapshot-btn`}
                type="button"
                onClick={captureSnapshot}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-[11px] font-mono shadow-md hover:opacity-90 transition flex items-center space-x-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Snap Photo</span>
              </button>
            </div>
          </div>
        )}

        {/* Static Loaded Image Canvas Frame Preview */}
        {image && !isWebcamActive && (
          <div className="relative bg-slate-950 rounded-xl overflow-hidden h-52 border border-slate-850 flex items-center justify-center group/card shadow-inner">
            <img
              src={image}
              alt={title}
              className="max-w-full max-h-full object-contain select-none"
              referrerPolicy="no-referrer"
            />
            
            {/* Absolute visual overlay markers */}
            <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-md px-2 py-0.5 text-[10px] text-cyan-300 font-mono flex items-center space-x-1 shadow">
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>PREVIEW READY</span>
            </div>

            {/* Quick stats slider badge at base */}
            {optimizerStats && optimizerStats.compressed < optimizerStats.original && (
              <div className="absolute bottom-2 left-2 right-2 bg-slate-950/90 border border-slate-800/80 rounded-lg p-1.5 flex items-center justify-between text-[10px] font-mono text-slate-300 shadow">
                <span className="flex items-center text-emerald-400">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  <span>Compressed -{((1 - optimizerStats.compressed / optimizerStats.original) * 100).toFixed(0)}%</span>
                </span>
                <span className="text-slate-400">
                  {formatBytes(optimizerStats.compressed)} <span className="text-slate-600">/ {formatBytes(optimizerStats.original)}</span>
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Buttons/Selector bar under slot */}
      <div className="flex items-center justify-between gap-2">
        {/* Webcam Snap Trigger */}
        {!isWebcamActive && !image && (
          <button
            id={`trigger-${id}-webcam-btn`}
            type="button"
            onClick={startWebcam}
            className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition w-full"
          >
            <Camera className="w-3.5 h-3.5 text-slate-400" />
            <span>Use Webcam Device</span>
          </button>
        )}
      </div>

      {/* Errant handling callouts */}
      {webcamError && (
        <div className="p-2.5 bg-red-950/40 border border-red-900/30 rounded-xl text-red-300 text-[11px] font-sans flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{webcamError}</span>
        </div>
      )}

      {/* Try Curated Preset Samples */}
      <div className="space-y-2">
        <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>Try Curated Preset Samples:</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {samples.map((samp) => {
            const isSelected = image === samp.url;
            return (
              <button
                id={`sample-${id}-${samp.id}-btn`}
                key={samp.id}
                type="button"
                onClick={() => {
                  setWebcamError(null);
                  setOptimizerStats(null);
                  onImageChanged(samp.url);
                }}
                className={`group relative rounded-lg overflow-hidden border aspect-video bg-black flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-cyan-400 ring-2 ring-cyan-400/20 shadow-md scale-95'
                    : 'border-slate-800 hover:border-slate-700 scale-100 hover:scale-[1.02]'
                }`}
                title={samp.artist ? `${samp.name} (${samp.artist})` : samp.name}
              >
                <img
                  src={samp.url}
                  alt={samp.name}
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute inset-0 bg-black/40 transition opacity ${isSelected ? 'opacity-0' : 'group-hover:opacity-10'}`} />
                
                {/* Micro visual checkbox ticker */}
                {isSelected && (
                  <div className="absolute top-1 right-1 p-0.5 bg-cyan-500 rounded-full text-black">
                    <CheckCircle2 className="w-2.5 h-2.5 text-slate-950" />
                  </div>
                )}
                
                {/* Low dark text labels for accessibility */}
                <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-xs py-0.5 px-1 truncate text-[8px] text-slate-300 font-mono text-center">
                  {samp.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
