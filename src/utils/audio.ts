/**
 * Cozy Web Audio API Sound Synthesizer
 * Produces Animalese speech, charming Animal Crossing acoustic BGM, and game SFX
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private isBgmPlaying = false;
  private bgmTimeout: number | null = null;
  public isMuted = false;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgmGain) {
      this.bgmGain.gain.value = this.isMuted ? 0 : 0.08;
    }
    return this.isMuted;
  }

  // --- ANIMALESE SPEECH SYNTHESIS ---
  public playAnimalese(char: string, pitchShift = 1.0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pitch based on char code to create varied cute chatter
      const code = char.charCodeAt(0) || 60;
      const baseFreq = 420 + ((code * 17) % 350);
      const freq = baseFreq * pitchShift;

      osc.type = code % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * (1 + (Math.random() * 0.3 - 0.15)), this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.065);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch {
      // Audio fallback
    }
  }

  // --- SOUND EFFECTS ---
  public playFootstep(surface: 'grass' | 'sand' | 'stone' | 'wood') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      const freqs = {
        grass: 180 + Math.random() * 40,
        sand: 280 + Math.random() * 50,
        stone: 420 + Math.random() * 60,
        wood: 260 + Math.random() * 30,
      };

      osc.type = surface === 'sand' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freqs[surface], now);
      osc.frequency.exponentialRampToValueAtTime(freqs[surface] * 0.7, now + 0.04);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  public playCoin() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(987.77, now); // B5
    osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6
    osc2.frequency.setValueAtTime(1975.53, now); // B6

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  }

  public playSplash() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Low frequency pop + high burst
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playBiteNibble() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playNetSwoosh() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.linearRampToValueAtTime(480, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.18);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  public playDig() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.12);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playTreeShake() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [0, 0.06, 0.12].forEach((offset, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280 + idx * 40, now + offset);
      osc.frequency.exponentialRampToValueAtTime(190, now + offset + 0.08);
      gain.gain.setValueAtTime(0.05, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.08);
    });
  }

  public playCelebrationFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [
      { note: 523.25, time: 0, dur: 0.12 },    // C5
      { note: 659.25, time: 0.12, dur: 0.12 }, // E5
      { note: 783.99, time: 0.24, dur: 0.14 }, // G5
      { note: 1046.50, time: 0.38, dur: 0.4 }, // C6
    ];

    const now = this.ctx.currentTime;
    notes.forEach((n) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.note, now + n.time);

      gain.gain.setValueAtTime(0.12, now + n.time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + n.time);
      osc.stop(now + n.time + n.dur);
    });
  }

  public playDesignerChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880, now + 0.1); // A5

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  public playBalloonPop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.15);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  // --- COZY ANIMAL CROSSING SYNTHESIZED BGM ---
  public startBGM() {
    if (this.isBgmPlaying) return;
    this.init();
    if (!this.ctx) return;

    this.isBgmPlaying = true;
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = this.isMuted ? 0 : 0.055;
    this.bgmGain.connect(this.ctx.destination);

    // Warm peaceful chord progression (Cmaj7 -> Fmaj7 -> Dm7 -> G7)
    // with gentle acoustic pluck notes
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // C E G B
      [349.23, 440.00, 523.25, 659.25], // F A C E
      [293.66, 349.23, 440.00, 523.25], // D F A C
      [392.00, 493.88, 587.33, 698.46], // G B D F
    ];

    let chordIdx = 0;
    const playBar = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;

      const chord = chords[chordIdx % chords.length];
      chordIdx++;

      // Arpeggiate chord softly
      chord.forEach((freq, noteIdx) => {
        if (!this.ctx || !this.bgmGain) return;
        const noteTime = this.ctx.currentTime + noteIdx * 0.45;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        noteGain.gain.setValueAtTime(0.04, noteTime);
        noteGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.7);

        osc.connect(noteGain);
        noteGain.connect(this.bgmGain);

        osc.start(noteTime);
        osc.stop(noteTime + 0.75);
      });

      // Play soft top melody note
      const melodyFreq = chord[Math.floor(Math.random() * chord.length)] * 2;
      const melTime = this.ctx.currentTime + 1.2;
      const melOsc = this.ctx.createOscillator();
      const melGain = this.ctx.createGain();
      melOsc.type = 'triangle';
      melOsc.frequency.setValueAtTime(melodyFreq, melTime);
      melGain.gain.setValueAtTime(0.03, melTime);
      melGain.gain.exponentialRampToValueAtTime(0.001, melTime + 0.5);
      melOsc.connect(melGain);
      melGain.connect(this.bgmGain);
      melOsc.start(melTime);
      melOsc.stop(melTime + 0.55);

      this.bgmTimeout = window.setTimeout(playBar, 2000);
    };

    playBar();
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimeout) {
      clearTimeout(this.bgmTimeout);
      this.bgmTimeout = null;
    }
  }
}

export const soundManager = new SoundManager();
