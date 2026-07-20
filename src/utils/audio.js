// Cyberpunk Web Audio API Synthesizer
// Provides dynamic sound synthesis to avoid loading external audio files.

let audioCtx = null;
let isMuted = false;

// Initialize audio context lazily on user gesture
const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const setMuted = (muted) => {
  isMuted = muted;
};

export const getMuted = () => isMuted;

// Standard blip/tick on hover
export const playHoverTick = () => {
  if (isMuted) return;
  try {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    console.error('Audio play error:', e);
  }
};

// Selection beep
export const playSelectClick = () => {
  if (isMuted) return;
  try {
    const ctx = initAudio();
    
    // First note
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(800, ctx.currentTime);
    gain1.gain.setValueAtTime(0.04, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.1);

    // Second note (slightly delayed)
    setTimeout(() => {
      if (isMuted) return;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1400, ctx.currentTime);
      gain2.gain.setValueAtTime(0.04, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.15);
    }, 50);

  } catch (e) {
    console.error('Audio play error:', e);
  }
};

// Access granted sweep
export const playAccessGranted = () => {
  if (isMuted) return;
  try {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

    // Low pass filter to make it sound warmer/more digital
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    console.error('Audio play error:', e);
  }
};

// Synth boot error or alert
export const playErrorBeep = () => {
  if (isMuted) return;
  try {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.error('Audio play error:', e);
  }
};

// Glitch static sweep
export const playGlitchSound = () => {
  if (isMuted) return;
  try {
    const ctx = initAudio();
    const bufferSize = ctx.sampleRate * 0.15; // 150ms buffer
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Fill buffer with white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to shape the noise
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch (e) {
    console.error('Audio play error:', e);
  }
};

// Booting background loop (synthesizing a turbine drone)
let bootOsc1 = null;
let bootOsc2 = null;
let bootGain = null;

export const startBootHum = () => {
  if (isMuted) return;
  try {
    const ctx = initAudio();
    bootOsc1 = ctx.createOscillator();
    bootOsc2 = ctx.createOscillator();
    bootGain = ctx.createGain();

    bootOsc1.type = 'sawtooth';
    bootOsc1.frequency.setValueAtTime(55, ctx.currentTime); // Low A
    bootOsc1.frequency.linearRampToValueAtTime(110, ctx.currentTime + 3.0); // Ramup to 110Hz

    bootOsc2.type = 'sine';
    bootOsc2.frequency.setValueAtTime(55.5, ctx.currentTime); // Detuned frequency for beating effect
    bootOsc2.frequency.linearRampToValueAtTime(110.5, ctx.currentTime + 3.0);

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(150, ctx.currentTime);
    lowpass.frequency.linearRampToValueAtTime(350, ctx.currentTime + 3.0);

    bootGain.gain.setValueAtTime(0.0, ctx.currentTime);
    bootGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.5); // Fade in

    bootOsc1.connect(lowpass);
    bootOsc2.connect(lowpass);
    lowpass.connect(bootGain);
    bootGain.connect(ctx.destination);

    bootOsc1.start();
    bootOsc2.start();
  } catch (e) {
    console.error('Audio play error:', e);
  }
};

export const stopBootHum = () => {
  try {
    if (bootGain && audioCtx) {
      bootGain.gain.linearRampToValueAtTime(0.0, audioCtx.currentTime + 0.3);
      setTimeout(() => {
        if (bootOsc1) bootOsc1.stop();
        if (bootOsc2) bootOsc2.stop();
        bootOsc1 = null;
        bootOsc2 = null;
        bootGain = null;
      }, 300);
    }
  } catch (e) {
    console.error('Audio stop error:', e);
  }
};
