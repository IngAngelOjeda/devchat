import { useState } from 'react';
import styles from './UsernamePrompt.module.css';

export default function UsernamePrompt({ onSubmit }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const clean = value.trim().replace(/[^a-zA-Z0-9_\-]/g, '');
    if (clean.length < 2) {
      setError('min 2 chars');
      return;
    }
    onSubmit(clean);
  }

  return (
    <div className={styles.overlay}>
      <form className={styles.box} onSubmit={handleSubmit}>
        <div className={styles.title}>DEVCHAT</div>
        <div className={styles.inputRow}>
          <span className={styles.prompt}>handle:&nbsp;</span>
          <input
            className={styles.input}
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(''); }}
            maxLength={20}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        {error
          ? <div className={styles.error}>{error}</div>
          : <div className={styles.hint}>press enter to connect</div>
        }
      </form>
    </div>
  );
}
