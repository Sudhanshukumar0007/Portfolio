import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './Writing.module.css';

const BLOG_HOST = "backpropdiaries.hashnode.dev";

const FETCH_POSTS_QUERY = `
  query GetPosts($host: String!) {
    publication(host: $host) {
      posts(first: 6) {
        edges {
          node {
            id
            title
            brief
            coverImage { url }
            publishedAt
            readTimeInMinutes
            tags { name }
            url
          }
        }
      }
    }
  }
`;

export default function Writing() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('https://gql.hashnode.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: FETCH_POSTS_QUERY,
            variables: { host: BLOG_HOST }
          })
        });
        const json = await response.json();
        
        if (json.data?.publication?.posts?.edges) {
          const fetchedPosts = json.data.publication.posts.edges.map(edge => edge.node);
          setPosts(fetchedPosts);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching Hashnode posts:", err);
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
