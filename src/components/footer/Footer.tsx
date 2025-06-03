import useAuthStore from '@/store/user/useAuthStore';
import styles from '@/styles/footer/Footer.module.scss';

export default function Footer() {
    const { user } = useAuthStore((state) => state);

    return (
        <footer>
            <div className={styles.container}>
                <p className={styles.year}>2025</p>
                <p className={styles.user}>{user ? `Logged as ${user.email}` : ''}</p>
                <div className={styles.contacts}>
                    <div className={styles.section}>
                        <p>+021-95-51-84</p>
                    </div>
                    <div className={styles.section}>
                        <p>shop@abelohost.com</p>
                    </div>
                    <div className={styles.section}>
                        <p>173 Stonecoal Road</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}