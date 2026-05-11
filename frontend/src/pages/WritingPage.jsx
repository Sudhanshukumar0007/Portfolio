import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NeuralNetBg from '../components/NeuralNetBg';
import styles from './WritingPage.module.css';

const BLOG_HOST = "backpropdiaries.hashnode.dev";

const FETCH_POSTS_QUERY = `
  query GetPosts($host: String!) {
    publication(host: $host) {
      posts(first: 20) {
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

export default function WritingPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
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

        {loading && (
          <div className={styles.grid}>
            {[1, 2, 3, 4, 5, 6].map(i => (
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

        {!loading && error && (
          <div className={styles.errorContainer}>
            <a href={`https://${BLOG_HOST}`} target="_blank" rel="noopener noreferrer" className={styles.errorCard}>
              <div className={styles.errorText}>Read Backprop Diaries on Hashnode &rarr;</div>
            </a>
          </div>
        )}

        {!loading && !error && (
          <motion.div 
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
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
                    <img src={post.coverImage.url} alt={post.title} className={styles.coverImage} loading="lazy" width="800" height="400" />
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
            {posts.length > 0 && posts.length < 3 && Array.from({ length: 3 - posts.length }).map((_, i) => (
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
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}
