import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import styles from '@/styles/main/App.module.scss';
export default function ContentLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
    </div>
  );
}
