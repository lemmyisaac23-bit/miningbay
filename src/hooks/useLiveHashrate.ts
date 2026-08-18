import { useEffect, useState } from "react";

const MIN = 14;
const MAX = 21;
const TICK_MS = 2000;
const POINTS = 12;

function nextRate() {
  return Math.round((MIN + Math.random() * (MAX - MIN)) * 10) / 10;
}

export function useLiveHashrate() {
  const [value, setValue] = useState(nextRate);
  const [history, setHistory] = useState(() => {
    const start = nextRate();
    return Array.from({ length: POINTS }, (_, i) => ({
      t: `${(i + 1) * 2}s`,
      v: start,
    }));
  });

  useEffect(() => {
    const id = window.setInterval(() => {
      const v = nextRate();
      setValue(v);
      setHistory((prev) => {
        const next = [...prev.slice(1), { t: "", v }];
        return next.map((point, i) => ({
          t: `${(i + 1) * 2}s`,
          v: point.v,
        }));
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  return { value, history };
}
