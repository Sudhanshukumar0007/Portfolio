import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import NeuralNetBg from '../components/NeuralNetBg';
import { supabase } from '../supabaseClient';
import styles from './ProjectsPage.module.css';

const projects = [
  {
    num: '01',
    title: 'ShadowByte',
    subtitle: 'CognitiveSB — AI Study Intelligence',
    description:
      'An intelligent study companion that transforms uploaded documents into a rich, interactive learning environment using multi-LLM orchestration, knowledge graphs, and adaptive quiz generation.',
    tech: ['Python', 'Flask', 'React', 'Groq API', 'LangChain', 'Neo4j'],
    github: 'https://github.com/Sudhanshukumar0007/CognitiveSB',
    inProgress: false,
    color: '#D97706',
    built: [
      'Multi-LLM pipeline routing prompts across Groq, OpenAI, and local models',
      'RAG-based document Q&A with persistent ChromaDB vector store',
      'Interactive Neo4j knowledge graph visualised with React Flow',
      'Adaptive flashcard and quiz generator with spaced-repetition scoring',
      'Session-aware chat with full conversation memory and topic threading',
    ],
  },
  {
    num: '02',
    title: 'NervSys',
    subtitle: 'Neural Network Framework from Scratch',
    description:
      'A pure NumPy modular neural network library implementing every component by hand — forward pass, backpropagation, optimisers, and activations — to build deep understanding before reaching for abstractions.',
    tech: ['Python', 'NumPy', 'Matplotlib', 'Jupyter'],
    github: 'https://github.com/Sudhanshukumar0007',
    inProgress: true,
    color: '#4338CA',
    built: [
      'Dense, Conv2D, and Dropout layers with clean modular API',
      'Backpropagation engine with analytical gradient verification',
      'SGD, Adam, and RMSprop optimisers from first principles',
      'Batch normalisation and He/Xavier weight initialisation',
      'Training visualisation: loss curves, accuracy plots, confusion matrices',
    ],
  },
  {
    num: '03',
    title: 'Aira',
    subtitle: 'Adaptive Intelligent Research Assistant',
    description:
      'A conversational AI research assistant with persistent memory, context awareness, and multi-document Q&A. Combines a RAG pipeline with a sleek interface for seamless knowledge retrieval across sessions.',
    tech: ['Python', 'FastAPI', 'React', 'ChromaDB', 'OpenAI API'],
    github: 'https://github.com/Sudhanshukumar0007/Project_Aira',
    inProgress: true,
    color: '#1C1917',
    built: [
      'Hybrid semantic + keyword search over user document collections',
      'Persistent cross-session memory with entity extraction',
      'Streaming LLM responses via FastAPI Server-Sent Events',
      'Source citation with direct quotes from retrieved documents',
      'Multi-format document ingestion: PDF, DOCX, Markdown, plain text',
    ],
  },
];

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit:    { opacity: 0, transition: { duration: 0.3 } },
};

const cardVariants = {
  offscreen: { y: 60, opacity: 0 },
  onscreen: { y: 0, opacity: 1, transition: { type: 'spring', bounce: 0.3, duration: 0.7 } },
};

const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

export default function ProjectsPage() {
  const [data, setData] = useState(projects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: dbProjects, error } = await supabase
          .from('projects')
          .select('*')
          .order('order_index', { ascending: true });
        
        if (!error && dbProjects && dbProjects.length > 0) {
          setData(dbProjects.map((p, i) => ({
            num: `0${i + 1}`.slice(-2),
            title: p.title,
            subtitle: p.subtitle,
            description: p.description,
            tech: p.tech_stack || [],
            github: p.github_url,
            demo: p.demo_url,
            inProgress: p.status === 'in progress' || p.status === 'In Progress',
            color: i === 0 ? '#D97706' : i === 1 ? '#4338CA' : '#1C1917',
            built: p.bullets || [],
          })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <motion.div className={styles.page} {...fadeIn}>
      {/* Neural network ambient bg */}
      <div className={styles.bgWrap}>
        <NeuralNetBg speedMultiplier={0.6} />
      </div>

      <div className={styles.inner}>
        {/* Back link */}
        <Link to="/" className={styles.back}>← Back to Home</Link>

        <motion.span
          className="section-label"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          Projects
        </motion.span>



        <motion.p
          className={styles.subheading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
        >
          End-to-end projects built to understand, not just to ship.
        </motion.p>

        {loading ? (
          <div className={styles.cards}>
            <div className={styles.skeletonCard} style={{ height: 400, background: 'var(--stone)', opacity: 0.1, borderRadius: '8px' }} />
            <div className={styles.skeletonCard} style={{ height: 400, background: 'var(--stone)', opacity: 0.1, borderRadius: '8px', marginTop: 20 }} />
          </div>
        ) : (
          <div className={styles.cards}>
            {data.map((p, i) => (
              <ProjectCard key={p.title} project={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      className={`${styles.card} ${hovered ? styles.cardHovered : ''}`}
      variants={cardVariants}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.15 }}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        if (e.target.closest('a')) return;
        window.location.href = `/projects/${slugify(project.title)}`;
      }}
      role="button"
      tabIndex={0}
    >
      {hovered && <div className={styles.signalBorder} />}

      <div className={styles.cardHeader}>
        <span className={styles.cardNum} style={{ color: project.color }}>{project.num}</span>
        <div>
          <div className={styles.titleRow}>
            <h2 className={styles.cardTitle}>{project.title}</h2>
            {project.inProgress && <span className={styles.inProgressBadge}>In Progress</span>}
          </div>
          <p className={styles.cardSubtitle}>{project.subtitle}</p>
        </div>
      </div>

      <div className={styles.cardDivider} />

      <p className={styles.cardDesc}>{project.description}</p>

      {/* What I built */}
      <div className={styles.builtSection}>
        <p className={styles.builtLabel}>What I built</p>
        <ul className={styles.builtList}>
          {project.built.map((item, i) => (
            <motion.li
              key={i}
              className={styles.builtItem}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
            >
              <span className={styles.bullet} style={{ color: project.color }}>→</span>
              {item}
            </motion.li>
          ))}
        </ul>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.techRow}>
          {project.tech.map(t => (
            <span key={t} className={`tag ${styles.techTag}`}>{t}</span>
          ))}
        </div>
        <div className={styles.linksRow}>
          <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
            &rarr; View Source
          </a>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className={styles.demoLink}>
              &rarr; Live Demo
            </a>
          )}
        </div>
      </div>

      <div style={{ marginTop: '30px', borderTop: '1px solid var(--stone)', paddingTop: '20px' }}>
        <Link to={`/projects/${slugify(project.title)}`} className={styles.detailsLink}>
          View Details &rarr;
        </Link>
      </div>
    </motion.article>
  );
}
