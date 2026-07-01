/**
 * Plays a bright "find me" chime on THIS device using the Web Audio API.
 * Honest by design: there is no backend, so we can only ring the device the
 * app is open on. The UI labels remote rings accordingly.
 */
let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
      if (!Ctor) return null
      ctx = new Ctor()
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

/** Three rising pings, looped twice — recognisably a "find my device" sound. */
export function playFindChime(): void {
  const ac = getCtx()
  if (!ac) return
  const now = ac.currentTime
  const notes = [880, 1108.73, 1318.51] // A5, C#6, E6
  const master = ac.createGain()
  master.gain.value = 0.0001
  master.connect(ac.destination)

  let t = now
  for (let rep = 0; rep < 2; rep++) {
    notes.forEach((freq, i) => {
      const start = t + i * 0.16
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, start)
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.5, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35)
      osc.connect(gain).connect(master)
      osc.start(start)
      osc.stop(start + 0.4)
    })
    t += 0.7
  }
  master.gain.setValueAtTime(0.6, now)
}

/** Try to vibrate as well, where supported (mobile). */
export function buzz(): void {
  try {
    navigator.vibrate?.([120, 80, 120, 80, 220])
  } catch {
    /* no-op */
  }
}
