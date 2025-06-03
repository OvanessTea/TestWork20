import useAuthStore from '@/store/user/useAuthStore';
import styles from '@/styles/footer/Footer.module.scss';

export default function Footer() {
    const { user } = useAuthStore((state) => state);

    return (
        <footer>
            <div className={styles.container}>
                <p>2025</p>
                <p>{user ? `Logged as ${user.email}` : ''}</p>
            </div>
        </footer>
    );
}