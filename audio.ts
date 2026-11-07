/**
 * High-performance Web Audio API horror sound synthesizer and UI audio engine.
 * 100% offline, zero network assets required.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Synthesize an intense demonic horror jumpscare sound:
   * 1. Sub-bass demonic rumble & boom
   * 2. Piercing high-frequency frequency-modulated screamer riser
   * 3. Distorted harsh noise burst for terrifying impact
   */
  public playHorrorJumpscare() {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      // 1. Sub-Bass Demonic Impact Boom
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(140, now);
      bassOsc.frequency.exponentialRampToValueAtTime(25, now + 1.8);

      bassGain.gain.setValueAtTime(0.8, now);
      bassGain.gain.exponentialRampToValueAtTime(0.01, now + 2.2);

      // Lowpass for rumble
      const bassFilter = ctx.createBiquadFilter();
      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(180, now);
      bassFilter.frequency.exponentialRampToValueAtTime(60, now + 1.8);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(ctx.destination);

      bassOsc.start(now);
      bassOsc.stop(now + 2.2);

      // 2. High-Pitched Terrifying Screamer / Demon Roar (Oscillators with frequency mod)
      const screamOsc = ctx.createOscillator();
      const screamGain = ctx.createGain();
      screamOsc.type = 'sawtooth';
      // Violent pitch mod
      screamOsc.frequency.setValueAtTime(400, now);
      screamOsc.frequency.exponentialRampToValueAtTime(2400, now + 0.2);
      screamOsc.frequency.exponentialRampToValueAtTime(950, now + 0.7);
      screamOsc.frequency.exponentialRampToValueAtTime(1600, now + 1.2);
      screamOsc.frequency.exponentialRampToValueAtTime(120, now + 2.4);

      // Distortion effect via waveshaper
      const distortion = ctx.createWaveShaper();
      distortion.curve = this.makeDistortionCurve(50);
      distortion.oversample = '4x';

      screamGain.gain.setValueAtTime(0.01, now);
      screamGain.gain.linearRampToValueAtTime(0.75, now + 0.08);
      screamGain.gain.exponentialRampToValueAtTime(0.4, now + 0.8);
      screamGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

      screamOsc.connect(distortion);
      distortion.connect(screamGain);
      screamGain.connect(ctx.destination);

      screamOsc.start(now);
      screamOsc.stop(now + 2.4);

      // 3. Harsh Noise Burst (Demon Breath / Glitch static)
      const bufferSize = ctx.sampleRate * 1.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.7));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1200, now);
      noiseFilter.Q.setValueAtTime(3, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.6, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 1.4);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 1.5);

    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  /**
   * Free Fire crisp headshot marker sound (high pitched metallic ping)
   */
  public playHeadshotDing() {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, now); // High A6
      osc.frequency.exponentialRampToValueAtTime(2640, now + 0.05);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Ignore
    }
  }

  /**
   * Tactical gaming button click
   */
  public playClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore
    }
  }

  /**
   * Save / Activation tech chime
   */
  public playSuccess() {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0.2, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.25);
      });
    } catch {
      // Ignore
    }
  }

  private makeDistortionCurve(amount = 20) {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }
}

export const sound = new SoundEngine();
