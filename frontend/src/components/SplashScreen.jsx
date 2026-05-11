import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SplashScreen.module.css';

const NAME = 'SUDHANSHU KUMAR';

function randomEdgePos() {
  const edge = Math.floor(Math.random() * 4);
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  switch (edge) {
    case 0: return { x: Math.random() * vw - vw / 2, y: -vh / 2 - 50 };     // top
    case 1: return { x: vw / 2 + 50, y: Math.random() * vh - vh / 2 };       // right
    case 2: return { x: Math.random() * vw - vw / 2, y: vh / 2 + 50 };       // bottom
    default: return { x: -vw / 2 - 50, y: Math.random() * vh - vh / 2 };     // left
  }
}

const letters = NAME.split('').map((char, i) => ({
  char,
  id: i,
  initial: randomEdgePos(),
  // Scrambled starting position near final with offset
  scramble: {
    x: (Math.random() - 0.5) * 300,
    y: (Math.random() - 0.5) * 200,
    rotate: (Math.random() - 0.5) * 180,
    opacity: 0,
  },
}));

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('fly-in'); // fly-in | settled | exit

  useEffect(() => {
    // fly-in: 0 - 800ms
    // settled: 800ms - 1200ms (pause)
    // exit: 1200ms - 1700ms

    const t1 = setTimeout(() => setPhase('settled'), 800);
    const t2 = setTimeout(() => setPhase('exit'), 1300);
    const t3 = setTimeout(() => onComplete(), 1800);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className={styles.splash}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className={styles.nameContainer}>
            {/* Space character handled separately */}
            {letters.map((letter, i) => {
              const delay = i * 0.025;

              const flyInTarget = { x: 0, y: 0, rotate: 0, opacity: 1 };
              const settledTarget = { x: 0, y: 0, rotate: 0, opacity: 1 };
              const exitTarget = { y: -60, opacity: 0 };

              let animate;
              if (phase === 'fly-in') animate = flyInTarget;
              else if (phase === 'settled') animate = settledTarget;
              else animate = exitTarget;

              return (
                <motion.span
                  key={letter.id}
                  className={styles.letter}
                  style={{ display: letter.char === ' ' ? 'inline-block' : 'inline-block', width: letter.char === ' ' ? '0.5em' : 'auto' }}
                  initial={letter.scramble}
                  animate={animate}
                  transition={
                    phase === 'exit'
                      ? { duration: 0.35, ease: [0.4, 0, 1, 1], delay: i * 0.01 }
                      : {
                          type: 'spring',
                          stiffness: 160,
                          damping: 22,
                          delay,
                        }
                  }
                >
                  {letter.char}
                </motion.span>
              );
            })}
          </div>

          <motion.div
            className={styles.sub}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'fly-in' ? 0 : phase === 'settled' ? 0.5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', letterSpacing: '3px' }}>
              PORTFOLIO 2025
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
