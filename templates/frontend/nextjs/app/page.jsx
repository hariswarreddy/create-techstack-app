'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <h1 className={styles.title}>Welcome to {{projectName}}</h1>
        <p className={styles.description}>Built with Next.js 15 ▲</p>
        
        <div className={styles.card}>
          <button 
            className={styles.button}
            onClick={() => setCount((c) => c + 1)}
          >
            Count is {count}
          </button>
          <p>
            Edit <code className={styles.code}>app/page.jsx</code> and save to see your changes
          </p>
        </div>
        
        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs"
            className={styles.cardLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>Docs →</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a
            href="https://nextjs.org/learn"
            className={styles.cardLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>Learn →</h2>
            <p>Learn about Next.js in an interactive course.</p>
          </a>
        </div>

        <footer className={styles.footer}>
          Built by <a href="https://harib.vercel.app" target="_blank" rel="noopener noreferrer">hariswarreddy</a>
        </footer>
      </div>
    </main>
  );
}
