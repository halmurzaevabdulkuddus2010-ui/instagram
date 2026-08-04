// soundEngine.js - Dynamic Web Audio API Synthesizer with unique music for every video Reel
class ReelSoundEngine {
  constructor() {
    this.audioCtx = null;
    this.timer = null;
    this.currentTrackId = null;
    this.isPlaying = false;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isPlaying = false;
    this.currentTrackId = null;
  }

  playTrack(genre = 'general', reelId = 'default') {
    this.init();
    if (!this.audioCtx) return;
    if (this.isPlaying && this.currentTrackId === `${genre}_${reelId}`) return;

    this.stop();
    this.currentTrackId = `${genre}_${reelId}`;
    this.isPlaying = true;

    // Generate unique seed from reelId for custom pitch and melody variations
    let hash = 0;
    for (let i = 0; i < reelId.length; i++) {
      hash = reelId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);

    // Dynamic scale selection and note shift per video
    let baseFreqs = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C Major
    let oscType = 'sine';
    let tempo = 135 + (seed % 35); // 135 - 170 BPM

    if (genre === 'football' || genre === 'sports') {
      baseFreqs = [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33]; // Hype Stadium
      oscType = (seed % 2 === 0) ? 'triangle' : 'sawtooth';
      tempo = 140 + (seed % 25);
    } else if (genre === 'cartoons' || genre === 'masha') {
      baseFreqs = [329.63, 392.00, 440.00, 493.88, 523.25, 659.25, 783.99]; // Playful Cartoon
      oscType = 'sine';
      tempo = 150 + (seed % 30);
    } else if (genre === 'a4') {
      baseFreqs = [174.61, 196.00, 220.00, 261.63, 293.66, 349.23, 440.00]; // A4 Hype Trap
      oscType = 'square';
      tempo = 155 + (seed % 20);
    } else if (genre === 'cars') {
      baseFreqs = [98.00, 110.00, 130.81, 146.83, 164.81, 196.00]; // Synthwave Drift Phonk
      oscType = 'sawtooth';
      tempo = 145 + (seed % 25);
    } else if (genre === 'nature') {
      baseFreqs = [196.00, 220.00, 261.63, 329.63, 392.00, 440.00]; // Chill Acoustic
      oscType = 'sine';
      tempo = 110 + (seed % 20);
    }

    // Shift notes slightly per reelId so each Reel has a completely custom musical scale
    const pitchShift = 1 + ((seed % 7) * 0.05); // pitch offset
    const scale = baseFreqs.map(f => f * pitchShift);

    let step = 0;
    const intervalMs = Math.round((60 / tempo) * 1000 / 4);

    const playStep = () => {
      if (!this.audioCtx || this.audioCtx.state === 'closed' || !this.isPlaying) return;
      const now = this.audioCtx.currentTime;

      // Master Gain
      const masterGain = this.audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.16, now);
      masterGain.connect(this.audioCtx.destination);

      // Kick drum
      if (step % 4 === 0) {
        const kick = this.audioCtx.createOscillator();
        const kickGain = this.audioCtx.createGain();
        const startPitch = 140 + (seed % 50);
        kick.frequency.setValueAtTime(startPitch, now);
        kick.frequency.exponentialRampToValueAtTime(30, now + 0.12);
        kickGain.gain.setValueAtTime(0.45, now);
        kickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        kick.connect(kickGain);
        kickGain.connect(masterGain);
        kick.start(now);
        kick.stop(now + 0.12);
      }

      // Snare / Hi-hat
      if (step % 2 === 1) {
        const hihat = this.audioCtx.createOscillator();
        const hihatGain = this.audioCtx.createGain();
        hihat.type = 'triangle';
        hihat.frequency.setValueAtTime(1300 + (seed % 400), now);
        hihatGain.gain.setValueAtTime(0.08, now);
        hihatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        hihat.connect(hihatGain);
        hihatGain.connect(masterGain);
        hihat.start(now);
        hihat.stop(now + 0.05);
      }

      // Melody synth note
      const noteIdx = (step + (seed % 5)) % scale.length;
      const noteFreq = scale[noteIdx];
      const synth = this.audioCtx.createOscillator();
      const synthGain = this.audioCtx.createGain();
      synth.type = oscType;
      synth.frequency.setValueAtTime(noteFreq, now);
      
      synthGain.gain.setValueAtTime(0.12, now);
      synthGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      synth.connect(synthGain);
      synthGain.connect(masterGain);
      synth.start(now);
      synth.stop(now + 0.2);

      step = (step + 1) % 16;
    };

    this.timer = setInterval(playStep, intervalMs);
  }
}

export const soundEngine = new ReelSoundEngine();
