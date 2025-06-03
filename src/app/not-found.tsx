'use client';

import Link from 'next/link';
import styles from '@/styles/main/NotFoundPage.module.scss';

export default function NotFound() {
  return (
    <main className={styles.container}>
      <h1 className={styles.container__title}>404</h1>
      <p className={styles.container__text}>Page not found</p>
      <Link
        href="/"
        className={styles.container__link}
      >
        Back to home
      </Link>
    </main>
  );
}