import { useEffect, useState } from 'react';

export default function PageTransition({ onDone }) {
  const [phase, setPhase] = useState('close'); // 'close' -> 'open'

  useEffect(() => {
    // Phase 1: doors slam shut instantly (already rendered closed)
    // Phase 2: after a brief hold, split them open
    const openTimer = setTimeout(() => {
      setPhase('open');
      // Phase 3: tell parent we're done once doors finish animating out
      const doneTimer = setTimeout(onDone, 850);
      return () => clearTimeout(doneTimer);
    }, 180);

    return () => clearTimeout(openTimer);
  }, [onDone]);

  return (
    <div className={`page-transition-overlay ${phase === 'open' ? 'pt-split-open' : ''}`}>
      <div className="pt-door pt-top-door" />
      <div className="pt-door pt-bottom-door" />
    </div>
  );
}
