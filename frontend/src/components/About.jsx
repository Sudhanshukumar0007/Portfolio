import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from './About.module.css';
import profilePic from '../assets/profile.png';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const tags = ['Machine Learning', 'Neural Networks', 'Computer Vision', 'NLP', 'Systems Design'];

export default function About() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  // Cinematic scroll reveal for the photo block
  const photoRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ['start end', 'end start'] });
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.5],
    ['inset(40% 20% 40% 20%)', 'inset(0% 0% 0% 0%)']
  );

  return (
    <section id="about" className={styles.about} ref={ref}>
      <div className="container">
        <motion.span
          className="section-label"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.5 }}
        >
          ABOUT
        </motion.span>

        <div className={styles.grid}>
          {/* Photo side — cinematic clip-path reveal */}
          <div className={styles.photoWrap}>
            <motion.div ref={photoRef} style={{ clipPath }} className={styles.clipReveal}>
            <div className={styles.photoFrame}>
              <img 
                src={profilePic} 
                alt="Sudhanshu Kumar" 
                loading="eager"
                fetchpriority="high"
                width="800"
                height="800"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  position: 'relative',
                  zIndex: 1
                }} 
              />
              {/* Corner decorations */}
              <div className={styles.cornerTL} />
              <div className={styles.cornerBR} />
            </div>
            </motion.div>
          </div>

          {/* Text side */}
          <div className={styles.textSide}>


            <motion.p
              className={styles.bio}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ duration: 0.5, delay: 0.22 }}
            >
              I'm a 2nd year CS student obsessed with building AI systems that actually work. Currently exploring LLMs, agentic AI, and everything in between.
            </motion.p>

            <motion.p
              className={styles.bio}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ duration: 0.5, delay: 0.28 }}
            >
              I build tools that learn — from scratch implementations of neural
              networks to LLM-powered applications that solve real problems. I
              believe in understanding the fundamentals before reaching for
              abstractions.
            </motion.p>

            <motion.p
              className={`${styles.bio} ${styles.philosophy}`}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ duration: 0.5, delay: 0.34 }}
            >
              "Build it. Break it. Understand why. Rebuild it better."
            </motion.p>

            <motion.p
              className={styles.blogMention}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ duration: 0.5, delay: 0.37 }}
            >
              I write about what I build — <a href="https://backpropdiaries.hashnode.dev/" target="_blank" rel="noopener noreferrer">Backprop Diaries ↗</a>
            </motion.p>

            <motion.div
              className={styles.tagRow}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span
                style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '11px',
                  letterSpacing: '2px',
                  color: '#475569',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                  display: 'block',
                }}
              >
                WHAT I'M INTO
              </span>
              <div className={styles.tags}>
                {tags.map((tag, i) => (
                  <motion.span
                    key={tag}
                    className="tag"
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ delay: 0.45 + i * 0.05, duration: 0.3 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
