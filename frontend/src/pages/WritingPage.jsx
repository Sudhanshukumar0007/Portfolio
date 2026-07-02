import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NeuralNetBg from '../components/NeuralNetBg';
import styles from './WritingPage.module.css';

const BLOG_HOST = "backpropdiaries.hashnode.dev";
// rss2json converts RSS → JSON and is CORS-safe (free, no token needed)
const RSS2JSON_URL = `https://api.rss2json.com/v1/api.json?rss_url=https://${BLOG_HOST}/rss.xml`;

export default function WritingPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchPosts() {
      try {
        const response = await fetch(RSS2JSON_URL);

        if (!response.ok) {
          console.error('rss2json returned status:', response.status);
          setError(true);
          return;
        }

        const data = await response.json();

        if (data.status !== 'ok') {
          console.error('rss2json error:', data);
          setError(true);
          return;
        }

        // Map rss2json fields to the shape our UI expects
        const items = (data.items || []).map((item) => ({
          id: item.guid || item.link,
          title: item.title?.replace(/^#+\s*/, '').trim(), // strip leading markdown # 
          brief: item.description,
          // rss2json puts Hashnode cover in enclosure.link (thumbnail is empty)
          coverImage: (item.enclosure?.link || item.thumbnail)
            ? { url: item.enclosure?.link || item.thumbnail }
            : null,
          publishedAt: item.pubDate || null,
          url: item.link,
          tags: (item.categories || []).map((c) => ({ name: c })),
        }));

        setPosts(items);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Estimate reading time (~200 wpm)
  const estimateReadTime = (text) => {
    if (!text) return null;
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.main
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.4 } }}
      exit={{ opacity: 0 }}
    >
      <NeuralNetBg opacity={0.25} />

      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Writing</h1>
          <p className={styles.subtitle}>Backprop Diaries — notes from the journey.</p>
        </div>

        {/* Skeleton loading */}
        {loading && (
          <div className={styles.grid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
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

        {/* Error state */}
        {!loading && error && (
          <div className={styles.errorContainer}>
            <div className={styles.errorCard}>
              <div className={styles.errorIcon}>✍️</div>
              <h3 className={styles.errorTitle}>Blog feed unavailable</h3>
              <p className={styles.errorMessage}>
                Couldn&apos;t load posts right now. Please try again later.
              </p>
              <a
                href={`https://${BLOG_HOST}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.errorLink}
              >
                Visit Backprop Diaries →
              </a>
            </div>
          </div>
        )}

        {/* Posts grid */}
        {!loading && !error && (
          <motion.div
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {posts.map((post) => (
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
                    <img
                      src={post.coverImage.url}
                      alt={post.title}
                      className={styles.coverImage}
                      loading="lazy"
                      width="800"
                      height="400"
                    />
                  ) : (
                    <div className={styles.fallbackCover}></div>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.tags}>
                    {post.tags &&
                      post.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className={styles.tag}>
                          {tag.name.toUpperCase()}
                        </span>
                      ))}
                  </div>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <p className={styles.postBrief}>{post.brief}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.date}>{formatDate(post.publishedAt)}</span>
                    {estimateReadTime(post.brief) && (
                      <span className={styles.readTime}>
                        {estimateReadTime(post.brief)} MIN READ
                      </span>
                    )}
                  </div>
                </div>
              </motion.a>
            ))}

            {/* Placeholder cards to fill row if fewer than 3 posts */}
            {posts.length > 0 &&
              posts.length < 3 &&
              Array.from({ length: 3 - posts.length }).map((_, i) => (
                <motion.div
                  key={`placeholder-${i}`}
                  className={styles.placeholderCard}
                  variants={itemVariants}
                >
                  <div className={styles.placeholderInner}>
                    <span>More posts coming soon</span>
                  </div>
                </motion.div>
              ))}

            {/* Empty state */}
            {posts.length === 0 && (
              <motion.div className={styles.emptyState} variants={itemVariants}>
                <div className={styles.errorIcon}>📝</div>
                <p className={styles.errorTitle}>No posts yet</p>
                <a
                  href={`https://${BLOG_HOST}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.errorLink}
                >
                  Visit Backprop Diaries →
                </a>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}
