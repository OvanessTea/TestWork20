'use client';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import styles from '@/styles/main/App.module.scss';
import { useEffect } from 'react';
import { useProductStore } from '@/store/product/useProductStore';
import Modal from '@/components/modal/Modal';
export default function ContentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { skip } = useProductStore((state) => state);

  useEffect(() => {
    const content = document.querySelector(`.${styles.layout__content}`);
    if (content) {
      content.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [skip]);

  return (
    <div className={styles.layout}>
      <div className={styles.layout__header}>
        <Header />
      </div>
      <div className={styles.layout__content}>
        {children}
      </div>
      <div className={styles.layout__footer}>
        <Footer />
      </div>
      <Modal />
    </div>
  );
}
