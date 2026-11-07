import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audio';
import demonJumpscareImg from '../assets/images/demon_jumpscare_1794057192702.jpg';
import { Volume2, VolumeX, FastForward } from 'lucide-react';

interface HorrorJumpscareProps {
  onComplete: () => void;
}

export const HorrorJumpscare: React.FC<HorrorJumpscareProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'eyes' | 'lunging' | 'fading'>('eyes');
  const [isMuted, setIsMuted] = useState(sound.isMuted);

  useEffect(() => {
    // Phase 1: Glowing demonic eyes in the darkness (0ms)
    // Play horror sound
    sound.playHorrorJumpscare();

    // Phase 2: Violent jumpscare monster lunging forward (400ms)
    const lungingTimer = setTimeout(() => {
      setPhase('lunging');
    }, 450);

    // Phase 3: Smoke fadeout transition (2400ms)
    const fadingTimer = setTimeout(() => {
      setPhase('fading');
    }, 2500);

    // Phase 4: Complete and enter dashboard (3200ms)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(lungingTimer);
      clearTimeout(fadingTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const toggleMute = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Red strobe flash overlay on violent impact */}
      {phase === 'lunging' && (
        <motion.div
          initial={{ opacity: 0.9 }}
          animate={{ opacity: [0.9, 0.15, 0.8, 0.1, 0.5, 0] }}
          transition={{ duration: 1.2, times: [0, 0.15, 0.3, 0.5, 0.7, 1] }}
          className="absolute inset-0 bg-[#ff2200] mix-blend-screen pointer-events-none z-30"
        />
      )}

      {/* Screen shake container */}
      <div
        className={`relative w-full h-full flex items-center justify-center ${
          phase === 'lunging' ? 'animate-demon-shake' : ''
        }`}
      >
        <AnimatePresence mode="wait">
          {/* Phase 1: Pitch black with intense glowing demon eyes */}
          {phase === 'eyes' && (
            <motion.div
              key="eyes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex flex-col items-center justify-center"
            >
              <div className="relative w-64 h-32 flex items-center justify-around">
                {/* Left Glowing Demon Eye */}
                <div className="relative">
                  <div className="w-8 h-4 bg-[#ff5500] rounded-full blur-[2px] shadow-[0_0_40px_#ff3300,0_0_80px_#ff0000] rotate-[-15deg] animate-pulse" />
                  <div className="absolute inset-0 w-2 h-4 bg-yellow-200 rounded-full mx-auto" />
                </div>
                {/* Right Glowing Demon Eye */}
                <div className="relative">
                  <div className="w-8 h-4 bg-[#ff5500] rounded-full blur-[2px] shadow-[0_0_40px_#ff3300,0_0_80px_#ff0000] rotate-[15deg] animate-pulse" />
                  <div className="absolute inset-0 w-2 h-4 bg-yellow-200 rounded-full mx-auto" />
                </div>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.4 }}
                className="font-gaming text-xs tracking-widest text-[#ff4400] demon-text-glow mt-4"
              >
                DEMON AWAKENING...
              </motion.p>
            </motion.div>
          )}

          {/* Phase 2: Giant Terrifying Demon Monster lunging right at the user */}
          {(phase === 'lunging' || phase === 'fading') && (
            <motion.div
              key="monster"
              initial={{ scale: 0.2, opacity: 0.2, filter: 'blur(10px)' }}
              animate={
                phase === 'lunging'
                  ? {
                      scale: [0.3, 1.35, 1.75],
                      opacity: 1,
                      filter: 'blur(0px)',
                    }
                  : {
                      scale: 1.85,
                      opacity: 0,
                      filter: 'blur(15px)',
                    }
              }
              transition={{
                duration: phase === 'lunging' ? 2.0 : 0.7,
                ease: phase === 'lunging' ? [0.1, 0.9, 0.2, 1] : 'easeIn',
              }}
              className="relative max-w-4xl max-h-[92vh] w-full h-full flex items-center justify-center p-2"
            >
              {/* Demon Monster Asset */}
              <div className="relative w-full h-full max-w-3xl flex items-center justify-center">
                <img
                  src={demonJumpscareImg}
                  alt="Demon Monster"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_60px_rgba(255,60,0,0.85)] brightness-125 contrast-125"
                />

                {/* Fiery Eye Overlays for Maximum Terror */}
                <div className="absolute top-[37%] left-[37%] w-10 h-10 bg-[#ff3300] rounded-full blur-md opacity-90 animate-ping pointer-events-none" />
                <div className="absolute top-[36%] right-[37%] w-10 h-10 bg-[#ff3300] rounded-full blur-md opacity-90 animate-ping pointer-events-none" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dark Vignette Border */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_45%,black_95%)]" />
      </div>

      {/* Atmospheric Ember Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-[#ff6a00] rounded-full blur-[1px] animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${0.8 + Math.random() * 1.5}s`,
            }}
          />
        ))}
      </div>

      {/* Top Controls: Sound toggle & Skip */}
      <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="p-2.5 rounded-full bg-black/60 border border-[#ff550050] text-[#ff7722] hover:bg-[#ff550030] transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <button
          onClick={onComplete}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-[#ff550050] text-xs font-gaming text-[#ffaa55] hover:bg-[#ff550030] transition-colors"
        >
          <span>SKIP INTRO</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Demon Audio Subtitle Flash */}
      <div className="absolute bottom-8 z-30 text-center pointer-events-none">
        <p className="font-gaming text-sm sm:text-base tracking-[0.3em] text-[#ff5500] font-black demon-text-glow uppercase">
          * ROOOOOAAARRRRR *
        </p>
        <p className="text-[10px] font-tech text-gray-500 uppercase tracking-widest mt-1">
          DEMON SENSI CORE SYNCHRONIZED
        </p>
      </div>
    </div>
  );
};
