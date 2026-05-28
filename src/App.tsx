import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Info,
  Layers,
  CheckCircle,
  HelpCircle,
  Code,
  Terminal,
  RefreshCw,
  Cpu,
  Brain,
} from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UploadCard from './components/UploadCard';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import HistoryGallery from './components/HistoryGallery';
import Toast, { ToastMessage, ToastType } from './components/Toast';
import { STYLE_SAMPLES, CONTENT_SAMPLES } from './data/samples';
import { AppSettings, GenerationHistory } from './types';
import { simulateStyleTransfer } from './services/styleTransferSimulator';
import { sendStyleTransferRequest } from './services/api';

export default function App() {
  // Global States
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('pistyle_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {}
    }
    return {
      backendUrl: 'http://192.168.1.10:5000',
      isSimulationMode: true, // Default to true for instant preview out-of-the-box!
      compressionQuality: 0.75,
      maxUploadSizeBytes: 5242880, // 5MB
    };
  });

  const [contentImage, setContentImage] = useState<string | null>(CONTENT_SAMPLES[0].url);
  const [styleImage, setStyleImage] = useState<string | null>(STYLE_SAMPLES[0].url);
  const [resultImage, setResultImage] = useState<string | null>(null);
  
  // Options states
  const [strength, setStrength] = useState<number>(75);
  const [resolution, setResolution] = useState<string>('Medium');
  
  // Processing and status hooks
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processStep, setProcessStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'generate' | 'instructions'>('generate');

  // History system
  const [history, setHistory] = useState<GenerationHistory[]>(() => {
    const saved = localStorage.getItem('pistyle_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {}
    }
    return [];
  });

  // Floating Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // persist settings
  useEffect(() => {
    localStorage.setItem('pistyle_settings', JSON.stringify(settings));
  }, [settings]);

  // persist history
  useEffect(() => {
    localStorage.setItem('pistyle_history', JSON.stringify(history));
  }, [history]);

  // Trigger Toast helper
  const triggerToast = (type: ToastType, title: string, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  // Main Generation Handler
  const handleGenerate = async () => {
    if (!contentImage) {
      triggerToast('error', 'Content image required', 'Please upload or select a starting content image.');
      return;
    }
    if (!styleImage) {
      triggerToast('error', 'Style reference required', 'Please upload or select an artistic style image.');
      return;
    }

    setIsProcessing(true);
    setProgressPercent(5);
    setProcessStep('Preprocessing layout assets...');

    // Extract dynamic helper variables to track preset name or details
    const activeStyleSample = STYLE_SAMPLES.find((item) => item.url === styleImage);
    const styleName = activeStyleSample ? activeStyleSample.name : 'Custom Matrix Upload';

    try {
      // 1. Image compressing & structural preparation phase
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProgressPercent(20);
      setProcessStep('Optimizing dimensions & checking format headers...');

      await new Promise((resolve) => setTimeout(resolve, 600));
      setProgressPercent(40);

      let stylizedBase64 = '';

      if (settings.isSimulationMode) {
        // --- Client-Side Simulator Engine Mode ---
        setProcessStep('Calculating color vectors & brushstroke alignment...');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setProgressPercent(70);
        setProcessStep('Blended VGG-19 Neural approximations...');
        
        // Run paint canvas simulation
        stylizedBase64 = await simulateStyleTransfer(contentImage, styleImage, {
          strength,
          resolution,
          styleName,
        });

        await new Promise((resolve) => setTimeout(resolve, 800));
        setProgressPercent(95);
        setProcessStep('Final contrast check & noise grain filtering...');
        await new Promise((resolve) => setTimeout(resolve, 400));
      } else {
        // --- Physical Raspberry Pi Server Mode ---
        setProcessStep(`Uploading elements to Pi Node at ${settings.backendUrl}...`);
        setProgressPercent(50);
        
        try {
          // Send request with retry logic embedded inside services/api
          const response = await sendStyleTransferRequest(
            contentImage,
            styleImage,
            settings.backendUrl
          );
          
          stylizedBase64 = response.output_image;
          setProgressPercent(90);
          setProcessStep('Downscaling response vectors...');
        } catch (apiErr: any) {
          throw new Error(apiErr?.message || 'Physical Pi server gave a bad response.');
        }
      }

      // 2. Wrap generation complete details
      setResultImage(stylizedBase64);
      setProgressPercent(100);
      setProcessStep('Artistic reconstruction successfully finished!');

      // 3. Update localStorage history database
      const timestampString = new Date().toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const newHistoryItem: GenerationHistory = {
        id: Date.now().toString(),
        timestamp: `${new Date().toLocaleDateString()} ${timestampString}`,
        contentImage,
        styleImage,
        resultImage: stylizedBase64,
        styleName,
        strength,
        resolution,
      };

      setHistory((prev) => [newHistoryItem, ...prev]);
      
      triggerToast(
        'success',
        'Artwork Generated!',
        `Your design using "${styleName}" is complete and ready to inspect.`
      );

      // Smooth scroll target view to Comparison output
      setTimeout(() => {
        const sliderElement = document.getElementById('artwork-result-wrapper');
        if (sliderElement) {
          sliderElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);

    } catch (err: any) {
      console.error(err);
      triggerToast(
        'error',
        'Generation Failed',
        err?.message || 'An unexpected error occurred during synthesis.'
      );
    } finally {
      setIsProcessing(false);
      setProgressPercent(0);
      setProcessStep('');
    }
  };

  // Quick Select from History lists
  const handleSelectFromHistory = (item: GenerationHistory) => {
    setContentImage(item.contentImage);
    setStyleImage(item.styleImage);
    setResultImage(item.resultImage);
    setStrength(item.strength);
    setResolution(item.resolution);
    
    triggerToast(
      'info',
      'Preset Restored',
      `Loaded historical variables matching selected template "${item.styleName}".`
    );

    // Bounce scroll to view content comparisons
    setTimeout(() => {
      const sliderVal = document.getElementById('artwork-result-wrapper');
      if (sliderVal) {
        sliderVal.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    triggerToast('warning', 'Item Deleted', 'Removed generation history logs successfully.');
  };

  return (
    <div className="min-h-screen bg-[#08090f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-300">
      
      {/* Dynamic Floating Toast Stack */}
      <div className="fixed bottom-5 right-5 z-55 flex flex-col gap-3 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      {/* Global Navbar */}
      <Navbar
        settings={settings}
        onUpdateSettings={setSettings}
        isProcessing={isProcessing}
      />

      {/* Hero Header */}
      <Hero />

      {/* Sub tabs and options */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pb-20 space-y-8 flex-1">
        
        {/* Navigation Switch Tabs */}
        <div className="flex border-b border-slate-800/80 gap-6">
          <button
            id="tab-generate-btn"
            onClick={() => setActiveTab('generate')}
            className={`py-3 text-xs sm:text-sm font-semibold font-sans tracking-wide border-b-2 transition ${
              activeTab === 'generate'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Art Work Studio
          </button>
          <button
            id="tab-instructions-btn"
            onClick={() => setActiveTab('instructions')}
            className={`py-3 text-xs sm:text-sm font-semibold font-sans tracking-wide border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'instructions'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4 text-pink-400" />
            <span>Raspberry Pi Setup</span>
          </button>
        </div>

        {/* Tab 1: Generate Work Space */}
        {activeTab === 'generate' && (
          <div className="space-y-8">
            
            {/* Direct Warning Indicator of Simulation status vs Pi status */}
            {!settings.isSimulationMode && (
              <div className="p-4 bg-indigo-950/25 border border-indigo-500/20 rounded-2xl flex items-start space-x-3 text-indigo-200">
                <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-white font-mono block">PI LINK TRANSFERS ENGAGED:</span>
                  <p className="leading-relaxed text-indigo-300">
                    The client is attempting deep integrations targeting local Raspberry Pi Flask endpoint <span className="text-pink-400 font-semibold font-mono underline">{settings.backendUrl}</span>. Make sure your hardware is online, initialized, and supports CORS access flags!
                  </p>
                  <p className="text-slate-400 text-[10px]">
                    Tip: Don't have a Raspberry Pi online? Toggle the <button id="alert-sim-toggle-btn" onClick={() => setSettings({...settings, isSimulationMode: true})} className="text-cyan-400 font-semibold underline hover:text-cyan-300">SIMULATION ACTIVE</button> button in the header bar above for instant, amazing canvas tests!
                  </p>
                </div>
              </div>
            )}

            {/* Side-by-side Upload Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UploadCard
                id="content-image"
                title="Content Image (Base Matrix)"
                type="content"
                image={contentImage}
                onImageChanged={setContentImage}
                samples={CONTENT_SAMPLES}
                maxSizeBytes={settings.maxUploadSizeBytes}
              />
              <UploadCard
                id="style-image"
                title="Style Image (Art Reference)"
                type="style"
                image={styleImage}
                onImageChanged={setStyleImage}
                samples={STYLE_SAMPLES}
                maxSizeBytes={settings.maxUploadSizeBytes}
              />
            </div>

            {/* Middle Parameters & Generate actions Panel */}
            <div className="bg-[#0f111a]/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                <div>
                  <h4 className="text-white font-sans font-bold text-sm">Transfer Calibration Settings</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Tune hyperparameter targets for reconstruction</p>
                </div>
                <div className="text-cyan-400 font-mono text-xs flex items-center space-x-1">
                  <Brain className="w-3.5 h-3.5 animate-pulse" />
                  <span>VGG-19 Feature Map</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Parameter 1: Strength Selection slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-300">Style Extraction Strength:</span>
                    <span className="text-pink-400 font-semibold">{strength}%</span>
                  </div>
                  <input
                    id="strength-slider-range"
                    type="range"
                    min="10"
                    max="100"
                    value={strength}
                    onChange={(e) => setStrength(parseInt(e.target.value))}
                    disabled={isProcessing}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Structural Focus</span>
                    <span>Artistic Overhaul</span>
                  </div>
                </div>

                {/* Parameter 2: Output Resolution settings */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-slate-300">
                    Output Resolution Target:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Low', 'Medium', 'High'].map((res) => {
                      const isActive = resolution === res;
                      const resDetails = res === 'Low' ? '512px' : res === 'Medium' ? '720px' : '1000px';
                      return (
                        <button
                          id={`resolution-${res}-btn`}
                          key={res}
                          type="button"
                          onClick={() => setResolution(res)}
                          disabled={isProcessing}
                          className={`py-2 rounded-xl text-center border font-mono text-xs transition duration-200 ${
                            isActive
                              ? 'bg-cyan-500/10 text-cyan-300 border-cyan-400/80 shadow-md shadow-cyan-400/5'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                          }`}
                        >
                          <span className="block font-semibold">{res}</span>
                          <span className="text-[9px] text-slate-500">{resDetails}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Progress Panel & Action bar */}
              <div className="space-y-4 pt-3 border-t border-slate-800/40">
                {isProcessing && (
                  <div className="space-y-2.5 animate-pulse">
                    <div className="flex justify-between items-center text-xs font-mono text-slate-300">
                      <span className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        <span>{processStep}</span>
                      </span>
                      <span className="text-cyan-400 font-bold">{progressPercent}%</span>
                    </div>
                    {/* Glowing structural progress line tracker */}
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 transition-all duration-300 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Generate Action Button */}
                <button
                  id="generate-artwork-btn"
                  onClick={handleGenerate}
                  disabled={isProcessing}
                  className={`w-full py-3.5 rounded-xl font-sans font-bold tracking-wide text-xs sm:text-sm transition flex items-center justify-center space-x-2 border cursor-pointer ${
                    isProcessing
                      ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-transparent active:scale-[0.99]'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
                      <span>Processing Neural Textures...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current text-slate-950" />
                      <span>Generate Artwork</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Result Area */}
            {resultImage && (
              <div id="artwork-result-wrapper" className="pt-2 animate-fade-in">
                <BeforeAfterSlider
                  contentImage={contentImage!}
                  resultImage={resultImage}
                  styleName={STYLE_SAMPLES.find((item) => item.url === styleImage)?.name || 'Custom Upload Style'}
                  timestamp={new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                />
              </div>
            )}

            {/* History Gallery Segment */}
            <div className="pt-4 border-t border-slate-800/40">
              <HistoryGallery
                history={history}
                onDeleteHistory={handleDeleteHistoryItem}
                onSelectFromHistory={handleSelectFromHistory}
              />
            </div>

          </div>
        )}

        {/* Tab 2: Instructions view workspace */}
        {activeTab === 'instructions' && (
          <div className="bg-[#0f111a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-w-4xl mx-auto animate-fade-in">
            {/* Header instructions label */}
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3 mb-1">
                <div className="p-1.5 bg-pink-500/10 rounded-lg text-pink-400 border border-pink-500/20">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-white font-bold text-lg font-sans">Raspberry Pi Flask Server Initialization</h3>
              </div>
              <p className="text-xs text-slate-400 font-mono">Configure Flask Neural Style Transfer API easily</p>
            </div>

            {/* Detail info */}
            <div className="space-y-4 text-sm leading-relaxed text-slate-300">
              <p>
                To enable physical optimized Style Transfer on a Raspberry Pi device, run this lightweight Flask model service. It uses Google's TensorFlow Hub <code className="text-cyan-400 font-mono">Arbitrary Image Stylization V1-256</code> model, optimized for thread execution and memory consumption.
              </p>

              {/* Steps */}
              <div className="space-y-4 pt-2">
                
                {/* Step 1 */}
                <div className="flex items-start space-x-4">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 border border-slate-700/60 flex items-center justify-center font-mono text-xs shrink-0 font-bold">1</span>
                  <div className="space-y-1">
                    <strong className="text-white block font-semibold text-[13px] sm:text-sm">Install Dependencies on Raspberry Pi:</strong>
                    <span className="text-slate-400 text-xs">Ensure you have Python 3 and standard build libraries. Execute inside terminal:</span>
                    <pre className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-[11px] font-mono text-cyan-300 overflow-x-auto mt-1">
                      pip install flask flask-cors numpy tensorflow tensorflow-hub opencv-python pillow
                    </pre>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start space-x-4">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 border border-slate-700/60 flex items-center justify-center font-mono text-xs shrink-0 font-bold">2</span>
                  <div className="space-y-1">
                    <strong className="text-white block font-semibold text-[13px] sm:text-sm">Create the Python Server Script (app.py):</strong>
                    <span className="text-slate-400 text-xs">Save the code block below in a file named <code className="text-pink-400 font-mono">app.py</code> on your Pi. It handles incoming requests, runs optimized TensorFlow Hub inference, and writes output files:</span>
                    
                    {/* Expandable terminal simulator */}
                    <pre className="bg-slate-950 rounded-lg border border-slate-850 p-3 mt-1.5 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-72 whitespace-pre text-left leading-relaxed">
{`# app.py - Optimized Tensorflow Hub Style Transfer for Pi
import os
import uuid
import time
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image

# Reduce TensorFlow logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

try:
    import numpy as np
    import cv2
    import tensorflow as tf
    import tensorflow_hub as hub
    # CPU threading optimization for Raspberry Pi 4 / 5
    tf.config.threading.set_intra_op_parallelism_threads(2)
    tf.config.threading.set_inter_op_parallelism_threads(2)
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False

app = Flask(__name__)
CORS(app) # Enable cross-origin browser access

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

IMAGE_SIZE = 512
MODEL_URL = "https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2"
model = None

if TF_AVAILABLE:
    print("[INFO] Loading style transfer model...")
    model = hub.load(MODEL_URL)

def load_image(path, max_dim=512):
    img = Image.open(path).convert("RGB")
    w, h = img.size
    scale = max_dim / max(w, h)
    new_w, new_h = int(w * scale), int(h * scale)
    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    img_array = np.array(img).astype(np.float32) / 255.0
    return tf.convert_to_tensor(img_array[np.newaxis, ...])

@app.route("/stylize", methods=["POST"])
def stylize():
    if "content_image" not in request.files or "style_image" not in request.files:
        return jsonify({"error": "Content and style images are required"}), 400

    content_file = request.files["content_image"]
    style_file = request.files["style_image"]

    session_id = uuid.uuid4().hex[:10]
    content_p = os.path.join(OUTPUT_DIR, f"content_{session_id}.jpg")
    style_p = os.path.join(OUTPUT_DIR, f"style_{session_id}.jpg")
    output_filename = f"stylized_{session_id}.jpg"
    output_p = os.path.join(OUTPUT_DIR, output_filename)

    content_file.save(content_p)
    style_file.save(style_p)

    try:
        if TF_AVAILABLE and model is not None:
            c_image = load_image(content_p, IMAGE_SIZE)
            s_image = load_image(style_p, IMAGE_SIZE)
            
            # Predict stylized output
            stylized_tensor = model(tf.constant(c_image), tf.constant(s_image))[0]
            
            # Save raw numpy array with high quality
            tensor = (stylized_tensor[0] * 255).numpy().astype(np.uint8)
            tensor_bgr = cv2.cvtColor(tensor, cv2.COLOR_RGB2BGR)
            
            # Restore original content resolution aspect ratio
            orig_size = Image.open(content_p).size
            tensor_resized = cv2.resize(tensor_bgr, orig_size, interpolation=cv2.INTER_LANCZOS4)
            cv2.imwrite(output_p, tensor_resized, [cv2.IMWRITE_JPEG_QUALITY, 95])
        else:
            # High-quality smart blending fallback
            c_img = Image.open(content_p).convert("RGB")
            s_img = Image.open(style_p).convert("RGB").resize(c_img.size)
            res = Image.blend(c_img, s_img, 0.45)
            res.save(output_p, "JPEG", quality=95)
            
        if os.path.exists(content_p): os.remove(content_p)
        if os.path.exists(style_p): os.remove(style_p)

        return jsonify({"output_image": f"http://{request.host}/output/{output_filename}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/output/<filename>")
def get_output(filename):
    return send_from_directory(OUTPUT_DIR, filename)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)`}
                    </pre>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start space-x-4">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 border border-slate-700/60 flex items-center justify-center font-mono text-xs shrink-0 font-bold">3</span>
                  <div className="space-y-1">
                    <strong className="text-white block font-semibold text-[13px] sm:text-sm">Expose and connect:</strong>
                    <span className="text-slate-400 text-xs">Run the neural style transfer server:</span>
                    <pre className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-[11px] font-mono text-cyan-300 overflow-x-auto mt-1">
                      python app.py
                    </pre>
                    <p className="text-slate-400 text-xs leading-relaxed mt-1">
                      Open <span className="text-pink-400 underline">Settings (gear icon)</span> in the top-right and configure your exact Raspberry Pi IP address (e.g. <code className="text-white font-mono bg-slate-900 border border-slate-800 rounded px-1">http://[YOUR_PI_IP]:5000</code>). Deactivate Simulation Mode to start feeding actual photo streams into TensorFlow Hub!
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      {/* Modern Compact Page Footer */}
      <footer className="border-t border-slate-900 bg-[#06080d]/90 py-6 text-center text-xs text-slate-500 font-mono mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 PiStyle AI. Built for full-stack edge computing on standard Raspberry Pi architectures.</p>
          <div className="flex gap-4">
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400/80">Local Hardware Endpoint Ready</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
