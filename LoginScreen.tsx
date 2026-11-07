import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Eye, EyeOff, Flame, ShieldAlert, Terminal } from 'lucide-react';
import { sound } from '../utils/audio';
import demonLogo from '../assets/images/demon_sensi_logo_1794057205555.jpg';

interface LoginScreenProps {
  onSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CORRECT_PASS = 'hiruwa001';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();

    if (!password.trim()) {
      setError(true);
      setErrorMessage('ACCESS DENIED: Enter security passkey');
      return;
    }

    if (password === CORRECT_PASS) {
      setError(false);
      setIsSubmitting(true);
      // Trigger success flow -> jumpscare
      setTimeout(() => {
        onSuccess();
      }, 300);
    } else {
      setError(true);
      setErrorMessage('INVALID PASSKEY: Access rejected by Demon Core');
      // Shake animation trigger
      setTimeout(() => {
        setError(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ff450022] via-[#0b0b0f] to-[#050507] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background ambient flame grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ff550008_1px,transparent_1px),linear-gradient(to_bottom,#ff550008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Atmospheric corner glow */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#ff440026] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#ff6a0026] rounded-full blur-[100px] pointer-events-none" />

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div className="relative bg-[#0d0d14]/90 backdrop-blur-xl border border-[#ff55003b] rounded-2xl p-6 sm:p-8 demon-glow">
          {/* Top Gaming Accent bar */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#ff6a00] to-transparent" />

          {/* Demon Emblem Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <motion.div
              animate={{
                rotate: [0, 1, -1, 0],
                scale: [1, 1.02, 0.99, 1],
              }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="relative mb-3"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#ff5500] shadow-[0_0_35px_rgba(255,85,0,0.5)] relative">
                <img
                  src={demonLogo}
                  alt="DEMON SENSI_X"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#ff5500] text-black text-[10px] font-gaming font-black px-2 py-0.5 rounded border border-black shadow">
                V4.8X
              </div>
            </motion.div>

            <h1 className="text-2xl sm:text-3xl font-gaming font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-[#ff944d] to-[#ff4500] demon-text-glow">
              DEMON SENSI_X
            </h1>
            <p className="text-xs font-tech tracking-widest text-[#ff884d] uppercase mt-1 flex items-center gap-1.5 font-semibold">
              <Flame className="w-3.5 h-3.5 text-[#ff5500] animate-pulse" />
              Free Fire Esports Sensitivity Protocol
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-tech uppercase text-gray-400">
                <span className="flex items-center gap-1 text-gray-300 font-semibold">
                  <Lock className="w-3.5 h-3.5 text-[#ff5500]" /> Master Passkey
                </span>
                <span className="text-[11px] text-[#ff6600]/80 font-mono tracking-wider">
                  RESTRICTED ACCESS
                </span>
              </div>

              <div
                className={`relative flex items-center bg-[#07070a] border rounded-xl transition-all duration-300 ${
                  error
                    ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-bounce'
                    : 'border-[#ff550040] focus-within:border-[#ff5500] focus-within:shadow-[0_0_20px_rgba(255,85,0,0.35)]'
                }`}
              >
                <div className="pl-3.5 text-gray-500">
                  <Terminal className="w-4 h-4 text-[#ff7722]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secret passkey..."
                  className="w-full bg-transparent px-3 py-3 text-sm font-mono text-white placeholder-gray-600 focus:outline-none tracking-wider"
                  autoComplete="current-password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-3.5 text-gray-400 hover:text-[#ff7722] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-xs text-red-400 font-tech font-semibold bg-red-950/40 border border-red-800/60 rounded-lg px-2.5 py-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Animated Login Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-2 relative group overflow-hidden rounded-xl p-[1px] font-gaming font-bold tracking-wider uppercase text-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff3300] via-[#ff7700] to-[#ff2200] rounded-xl transition-all group-hover:opacity-100 opacity-90 animate-flame-pulse" />
              <div className="relative px-6 py-3.5 bg-gradient-to-b from-[#1c120c] to-[#0e0a08] rounded-xl flex items-center justify-center gap-2 text-white group-hover:from-[#2a170b] transition-all">
                <Flame className="w-4 h-4 text-[#ff7700] group-hover:scale-125 transition-transform" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-[#ff9955] demon-text-glow font-black">
                  {isSubmitting ? 'AWAKENING DEMON...' : 'INITIALIZE DEMON CORE'}
                </span>
              </div>
            </motion.button>
          </form>

          {/* Offline Security Footer */}
          <div className="mt-6 pt-4 border-t border-[#ff550020] flex items-center justify-between text-[11px] text-gray-400 font-tech">
            <span className="flex items-center gap-1 text-[#ff7700]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              100% OFFLINE SECURE
            </span>
            <span className="text-gray-500">OB44+ OPTIMIZED</span>
          </div>
        </div>

        {/* Warning text */}
        <p className="text-center text-[11px] font-tech text-gray-500 mt-4 tracking-wider">
          DEMON SENSI_X ENGINE &bull; NATIVE ANDROID SYSTEM TUNER
        </p>
      </motion.div>
    </div>
  );
};
