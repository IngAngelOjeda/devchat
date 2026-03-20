import { useState, useRef } from 'react';
import styles from './MessageInput.module.css';

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const trimmed = text.trim();
      if (!trimmed) return;
      onSend(trimmed);
      setText('');
    }
  }

  return (
    <div className={styles.container}>
      <span className={styles.prompt}>{'>'}</span>
      <input
        ref={inputRef}
        className={styles.input}
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 500))}
        onKeyDown={handleKeyDown}
        autoFocus
        autoComplete="off"
        spellCheck={false}
        placeholder=""
      />
    </div>
  );
}