import { useEffect, useRef } from 'react';
import styles from './MessageList.module.css';

export default function MessageList({ messages, username }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={styles.list}>
      {messages.map((msg) => (
        <div key={msg.id} className={`${styles.row} ${msg.type === 'system' ? styles.system : ''}`}>
          {msg.type === 'system' ? (
            <span>{msg.text}</span>
          ) : (
            <>
              <span className={`${styles.username} ${msg.username === username ? styles.own : ''}`}>
                {msg.username}
              </span>
              <span className={styles.sep}>{'  '}</span>
              <span className={styles.text}>{msg.text}</span>
            </>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}