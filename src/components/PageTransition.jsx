import { useEffect } from 'react';

export default function PageTransition({ onCovered, onDone }) {
  useEffect(() => {
    // 1. Doors animate from outside and seal completely shut at ~460ms
    const coveredTimer = setTimeout(() => {
      onCovered?.();
    }, 460);

    // 2. Doors hold closed until ~580ms, then animate open, finishing by ~1050ms
    const doneTimer = setTimeout(() => {
      onDone?.();
    }, 1060);

    return () => {
      clearTimeout(coveredTimer);
      clearTimeout(doneTimer);
    };
  }, [onCovered, onDone]);

  return (
    <div className="page-transition-overlay">
      <div className="pt-door pt-top-door" />
      <div className="pt-door pt-bottom-door" />
    </div>
  );
}
