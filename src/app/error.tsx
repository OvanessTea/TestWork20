'use client';

import { useEffect } from 'react';
import styles from '@/styles/main/ErrorPage.module.scss';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('❌ Global error caught:', error);
  }, [error]);

  return (
    <main className={styles.container}>
      <h1 className={styles.container__title}>Something went wrong</h1>
      <p className={styles.container__message}>{error.message}</p>
      <button
        onClick={() => reset()}
        className={styles.container__button}
      >
        Try again
      </button>
    </main>
  );
}