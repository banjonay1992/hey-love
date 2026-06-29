import { useEffect, useRef, useState } from 'react';

const COUNT = 34;
const BASE = 0.1;

function dbToLevel(db?: number) {
  if (db == null || !isFinite(db)) return undefined;
  // Metering is roughly -60 (quiet) .. 0 (loud) dB.
  return Math.min(1, Math.max(0.05, (db + 55) / 55));
}

/**
 * Produces a rolling array of recent audio levels so a waveform can flow.
 * Uses real metering when available; otherwise breathes gently so the
 * interface still feels alive (e.g. in the web preview).
 */
export function useLevels(active: boolean, metering?: number) {
  const [levels, setLevels] = useState<number[]>(() => Array(COUNT).fill(BASE));
  const meterRef = useRef<number | undefined>(undefined);
  const phase = useRef(0);

  meterRef.current = dbToLevel(metering);

  useEffect(() => {
    if (!active) {
      setLevels((prev) => prev.map((v) => v * 0.6 + BASE * 0.4));
      return;
    }
    const id = setInterval(() => {
      phase.current += 0.45;
      const measured = meterRef.current;
      const synthetic = 0.3 + Math.abs(Math.sin(phase.current)) * 0.45 + Math.random() * 0.18;
      const next = measured ?? synthetic;
      setLevels((prev) => [...prev.slice(1), Math.min(1, next)]);
    }, 90);
    return () => clearInterval(id);
  }, [active]);

  return levels;
}
