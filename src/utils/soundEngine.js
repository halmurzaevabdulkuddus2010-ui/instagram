// soundEngine.js - Web Audio API Synthesizer and Sound Manager for Reels & Posts
class ReelSoundEngine {
  constructor() {
    this.audioCtx = null;
    this.timer = null;
    this.currentGenre = null;
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
    this.currentGenre = null;
  }

  playTrack(genre = 'general') {
    this.init();
    if (!this.audioCtx) return;
    if (this.isPlaying && this.currentGenre === genre) return;

    this.stop();
    this.currentGenre = genre;
    this.isPlaying = true;

    let step = 0;
    const playStep = () => {
      if (!this.audioCtx || this.audioCtx.state === 'closed' || !this.isPlaying) return;
      const now = this.audioCtx.currentTime;

      // Master Gain
      const masterGain = this.audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.18, now);
      masterGain.connect(this.audioCtx.destination);

      // Kick drum on beats 0, 4, 8, 12
      if (step % 4 === 0) {
        const kick = this.audioCtx.createOscillator();
        const kickGain = this.audioCtx.createGain();
        kick.frequency.setValueAtTime(160, now);
        kick.frequency.exponentialRampToValueAtTime(30, now + 0.14);
        kickGain.gain.setValueAtTime(0.5, now);
        kickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
        kick.connect(kickGain);
        kickGain.connect(masterGain);
        kick.start(now);
        kick.stop(now + 0.14);
      }

      // Snare / Hi-hat on odd beats
      if (step % 2 === 1) {
        const hihat = this.audioCtx.createOscillator();
        const hihatGain = this.audioCtx.createGain();
        hihat.type = 'triangle';
        hihat.frequency.setValueAtTime(1400, now);
        hihatGain.gain.setValueAtTime(0.09, now);
        hihatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        hihat.connect(hihatGain);
        hihatGain.connect(masterGain);
        hihat.start(now);
        hihat.stop(now + 0.05);
      }

      // Synth Melody Note
      let scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C Pentatonic
      let type = 'sine';

      if (genre === 'football' || genre === 'sports') {
        scale = [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33]; // A minor pentatonic hype
        type = 'triangle';
      } else if (genre === 'cartoons' || genre === 'masha') {
        scale = [329.63, 392.00, 440.00, 493.88, 523.25, 659.25]; // Playful major
        type = 'sine';
      } else if (genre === 'a4') {
        scale = [174.61, 196.00, 220.00, 261.63, 293.66, 349.23]; // Energetic synth bass
        type = 'square';
      } else if (genre === 'cars') {
        scale = [110.00, 130.81, 146.83, 164.81, 196.00]; // Deep Synthwave
        type = 'sawtooth';
      }

      const noteFreq = scale[step % scale.length];
      const synth = this.audioCtx.createOscillator();
      const synthGain = this.audioCtx.createGain();
      synth.type = type;
      synth.frequency.setValueAtTime(noteFreq, now);
      
      synthGain.gain.setValueAtTime(0.12, now);
      synthGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      synth.connect(synthGain);
      synthGain.connect(masterGain);
      synth.start(now);
      synth.stop(now + 0.22);

      step = (step + 1) % 16;
    };

    this.timer = setInterval(playStep, 140);
  }
}

export const soundEngine = new ReelSoundEngine();
