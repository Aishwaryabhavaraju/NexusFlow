let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Plays a distinct two-tone critical alert chime using the Web Audio API.
 * Fails gracefully if audio playback is blocked by browser autoplay policy.
 */
export function playCriticalAlertSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const pulses = [
      { start: 0, duration: 0.14, freq: 880 },
      { start: 0.18, duration: 0.14, freq: 660 },
      { start: 0.36, duration: 0.2, freq: 880 },
    ];

    pulses.forEach(({ start, duration, freq }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + start);

      gain.gain.setValueAtTime(0.001, now + start);
      gain.gain.exponentialRampToValueAtTime(0.22, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + duration + 0.01);
    });
  } catch {
    // Ignore audio errors (e.g., autoplay restrictions or unsupported environments)
  }
}
