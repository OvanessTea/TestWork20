import useAuthStore from '@/store/user/useAuthStore';
import styles from '@/styles/footer/Footer.module.scss';
import { CONTACT_INFO } from '@/constants/contact';

export default function Footer() {
    const { user } = useAuthStore((state) => state);

    return (
        <footer>
            <div className={styles.container}>
                <p className={styles.year}>2025</p>
                <p className={styles.user}>{user ? `Logged as ${user.email}` : ''}</p>
                <div className={styles.contacts}>
                    <div className={styles.section}>
                        <p>{CONTACT_INFO.phone}</p>
                    </div>
                    <div className={styles.section}>
                        <p>{CONTACT_INFO.email}</p>
                    </div>
                    <div className={styles.section}>
                        <p>{CONTACT_INFO.address}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}