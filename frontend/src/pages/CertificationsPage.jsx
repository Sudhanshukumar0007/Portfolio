import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import NeuralNetBg from '../components/NeuralNetBg';
import { supabase } from '../supabaseClient';
import CredentialModal from '../components/CredentialModal';
import styles from './CertificationsPage.module.css';

const certs = [
  {
    id: 'aws',
    issuer: 'Amazon Web Services',
    name: 'AWS Certified Cloud Practitioner',
    year: '2024',
    badge: '☁',
    color: '#FF9900',
    description:
      'Validates foundational knowledge of cloud concepts, AWS core services, security, architecture, pricing, and support — the entry point to the AWS certification path.',
    verifyUrl: 'https://aws.amazon.com/verification',
    skills: ['Cloud Architecture', 'IAM & Security', 'S3 / EC2 / Lambda', 'Cost Management', 'Shared Responsibility'],
  },
  {
    id: 'ml',
    issuer: 'Coursera · DeepLearning.AI',
    name: 'Machine Learning Specialization',
    year: '2023',
    badge: '⬡',
    color: '#0056D3',
    description:
      "Andrew Ng's flagship 3-course specialization covering supervised learning, unsupervised learning, and modern ML best practices using Python, NumPy, and scikit-learn.",
    verifyUrl: 'https://coursera.org/verify',
    skills: ['Supervised Learning', 'Neural Networks', 'Decision Trees', 'Clustering', 'Recommender Systems'],
  },
  {
    id: 'ai',
    issuer: 'Infosys Springboard',
    name: 'AI Primer Certification',
    year: '2023',
    badge: '◆',
    color: '#006400',
    description:
      'Industry-focused primer on applied AI concepts, including NLP, computer vision fundamentals, and responsible AI principles — completed with distinction.',
    verifyUrl: 'https://infosysspringboard.onwingspan.com',
    skills: ['NLP Basics', 'Computer Vision', 'Responsible AI', 'ML Lifecycle', 'Applied AI Ethics'],
  },
];

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
};

export default function CertificationsPage() {
  const [data, setData] = useState(certs);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: dbCerts, error } = await supabase
          .from('certifications')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && dbCerts && dbCerts.length > 0) {
          setData(dbCerts.map((c, i) => ({
            id: c.id,
            issuer: c.issuer,
            name: c.name,
            year: c.year,
            badge: i === 0 ? '☁' : i === 1 ? '⬡' : '◆',
            color: i === 0 ? '#FF9900' : i === 1 ? '#0056D3' : '#006400',
            description: c.description,
            verifyUrl: c.verify_url,
            verify_url: c.verify_url,
            image_url: c.image_url,
            credential_id: c.credential_id,
            skills: c.tags || [],
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
      <div className={styles.bgWrap}>
        <NeuralNetBg speedMultiplier={0.4} />
      </div>

      <div className={styles.inner}>
        <Link to="/" className={styles.back}>← Back to Home</Link>

        <motion.span
          className="section-label"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          Certifications
        </motion.span>



        <motion.p
          className={styles.subheading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
        >
          Verified knowledge — earned, not just collected.
        </motion.p>

        {loading ? (
          <div className={styles.cards}>
            <div style={{ height: 300, background: 'var(--stone)', opacity: 0.1, borderRadius: '8px' }} />
            <div style={{ height: 300, background: 'var(--stone)', opacity: 0.1, borderRadius: '8px', marginTop: 20 }} />
          </div>
        ) : (
          <div className={styles.cards}>
            {data.map((cert, i) => (
              <motion.article
                key={cert.id}
                className={styles.card}
                onClick={(e) => {
                  if (e.target.closest('a')) return;
                  setSelectedCert(cert);
                }}
                style={{ cursor: 'pointer' }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                {/* Accent bar */}
                <div className={styles.accentBar} style={{ background: cert.color }} />

                <div className={styles.cardTop}>
                  <div className={styles.badgeWrap} style={{ borderColor: cert.color }}>
                    <span className={styles.badgeIcon} style={{ color: cert.color }}>
                      {cert.badge}
                    </span>
                  </div>
                  <div className={styles.certMeta}>
                    <p className={styles.certIssuer}>{cert.issuer}</p>
                    <h2 className={styles.certName}>{cert.name}</h2>
                    <span className={styles.certYear}>{cert.year}</span>
                  </div>
                </div>

                <div className={styles.divider} />

                <p className={styles.certDesc}>{cert.description}</p>

                <div className={styles.certSkills}>
                  {cert.skills.map(s => (
                    <span key={s} className={styles.skillTag} style={{ '--cert-color': cert.color }}>
                      {s}
                    </span>
                  ))}
                </div>

                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.verifyLink}
                  style={{ color: cert.color }}
                >
                  Verify Certificate →
                </a>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {selectedCert && (
        <CredentialModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
      )}
    </motion.div>
  );
}
