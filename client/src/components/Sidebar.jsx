import styles from './Sidebar.module.css';

export default function Sidebar({ channels, activeChannel, userCounts, onSelect }) {
  return (
    <aside className={styles.sidebar}>
      <ul className={styles.list}>
        {channels.map((ch) => {
          const count = userCounts[ch.id] ?? 0;
          const isActive = ch.id === activeChannel;
          return (
            <li
              key={ch.id}
              className={`${styles.item} ${isActive ? styles.active : ''}`}
              onClick={() => onSelect(ch.id)}
            >
              <span className={styles.prefix}>{isActive ? '>' : ' '}</span>
              <span className={styles.name}>#{ch.id}</span>
              {count > 0 && <span className={styles.count}>{count}</span>}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}