import React, { useState } from 'react';
import { Cpu, Settings, Wifi, WifiOff, Sparkles, HelpCircle, X, ShieldAlert } from 'lucide-react';
import { AppSettings } from '../types';

interface NavbarProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  isProcessing: boolean;
}

export default function Navbar({ settings, onUpdateSettings, isProcessing }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState(settings.backendUrl);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      backendUrl: tempUrl,
    });
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#090b11]/85 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-slate-900 border border-slate-805 rounded-lg flex items-center justify-center">
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-sans font-extrabold tracking-tight text-base text-white">
                PiStyle <span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.2 rounded border border-slate-800 font-mono">
                v1.2
              </span>
            </div>
          </div>
        </div>

        {/* Global Controls & Status */}
        <div className="flex items-center space-x-3">
          {/* Simulation Toggle */}
          <button
            id="simulation-toggle-btn"
            onClick={() => {
              onUpdateSettings({
                ...settings,
                isSimulationMode: !settings.isSimulationMode,
              });
            }}
            disabled={isProcessing}
            title={settings.isSimulationMode ? "Switch to Real Raspberry Pi Backend Connection" : "Switch to Instant Client-Side AI Simulation"}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
              settings.isSimulationMode
                ? 'bg-gradient-to-r from-purple-500/15 to-pink-500/15 text-pink-300 border-pink-500/30'
                : 'bg-slate-800/40 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>{settings.isSimulationMode ? 'SIMULATION ACTIVE' : 'PI MODE'}</span>
          </button>

          {/* Connection Indicators */}
          <div
            className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono ${
              settings.isSimulationMode
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
            }`}
          >
            {settings.isSimulationMode ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Client Engine Ready</span>
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="truncate max-w-[120px]">{settings.backendUrl.replace('http://', '')}</span>
              </>
            )}
          </div>

          {/* Settings Trigger Icon */}
          <button
            id="settings-trigger-btn"
            onClick={() => setIsOpen(true)}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition"
            title="Configure Pi Server Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0F111A] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-800 bg-[#090b11]">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                <h3 className="text-white font-semibold text-base font-sans">Settings &amp; Integration</h3>
              </div>
              <button
                id="close-settings-modal-btn"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-slate-300 text-xs font-mono mb-1">
                  Raspberry Pi Server Base URL:
                </label>
                <input
                  id="settings-backend-url-input"
                  type="text"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="e.g. http://192.168.1.10:5000"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/80"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1.5 font-mono">
                  Default: <span className="text-cyan-400">http://192.168.1.10:5000</span>. Ensure your Pi server app enables CORS with flask-cors.
                </p>
              </div>

              {/* Mode Description Callout */}
              <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1.5">
                <span className="text-white font-medium text-xs font-mono block">Engine Routing Mode:</span>
                <div className="flex items-start space-x-2">
                  <input
                    id="settings-sim-checkbox"
                    type="checkbox"
                    checked={settings.isSimulationMode}
                    onChange={(e) => {
                      onUpdateSettings({
                        ...settings,
                        isSimulationMode: e.target.checked
                      });
                    }}
                    className="mt-0.5 rounded border-slate-700 bg-slate-900 accent-pink-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <div className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    <strong className="text-pink-400">Enable Client-side Simulation Engine</strong>
                    <p className="text-slate-400 mt-0.5">
                      Check this to bypass remote hardware and stylize images using advanced browser-side Canvas blending. Perfect for demonstration environments when the Pi is offline!
                    </p>
                  </div>
                </div>
              </div>

              {/* Compression Quality & Upload Size Limits */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 text-[11px] font-mono mb-1">
                    Compression Quality:
                  </label>
                  <select
                    id="settings-compression-select"
                    value={settings.compressionQuality}
                    onChange={(e) => {
                      onUpdateSettings({
                        ...settings,
                        compressionQuality: parseFloat(e.target.value)
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-cyan-500"
                  >
                    <option value="0.95">None (95%)</option>
                    <option value="0.75">Standard (75%)</option>
                    <option value="0.5">High (50%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-[11px] font-mono mb-1">
                    Max Upload Size:
                  </label>
                  <select
                    id="settings-max-upload-select"
                    value={settings.maxUploadSizeBytes}
                    onChange={(e) => {
                      onUpdateSettings({
                        ...settings,
                        maxUploadSizeBytes: parseInt(e.target.value)
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-cyan-500"
                  >
                    <option value={3145728}>3 MB max</option>
                    <option value={5242880}>5 MB max</option>
                    <option value={10485760}>10 MB max</option>
                  </select>
                </div>
              </div>

              {/* Save Trigger */}
              <div className="flex justify-end pt-2 space-x-2">
                <button
                  id="cancel-settings-btn"
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-mono rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  id="save-settings-btn"
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-mono rounded-lg shadow-lg hover:shadow-cyan-500/10 hover:opacity-90 transition"
                >
                  Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
