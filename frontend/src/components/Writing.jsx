import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './Writing.module.css';

const BLOG_HOST = "backpropdiaries.hashnode.dev";
// rss2json converts RSS → JSON and is CORS-safe (free, no token needed)
const RSS2JSON_URL = `https://api.rss2json.com/v1/api.json?rss_url=https://${BLOG_HOST}/rss.xml`;

export default function Writing() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(RSS2JSON_URL);

        if (!response.ok) {
          setError(true);
          return;
        }

        const data = await response.json();

        if (data.status !== 'ok') {
          setError(true);
          return;
        }

        const items = (data.items || []).map((item) => ({
          id: item.guid || item.link,
          title: item.title?.replace(/^#+\s*/, '').trim(),
          brief: item.description,
          coverImage: item.thumbnail ? { url: item.thumbnail } : null,
          publishedAt: item.pubDate || null,
          readTimeInMinutes: Math.max(1, Math.round((item.description || '').split(/\s+/).length / 200)),
          url: item.link,
          tags: (item.categories || []).map((c) => ({ name: c })),
        }));

        setPosts(items);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section id="writing" className={styles.writingSection}>
      <div className={styles.inner}>
        <motion.span
          className="section-label"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Writing
        </motion.span>
        <div className={styles.header}>
          <h2 className={styles.title}>Writing</h2>
          <a href={`https://${BLOG_HOST}`} target="_blank" rel="noopener noreferrer" className={styles.viewAll}>
            Read all on Backprop Diaries &rarr;
          </a>
        </div>

        {/* Loading state */}
        {loading && (
          <div className={styles.cardsContainer} ref={scrollRef}>
            {[1, 2, 3].map(i => (
              <div key={i} className={`${styles.card} ${styles.skeleton}`}>
                <div className={styles.skelImage}></div>
                <div className={styles.skelContent}>
                  <div className={styles.skelTag}></div>
                  <div className={styles.skelTitle}></div>
                  <div className={styles.skelTitleShort}></div>
                  <div className={styles.skelText}></div>
                  <div className={styles.skelText}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error / Empty state */}
        {!loading && error && (
          <div className={styles.cardsContainer}>
            <a href={`https://${BLOG_HOST}`} target="_blank" rel="noopener noreferrer" className={styles.errorCard}>
              <div className={styles.errorText}>Read Backprop Diaries on Hashnode &rarr;</div>
            </a>
          </div>
        )}

        {/* Success state */}
        {!loading && !error && (
          <div className={styles.scrollWrapper}>
            <button className={`${styles.navBtn} ${styles.leftBtn}`} onClick={scrollLeft} aria-label="Scroll left">&larr;</button>
            <motion.div 
              className={styles.cardsContainer} 
              ref={scrollRef}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {posts.map(post => (
                <motion.a 
                  key={post.id} 
                  href={post.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.card}
                  variants={itemVariants}
                >
                  <div className={styles.coverWrapper}>
                    {post.coverImage ? (
                      <img src={post.coverImage.url} alt={post.title} className={styles.coverImage} loading="lazy" />
                    ) : (
                      <div className={styles.fallbackCover}></div>
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.tags}>
                      {post.tags && post.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className={styles.tag}>{tag.name.toUpperCase()}</span>
                      ))}
                    </div>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    <p className={styles.postBrief}>{post.brief}</p>
                    <div className={styles.cardFooter}>
                      <span className={styles.date}>{formatDate(post.publishedAt)}</span>
                      <span className={styles.readTime}>{post.readTimeInMinutes} MIN READ</span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
            <button className={`${styles.navBtn} ${styles.rightBtn}`} onClick={scrollRight} aria-label="Scroll right">&rarr;</button>
          </div>
        )}
      </div>
    </section>
  );
}
