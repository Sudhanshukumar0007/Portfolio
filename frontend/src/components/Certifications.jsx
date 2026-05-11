import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { supabase } from '../supabaseClient';
import CredentialModal from './CredentialModal';
import styles from './Certifications.module.css';

export default function Certifications() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  const [certs, setCerts] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    async function fetchCerts() {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error && data) {
        setCerts(data);
      }
    }
    fetchCerts();
  }, []);

  return (
    <section id="certifications" className={styles.certs} ref={ref}>
      <div className="container">
        <motion.span
          className="section-label"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Certifications
        </motion.span>



        <div className={styles.list}>
          {certs.map((cert, i) => (
            <motion.div
              key={cert.id}
              className={styles.certItem}
              onClick={() => setSelectedCert(cert)}
              style={{ cursor: 'pointer' }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.12 }}
            >
              <div className={styles.certRow}>
                <div className={styles.certInfo}>
                  <p className={styles.certIssuer}>{cert.issuer}</p>
                  <h3 className={styles.certName}>
                    {cert.name}
                  </h3>
                </div>
                <div className={styles.certYear}>
                  <span>{cert.year}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedCert && (
        <CredentialModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
      )}
    </section>
  );
}
