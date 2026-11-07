import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Crosshair,
  RotateCcw,
  Save,
  Copy,
  Check,
  Flame,
  Sparkles,
  Zap,
  Sliders,
  Smartphone,
  Target,
  Minus,
  Plus,
  Info
} from 'lucide-react';
import { SensitivitySettings, PresetProfile } from '../types';
import { DEFAULT_SENSITIVITY, PRESETS } from '../utils/constants';
import { sound } from '../utils/audio';

interface SensitivityTunerProps {
  onSummonDemon: () => void;
}

export const SensitivityTuner: React.FC<SensitivityTunerProps> = ({ onSummonDemon }) => {
  const [settings, setSettings] = useState<SensitivitySettings>(() => {
    try {
      const saved = localStorage.getItem('DEMON_SENSI_X_DATA');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read local sensitivity:', e);
    }
    return DEFAULT_SENSITIVITY;
  });

  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'sliders' | 'dragTest' | 'dpiCalc'>('sliders');

  // Drag Headshot Test State
  const [dragVelocity, setDragVelocity] = useState(0);
  const [lastHitType, setLastHitType] = useState<'head' | 'body' | null>(null);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragStartTime, setDragStartTime] = useState<number>(0);
  const [totalShots, setTotalShots] = useState(0);
  const [headshots, setHeadshots] = useState(0);

  // Sync to localStorage
  const handleSave = () => {
    sound.playSuccess();
    const updated = {
      ...settings,
      lastSaved: new Date().toLocaleTimeString(),
    };
    setSettings(updated);
    try {
      localStorage.setItem('DEMON_SENSI_X_DATA', JSON.stringify(updated));
    } catch {
      // Ignore
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2200);
  };

  const handleReset = () => {
    sound.playClick();
    setSettings({ ...DEFAULT_SENSITIVITY, lastSaved: new Date().toLocaleTimeString() });
    try {
      localStorage.setItem('DEMON_SENSI_X_DATA', JSON.stringify(DEFAULT_SENSITIVITY));
    } catch {
      // Ignore
    }
  };

  const handleApplyPreset = (preset: PresetProfile) => {
    sound.playClick();
    setSettings({
      ...preset.settings,
      presetName: preset.name,
      lastSaved: new Date().toLocaleTimeString(),
    });
  };

  const updateField = (key: keyof SensitivitySettings, val: number) => {
    const clamped = Math.max(0, Math.min(200, val));
    setSettings((prev) => ({
      ...prev,
      [key]: clamped,
      presetName: 'CUSTOM DEMON',
    }));
  };

  const handleCopy = () => {
    sound.playClick();
    const text = `🔥 DEMON SENSI_X PRO CONFIG 🔥
• General: ${settings.general}
• Red Dot: ${settings.redDot}
• 2x Scope: ${settings.scope2x}
• 4x Scope: ${settings.scope4x}
• Sniper Scope: ${settings.sniper}
• Free Look: ${settings.freeLook}
• Recommended DPI: ${settings.dpi}
• Pointer Speed: +${settings.pointerSpeed}
[100% Offline Tuned with DEMON SENSI_X]`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Drag Gesture Simulator for Free Fire One-Tap drag
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStartY(clientY);
    setDragStartTime(Date.now());
  };

  const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartY === null) return;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    const deltaY = dragStartY - clientY; // Upward drag is positive
    const duration = Math.max(16, Date.now() - dragStartTime);
    const speed = Math.round((deltaY / duration) * 100);

    setDragVelocity(speed);
    setTotalShots((prev) => prev + 1);

    // Free Fire drag physics logic:
    // If upward swipe is fast and sensitivity is high, trigger red numbers headshot (999!)
    const threshold = 180 - (settings.general / 200) * 80;
    if (deltaY > 30 && speed >= threshold) {
      setLastHitType('head');
      setHeadshots((prev) => prev + 1);
      sound.playHeadshotDing();
    } else {
      setLastHitType('body');
      sound.playClick();
    }
    setDragStartY(null);
  };

  const sliderItems = [
    { key: 'general' as const, label: 'General', desc: 'Main camera swipe & 360° rotation speed', icon: Crosshair },
    { key: 'redDot' as const, label: 'Red Dot', desc: 'Hipfire crosshair and iron sights aim-drag', icon: Target },
    { key: 'scope2x' as const, label: '2x Scope', desc: 'Mid-range SMG/Rifle 2x optic tracking', icon: Sliders },
    { key: 'scope4x' as const, label: '4x Scope', desc: 'Long-range AR 4x optic recoil drag', icon: Sliders },
    { key: 'sniper' as const, label: 'Sniper Scope', desc: 'AWM, Kar98k, M82B quick-switch speed', icon: Crosshair },
    { key: 'freeLook' as const, label: 'Free Look', desc: 'Eye button 360° surroundings awareness', icon: Sparkles },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Summon Demon quick trigger */}
      <div className="bg-gradient-to-r from-[#170e0a] via-[#100b08] to-[#1a100a] border border-[#ff550040] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 demon-glow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff5500] to-[#b32400] flex items-center justify-center text-black font-gaming font-black shadow-[0_0_20px_#ff550066]">
            FF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-gaming font-black tracking-wide text-white">
                FREE FIRE SENSITIVITY ENGINE
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-gaming font-bold bg-[#ff550020] text-[#ff7722] border border-[#ff550040]">
                {settings.presetName || 'CUSTOM'}
              </span>
            </div>
            <p className="text-xs font-tech text-gray-400">
              Calibrated for Free Fire OB44+ standard scale (0–200). 100% saved offline.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSummonDemon}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2b0c05] hover:bg-[#3d1107] border border-[#ff330080] text-xs font-gaming text-[#ff5522] transition-colors shadow-[0_0_15px_rgba(255,50,0,0.3)]"
            title="Re-watch demon jumpscare intro"
          >
            <Flame className="w-3.5 h-3.5 text-[#ff4400] animate-bounce" />
            <span>SUMMON DEMON</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141419] hover:bg-[#1f1f26] border border-gray-800 text-xs font-tech font-semibold text-gray-300 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#ff8833]" />}
            <span>{copied ? 'COPIED!' : 'COPY CONFIG'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('sliders');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-gaming tracking-wide transition-all ${
            activeTab === 'sliders'
              ? 'bg-[#ff5500] text-black font-black shadow-[0_0_15px_rgba(255,85,0,0.4)]'
              : 'bg-[#121218] text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>SENSITIVITY SLIDERS</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('dragTest');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-gaming tracking-wide transition-all ${
            activeTab === 'dragTest'
              ? 'bg-[#ff5500] text-black font-black shadow-[0_0_15px_rgba(255,85,0,0.4)]'
              : 'bg-[#121218] text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>DRAG HEADSHOT TESTER</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('dpiCalc');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-gaming tracking-wide transition-all ${
            activeTab === 'dpiCalc'
              ? 'bg-[#ff5500] text-black font-black shadow-[0_0_15px_rgba(255,85,0,0.4)]'
              : 'bg-[#121218] text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>DPI CALCULATOR</span>
        </button>
      </div>

      {/* PRESETS ROW */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-gaming tracking-wider text-gray-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#ff6600]" />
            PRO PLAYER PRESETS
          </span>
          <span className="text-[11px] font-tech text-gray-500">Tap to load preset</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PRESETS.map((preset) => {
            const isSelected = settings.presetName === preset.name;
            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`text-left p-2.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-[#ff55001f] border-[#ff5500] shadow-[0_0_15px_rgba(255,85,0,0.25)]'
                    : 'bg-[#0f0f15] border-gray-800 hover:border-[#ff550055] hover:bg-[#171720]'
                }`}
              >
                <div className="text-[9px] font-bold text-[#ff8833] uppercase truncate mb-0.5">
                  {preset.badge}
                </div>
                <div className="text-xs font-gaming font-black text-white truncate">
                  {preset.name}
                </div>
                <div className="text-[10px] font-tech text-gray-400 mt-1 line-clamp-1">
                  Gen: {preset.settings.general} | DPI: {preset.settings.dpi}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: SLIDERS */}
      {activeTab === 'sliders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sliderItems.map((item) => {
              const val = settings[item.key];
              const pct = (val / 200) * 100;

              return (
                <div
                  key={item.key}
                  className="bg-[#0f0f15] border border-gray-800/80 hover:border-[#ff550040] rounded-xl p-4 transition-all relative overflow-hidden group"
                >
                  {/* Subtle orange accent glow on hover */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff550008] rounded-full blur-xl pointer-events-none group-hover:bg-[#ff550015] transition-all" />

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#ff550015] text-[#ff7722] border border-[#ff550030]">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-gaming font-bold text-white tracking-wide">
                          {item.label}
                        </h4>
                        <p className="text-[11px] font-tech text-gray-400">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* Numeric control with +/- buttons */}
                    <div className="flex items-center gap-1.5 bg-[#08080c] border border-gray-800 rounded-lg p-1">
                      <button
                        onClick={() => {
                          sound.playClick();
                          updateField(item.key, val - 1);
                        }}
                        className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-gray-800 text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="w-10 text-center font-mono font-black text-sm text-[#ff8833]">
                        {val}
                      </span>

                      <button
                        onClick={() => {
                          sound.playClick();
                          updateField(item.key, val + 1);
                        }}
                        className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-gray-800 text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Slider Control */}
                  <div className="mt-3 relative">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      step="1"
                      value={val}
                      onChange={(e) => updateField(item.key, parseInt(e.target.value) || 0)}
                      className="w-full h-2.5 bg-[#1a1a24] rounded-lg appearance-none cursor-pointer accent-[#ff5500] focus:outline-none"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
                      <span>0 (Min)</span>
                      <span className="text-[#ff6600]/70 font-semibold">{pct.toFixed(0)}%</span>
                      <span>200 (Max)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Bar: Save & Reset */}
          <div className="bg-[#12121a] border border-[#ff550030] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-2 text-xs font-tech text-gray-400">
              <Info className="w-4 h-4 text-[#ff7722]" />
              <span>
                {settings.lastSaved
                  ? `Last saved locally at ${settings.lastSaved}`
                  : 'Sensitivities stored on-device in LocalStorage'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#181822] hover:bg-[#20202e] border border-gray-700 text-xs font-tech font-semibold text-gray-300 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-gray-400" />
                <span>RESET DEFAULT</span>
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff6600] text-black font-gaming font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(255,85,0,0.4)] hover:brightness-110 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>SAVE SENSITIVITY</span>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-tech font-bold flex items-center justify-between shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>SUCCESS: DEMON SENSI_X profiles securely cached offline!</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-400">LOCAL_STORAGE_OK</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* TAB 2: DRAG HEADSHOT SIMULATOR */}
      {activeTab === 'dragTest' && (
        <div className="bg-[#0e0e14] border border-gray-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-gaming font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-[#ff5500]" />
                ONE-TAP HEADSHOT DRAG SIMULATOR
              </h3>
              <p className="text-xs font-tech text-gray-400">
                Swipe UP quickly in the shooting zone to test your drag speed and one-tap headshot calibration!
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-tech bg-[#07070a] px-3 py-2 rounded-xl border border-gray-800">
              <div>
                <span className="text-gray-500 block">TOTAL SHOTS</span>
                <span className="font-gaming font-bold text-white text-sm">{totalShots}</span>
              </div>
              <div className="border-l border-gray-800 pl-4">
                <span className="text-gray-500 block">HEADSHOT %</span>
                <span className="font-gaming font-bold text-[#ff5500] text-sm">
                  {totalShots > 0 ? `${Math.round((headshots / totalShots) * 100)}%` : '0%'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Drag Box */}
          <div
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
            className="w-full h-72 sm:h-80 bg-[#08080c] border-2 border-dashed border-[#ff550050] hover:border-[#ff5500] rounded-2xl flex flex-col items-center justify-center relative cursor-ns-resize overflow-hidden select-none group"
          >
            {/* Target Reticle Crosshair */}
            <div className="relative flex items-center justify-center pointer-events-none">
              <div className="w-24 h-24 rounded-full border border-[#ff550040] flex items-center justify-center animate-pulse">
                <div className="w-12 h-12 rounded-full border border-[#ff550080] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5500]" />
                </div>
              </div>

              {/* Crosshair lines */}
              <div className="absolute w-32 h-[1px] bg-gradient-to-r from-transparent via-[#ff550080] to-transparent" />
              <div className="absolute h-32 w-[1px] bg-gradient-to-b from-transparent via-[#ff550080] to-transparent" />
            </div>

            {/* Drag feedback indicator */}
            <div className="mt-4 text-center pointer-events-none">
              <span className="text-xs font-gaming text-[#ffaa55] tracking-wider uppercase block">
                ▲ SWIPE UP TO DRAG HEADSHOT ▲
              </span>
              <span className="text-[11px] font-tech text-gray-500">
                Current General Sensitivity: {settings.general} (Drag Velocity required: &gt;
                {Math.round(180 - (settings.general / 200) * 80)})
              </span>
            </div>

            {/* Hit Marker Animation */}
            <AnimatePresence>
              {lastHitType === 'head' && (
                <motion.div
                  key={Date.now()}
                  initial={{ scale: 0.5, opacity: 1, y: 10 }}
                  animate={{ scale: 1.4, opacity: [1, 1, 0], y: -50 }}
                  transition={{ duration: 0.8 }}
                  className="absolute pointer-events-none text-center"
                >
                  <span className="font-gaming font-black text-4xl sm:text-5xl text-red-500 drop-shadow-[0_0_20px_#ff0000] tracking-wider block">
                    999
                  </span>
                  <span className="text-xs font-gaming font-bold bg-red-600 text-white px-2 py-0.5 rounded shadow">
                    HEADSHOT CRITICAL!
                  </span>
                </motion.div>
              )}

              {lastHitType === 'body' && (
                <motion.div
                  key={Date.now()}
                  initial={{ scale: 0.8, opacity: 1, y: 0 }}
                  animate={{ scale: 1.1, opacity: [1, 0.8, 0], y: -30 }}
                  transition={{ duration: 0.6 }}
                  className="absolute pointer-events-none text-center"
                >
                  <span className="font-gaming font-bold text-2xl text-yellow-400 drop-shadow-[0_0_10px_#facc15] block">
                    38
                  </span>
                  <span className="text-[10px] font-tech text-gray-400">
                    Body Hit (Drag faster)
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Live velocity badge */}
            {dragVelocity > 0 && (
              <div className="absolute bottom-3 right-3 text-[11px] font-mono text-gray-400 bg-black/60 px-2.5 py-1 rounded border border-gray-800">
                Velocity: {dragVelocity} px/s
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DPI & POINTER SPEED CALCULATOR */}
      {activeTab === 'dpiCalc' && (
        <div className="bg-[#0e0e14] border border-gray-800 rounded-2xl p-5 space-y-5">
          <div>
            <h3 className="text-base font-gaming font-bold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#ff5500]" />
              OPTIMAL ANDROID DPI & POINTER SPEED
            </h3>
            <p className="text-xs font-tech text-gray-400">
              Fine-tune your Android Developer Options "Smallest Width" (DPI) to match your screen response.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#08080c] border border-gray-800 rounded-xl p-4">
              <div className="text-xs font-gaming text-[#ff7722] mb-1">PHONE RAM TIER</div>
              <div className="text-lg font-gaming font-black text-white">2GB - 4GB RAM</div>
              <div className="text-xs font-tech text-gray-400 mt-2 space-y-1">
                <div>• Smallest Width: <strong className="text-white">411 DPI</strong></div>
                <div>• Pointer Speed: <strong className="text-white">+2 or +3</strong></div>
                <div>• Graphics: <strong className="text-emerald-400">Smooth + High FPS</strong></div>
              </div>
            </div>

            <div className="bg-[#08080c] border border-[#ff550040] rounded-xl p-4 shadow-[0_0_15px_rgba(255,85,0,0.15)]">
              <div className="text-xs font-gaming text-[#ff5500] mb-1">PHONE RAM TIER (RECOMMENDED)</div>
              <div className="text-lg font-gaming font-black text-white">6GB - 8GB RAM</div>
              <div className="text-xs font-tech text-gray-400 mt-2 space-y-1">
                <div>• Smallest Width: <strong className="text-white">480 - 520 DPI</strong></div>
                <div>• Pointer Speed: <strong className="text-white">+1 or +2</strong></div>
                <div>• Graphics: <strong className="text-emerald-400">Standard / Ultra + High FPS</strong></div>
              </div>
            </div>

            <div className="bg-[#08080c] border border-gray-800 rounded-xl p-4">
              <div className="text-xs font-gaming text-[#ff7722] mb-1">PHONE RAM TIER</div>
              <div className="text-lg font-gaming font-black text-white">12GB+ / FLAGSHIP</div>
              <div className="text-xs font-tech text-gray-400 mt-2 space-y-1">
                <div>• Smallest Width: <strong className="text-white">560 - 600 DPI</strong></div>
                <div>• Pointer Speed: <strong className="text-white">Default / 0</strong></div>
                <div>• Graphics: <strong className="text-emerald-400">Ultra + High Res + High FPS</strong></div>
              </div>
            </div>
          </div>

          {/* Quick instructions */}
          <div className="bg-[#141210] border border-[#ff550030] rounded-xl p-4 text-xs font-tech text-gray-300 space-y-2">
            <h5 className="font-gaming font-bold text-[#ff8833]">HOW TO CHANGE ANDROID DPI SAFELY:</h5>
            <ol className="list-decimal list-inside space-y-1 text-gray-400">
              <li>Open Android Phone <strong className="text-white">Settings</strong> &gt; <strong className="text-white">About Phone</strong>.</li>
              <li>Tap <strong className="text-white">Build Number</strong> 7 times to enable Developer Options.</li>
              <li>Go to <strong className="text-white">System / Additional Settings &gt; Developer Options</strong>.</li>
              <li>Scroll down to <strong className="text-white">Smallest Width (DPI)</strong> and enter the recommended value above (do not exceed 600 to prevent system UI scaling glitches).</li>
              <li>Change <strong className="text-white">Pointer Speed</strong> in Settings &gt; Language & Input &gt; Pointer Speed.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
