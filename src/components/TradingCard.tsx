import type { GitHubUser } from '../types/github';
import styles from './TradingCard.module.css';

interface TradingCardProps {
  user: GitHubUser;
}

export const TradingCard = ({ user }: TradingCardProps) => {
  const joinedDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <img src={user.avatar_url} alt={user.login} className={styles.avatar} />
        <div className={styles.headerInfo}>
          <h2>{user.name || user.login}</h2>
          <p className={styles.username}>@{user.login}</p>
        </div>
      </div>
      
      <div className={styles.cardBody}>
        {user.bio && <p className={styles.bio}>{user.bio}</p>}
        
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{user.public_repos}</span>
            <span className={styles.statLabel}>Repositories</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{user.followers}</span>
            <span className={styles.statLabel}>Followers</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{user.following}</span>
            <span className={styles.statLabel}>Following</span>
          </div>
        </div>

        <div className={styles.details}>
          {user.location && (
            <p className={styles.detail}>📍 {user.location}</p>
          )}
          {user.company && (
            <p className={styles.detail}>🏢 {user.company}</p>
          )}
          <p className={styles.detail}>🗓️ Joined {joinedDate}</p>
        </div>
      </div>
    </div>
  );
};
