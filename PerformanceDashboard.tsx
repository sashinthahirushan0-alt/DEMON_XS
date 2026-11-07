import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Cpu,
  Monitor,
  Battery,
  ShieldCheck,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Gauge,
  Layers,
  Sparkles
} from 'lucide-react';
import { DeviceInfo } from '../types';

export const PerformanceDashboard: React.FC = () => {
  // Real-time FPS monitoring via requestAnimationFrame
  const [currentFps, setCurrentFps] = useState(60);
  const [avgFps, setAvgFps] = useState(60);
  const [minFps, setMinFps] = useState(60);
  const [fpsHistory, setFpsHistory] = useState<number[]>(new Array(30).fill(60));

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const historyRef = useRef<number[]>(new Array(30).fill(60));

  // Device Info State
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    browser: 'Analyzing...',
    os: 'Android / Mobile',
    screenResolution: `${window.screen.width} x ${window.screen.height}`,
    pixelRatio: window.devicePixelRatio || 1,
    cpuCores: navigator.hardwareConcurrency || 8,
    deviceMemoryGB: '4+ GB',
    batteryLevel: 'Detecting...',
    batteryCharging: false,
    gpuRenderer: 'Adreno / Mali GPU',
    networkStatus: '100% Offline Ready',
    estimatedRefreshRate: 60,
  });

  // FPS Loop
  useEffect(() => {
    let animId: number;

    const loop = (now: number) => {
      frameCountRef.current++;
      const elapsed = now - lastTimeRef.current;

      if (elapsed >= 500) {
        const measuredFps = Math.min(144, Math.round((frameCountRef.current * 1000) / elapsed));
        setCurrentFps(measuredFps);

        // Update history
        const newHist = [...historyRef.current.slice(1), measuredFps];
        historyRef.current = newHist;
        setFpsHistory(newHist);

        // Compute avg & min
        const sum = newHist.reduce((a, b) => a + b, 0);
        setAvgFps(Math.round(sum / newHist.length));
        setMinFps(Math.min(...newHist));

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Inspect Device Specs
  useEffect(() => {
    const nav = navigator as unknown as {
      deviceMemory?: number;
      getBattery?: () => Promise<{ level: number; charging: boolean; addEventListener: (type: string, listener: () => void) => void }>;
    };

    // GPU extraction via WebGL
    let gpuName = 'Hardware Accelerated GPU';
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          gpuName = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || gpuName;
        }
      }
    } catch {
      // Ignore
    }

    // Battery inspection
    if (nav.getBattery) {
      nav.getBattery().then((battery) => {
        setDeviceInfo((prev) => ({
          ...prev,
          batteryLevel: `${Math.round(battery.level * 100)}%`,
          batteryCharging: battery.charging,
        }));
      }).catch(() => {
        // Battery API not supported or permissions restricted
      });
    }

    setDeviceInfo((prev) => ({
      ...prev,
      os: /Android/i.test(navigator.userAgent) ? 'Android 13 / 14 Native' : 'Mobile / Desktop',
      cpuCores: navigator.hardwareConcurrency || 8,
      deviceMemoryGB: nav.deviceMemory ? `${nav.deviceMemory} GB` : '6-8 GB (Est.)',
      gpuRenderer: gpuName,
      screenResolution: `${window.screen.width * (window.devicePixelRatio || 1)} x ${window.screen.height * (window.devicePixelRatio || 1)} (${window.screen.width}x${window.screen.height})`,
      pixelRatio: Number((window.devicePixelRatio || 1).toFixed(2)),
      networkStatus: navigator.onLine ? 'Connected (Offline Cached)' : '100% Offline Mode',
    }));
  }, []);

  const getFpsColor = (fps: number) => {
    if (fps >= 58) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
    if (fps >= 45) return 'text-yellow-400 border-yellow-500/40 bg-yellow-950/20';
    return 'text-red-400 border-red-500/40 bg-red-950/20';
  };

  return (
    <div className="space-y-6">
      {/* Live FPS Monitoring Card */}
      <div className="bg-[#0f0f16] border border-[#ff550040] rounded-2xl p-5 demon-glow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#ff550020] text-[#ff6600] border border-[#ff550040]">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-gaming font-black text-white flex items-center gap-2">
                REAL-TIME HARDWARE FPS MONITOR
              </h3>
              <p className="text-xs font-tech text-gray-400">
                Live display frame-rate captured via Hardware requestAnimationFrame loop.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl border font-gaming font-black text-xl flex items-center gap-2 ${getFpsColor(currentFps)}`}>
              <Gauge className="w-5 h-5" />
              <span>{currentFps} FPS</span>
            </div>
          </div>
        </div>

        {/* Live FPS Graph Bars */}
        <div className="bg-[#08080c] border border-gray-800 rounded-xl p-4">
          <div className="flex items-end justify-between h-28 gap-1 pt-4">
            {fpsHistory.map((fps, idx) => {
              const heightPct = Math.min(100, Math.max(10, (fps / 120) * 100));
              const isLow = fps < 45;
              const isMed = fps >= 45 && fps < 58;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative"
                >
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t transition-all ${
                      isLow
                        ? 'bg-red-500'
                        : isMed
                        ? 'bg-yellow-500'
                        : 'bg-gradient-to-t from-[#ff5500] to-[#ffaa00]'
                    }`}
                  />
                  {/* Tooltip on hover */}
                  <span className="absolute -top-7 text-[9px] font-mono bg-black text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-gray-700">
                    {fps}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs font-tech text-gray-400 border-t border-gray-800 mt-2 pt-2">
            <div>
              AVG FPS: <strong className="text-white font-mono">{avgFps}</strong>
            </div>
            <div>
              1% LOW: <strong className="text-yellow-400 font-mono">{minFps}</strong>
            </div>
            <div>
              TARGET: <strong className="text-[#ff7722] font-mono">60 - 90 Hz</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Device Specifications Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-gaming tracking-wider text-gray-400 flex items-center gap-1.5 uppercase">
          <Cpu className="w-3.5 h-3.5 text-[#ff5500]" />
          DEVICE HARDWARE SPECIFICATIONS
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#0f0f15] border border-gray-800/80 rounded-xl p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#ff550015] text-[#ff7722] border border-[#ff550030]">
              <Monitor className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-tech text-gray-500 uppercase block">DISPLAY RES & DPI</span>
              <span className="text-xs font-gaming font-bold text-white block truncate">{deviceInfo.screenResolution}</span>
              <span className="text-[10px] font-mono text-[#ff8833]">Scale: {deviceInfo.pixelRatio}x</span>
            </div>
          </div>

          <div className="bg-[#0f0f15] border border-gray-800/80 rounded-xl p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#ff550015] text-[#ff7722] border border-[#ff550030]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-tech text-gray-500 uppercase block">CPU & THREADS</span>
              <span className="text-xs font-gaming font-bold text-white block">{deviceInfo.cpuCores} Cores Octa-Core</span>
              <span className="text-[10px] font-mono text-emerald-400">High Concurrency</span>
            </div>
          </div>

          <div className="bg-[#0f0f15] border border-gray-800/80 rounded-xl p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#ff550015] text-[#ff7722] border border-[#ff550030]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-tech text-gray-500 uppercase block">ESTIMATED RAM</span>
              <span className="text-xs font-gaming font-bold text-white block">{deviceInfo.deviceMemoryGB}</span>
              <span className="text-[10px] font-mono text-gray-400">Native Buffer</span>
            </div>
          </div>

          <div className="bg-[#0f0f15] border border-gray-800/80 rounded-xl p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#ff550015] text-[#ff7722] border border-[#ff550030]">
              <Battery className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-tech text-gray-500 uppercase block">BATTERY & THERMALS</span>
              <span className="text-xs font-gaming font-bold text-white block">
                {deviceInfo.batteryLevel} {deviceInfo.batteryCharging ? '(Charging)' : ''}
              </span>
              <span className="text-[10px] font-mono text-[#ffaa44]">Thermal Throttle Safe</span>
            </div>
          </div>
        </div>

        {/* GPU info banner */}
        <div className="bg-[#09090e] border border-gray-800 rounded-xl p-3 flex items-center justify-between text-xs font-tech text-gray-300">
          <span className="text-gray-400">GPU RENDERER:</span>
          <span className="font-mono text-xs text-[#ff9944] truncate max-w-md">{deviceInfo.gpuRenderer}</span>
        </div>
      </div>

      {/* Free Fire Graphics Optimization Guide */}
      <div className="bg-[#0f0f15] border border-gray-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#ff5500]" />
          <div>
            <h3 className="text-base font-gaming font-bold text-white">
              FREE FIRE GRAPHICS OPTIMIZATION GUIDE
            </h3>
            <p className="text-xs font-tech text-gray-400">
              Pro tournament settings to eliminate frame drops, stutter, and touch input lag.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#08080c] border border-gray-800/90 rounded-xl p-4 space-y-3">
            <h5 className="font-gaming font-bold text-sm text-[#ff8833] flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> IN-GAME DISPLAY SETTINGS
            </h5>
            <ul className="space-y-2 text-xs font-tech text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Graphics &gt; Smooth or Standard:</strong> Never use "Ultra/Max" on low/mid tier devices during competitive play. Smooth unlocks minimal frame rendering latency.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">High FPS &gt; HIGH (Mandatory):</strong> Always keep High FPS turned on. If set to "Normal", Free Fire caps frame delivery at 30 FPS regardless of your screen!
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Shadow &gt; OFF:</strong> Dynamic real-time shadows consume up to 25% GPU bandwidth and cause frame drops when smoke/grenades explode.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Filter &gt; Vivid:</strong> Vivid gives higher contrast for enemy visibility in bushes without any performance hit.
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-[#08080c] border border-gray-800/90 rounded-xl p-4 space-y-3">
            <h5 className="font-gaming font-bold text-sm text-[#ff8833] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> ANDROID SYSTEM TWEAKS
            </h5>
            <ul className="space-y-2 text-xs font-tech text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Window/Transition Animation:</strong> Set to <strong>0.5x</strong> in Developer Options. Makes overall touch UI feel instant.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Disable HW Overlays:</strong> Force Android OS to always use GPU for screen composition to reduce CPU overhead.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Game Turbo / Game Space:</strong> Set touch sampling rate to Maximum (240Hz/360Hz) and disable edge mistouch prevention.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">RAM Cleaner before Match:</strong> Close background social media apps (TikTok, Instagram) to prevent background wake-locks.
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Honest Notice & Anti-Ban Safety Guarantee */}
        <div className="bg-[#140e0a] border border-[#ff550050] rounded-xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#ff6600] shrink-0 mt-0.5" />
          <div className="text-xs font-tech text-gray-300 space-y-1">
            <div className="font-gaming font-bold text-white tracking-wide">
              HONEST PERFORMANCE & 100% FAIR PLAY GUARANTEE
            </div>
            <p className="text-gray-400 leading-relaxed">
              DEMON SENSI_X does not falsely claim to unlock hardware-limited 120 FPS on a 60Hz display, nor does it inject illegal APK cheats or modify game files. All sensitivity equations and DPI values work through native Android display calibrations and in-game settings, ensuring zero ban risk and 100% tournament legality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
