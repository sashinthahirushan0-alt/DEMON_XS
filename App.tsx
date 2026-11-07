/**
 * DEMON SENSI_X
 * Premium Free Fire Sensitivity Tuner & Native Android Application Engine
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Sliders,
  Activity,
  Download,
  Volume2,
  VolumeX,
  LogOut,
  Shield,
  Smartphone,
  Sparkles
} from 'lucide-react';
import { LoginScreen } from './components/LoginScreen';
import { HorrorJumpscare } from './components/HorrorJumpscare';
import { SensitivityTuner } from './components/SensitivityTuner';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { AndroidProjectGenerator } from './components/AndroidProjectGenerator';
import { sound } from './utils/audio';
import demonLogo from './assets/images/demon_sensi_logo_1794057205555.jpg';

export default function App() {
  // App flow: 'login' -> 'jumpscare' -> 'dashboard'
  const [authStep, setAuthStep] = useState<'login' | 'jumpscare' | 'dashboard'>('login');
  const [activeNav, setActiveNav] = useState<'sensitivity' | 'performance' | 'androidProject'>('sensitivity');
  const [isMuted, setIsMuted] = useState(sound.isMuted);

  const handleLoginSuccess = () => {
    setAuthStep('jumpscare');
  };

  const handleJumpscareComplete = () => {
    setAuthStep('dashboard');
  };

  const handleSummonDemon = () => {
    sound.playClick();
    setAuthStep('jumpscare');
  };

  const handleLogout = () => {
    sound.playClick();
    setAuthStep('login');
  };

  const toggleMute = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Step 1: Password Login Screen */}
      {authStep === 'login' && (
        <LoginScreen onSuccess={handleLoginSuccess} />
      )}

      {/* Step 2: Horror Demon Jumpscare Intro */}
      {authStep === 'jumpscare' && (
        <HorrorJumpscare onComplete={handleJumpscareComplete} />
      )}

      {/* Step 3: Main Dashboard */}
      {authStep === 'dashboard' && (
        <div className="flex-1 flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#170a04] via-[#09090d] to-[#050507]">
          {/* Top Navbar */}
          <header className="sticky top-0 z-30 bg-[#0b0b10]/90 backdrop-blur-md border-b border-[#ff550025] px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              {/* Brand Logo & Name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#ff5500] shadow-[0_0_15px_rgba(255,85,0,0.4)]">
                  <img
                    src={demonLogo}
                    alt="DEMON SENSI_X"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-gaming font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-200 to-[#ff5500] demon-text-glow">
                      DEMON SENSI_X
                    </span>
                    <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-gaming font-black bg-[#ff5500] text-black">
                      V4.8X
                    </span>
                  </div>
                  <p className="text-[10px] font-tech text-[#ff8844] tracking-widest uppercase flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Offline Gaming Engine
                  </p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2">
                {/* Re-trigger Jumpscare */}
                <button
                  onClick={handleSummonDemon}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#200904] hover:bg-[#300e06] border border-[#ff330060] text-xs font-gaming text-[#ff6622] transition-colors shadow-[0_0_12px_rgba(255,50,0,0.25)]"
                  title="Summon Demon Jumpscare"
                >
                  <Flame className="w-3.5 h-3.5 text-[#ff4400]" />
                  <span>SUMMON DEMON</span>
                </button>

                {/* Mute button */}
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-xl bg-[#14141c] hover:bg-[#1e1e2b] border border-gray-800 text-gray-300 transition-colors"
                  title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-gray-500" /> : <Volume2 className="w-4 h-4 text-[#ff7722]" />}
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#14141c] hover:bg-[#1e1e2b] border border-gray-800 text-xs font-tech text-gray-300 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-gray-400" />
                  <span className="hidden sm:inline">LOCK</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Navigation Tabs */}
          <div className="bg-[#0b0b10] border-b border-gray-800/80 px-4">
            <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-3 overflow-x-auto py-2.5">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveNav('sensitivity');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-gaming tracking-wide transition-all whitespace-nowrap ${
                  activeNav === 'sensitivity'
                    ? 'bg-[#ff5500] text-black font-black shadow-[0_0_18px_rgba(255,85,0,0.4)]'
                    : 'text-gray-400 hover:text-white hover:bg-[#14141c]'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>FREE FIRE SENSITIVITY</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveNav('performance');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-gaming tracking-wide transition-all whitespace-nowrap ${
                  activeNav === 'performance'
                    ? 'bg-[#ff5500] text-black font-black shadow-[0_0_18px_rgba(255,85,0,0.4)]'
                    : 'text-gray-400 hover:text-white hover:bg-[#14141c]'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>FPS & HARDWARE MONITOR</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveNav('androidProject');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-gaming tracking-wide transition-all whitespace-nowrap ${
                  activeNav === 'androidProject'
                    ? 'bg-[#ff5500] text-black font-black shadow-[0_0_18px_rgba(255,85,0,0.4)]'
                    : 'text-gray-400 hover:text-white hover:bg-[#14141c]'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>NATIVE ANDROID APK & KOTLIN</span>
              </button>
            </div>
          </div>

          {/* Main Body Content */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-12">
            <AnimatePresence mode="wait">
              {activeNav === 'sensitivity' && (
                <motion.div
                  key="sensitivity"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <SensitivityTuner onSummonDemon={handleSummonDemon} />
                </motion.div>
              )}

              {activeNav === 'performance' && (
                <motion.div
                  key="performance"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <PerformanceDashboard />
                </motion.div>
              )}

              {activeNav === 'androidProject' && (
                <motion.div
                  key="androidProject"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <AndroidProjectGenerator />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Bottom Footer */}
          <footer className="border-t border-gray-900 bg-[#060608] px-4 py-4 text-center">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-tech text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#ff5500]" />
                <span className="text-gray-400">DEMON SENSI_X &bull; 100% Offline & Bull-Proof Anti-Ban</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span>NO ADS</span>
                <span>ZERO TELEMETRY</span>
                <span>LIGHTWEIGHT &lt;100MB</span>
                <span className="text-[#ff6600]">ANDROID 13 READY</span>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
