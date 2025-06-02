'use client';
import useAuthStore from '@/store/user/useAuthStore';
import { useEffect, useState } from 'react';
import styles from '@/styles/login/Login.module.scss';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Spinner from '@/components/spinner/Spinner';

export default function Login() {
    const { login, user, error, isLoading } = useAuthStore((state) => state);
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            router.push('/');
        }
    };

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    // prevent ui rendering before auto renavigating
    if (typeof window === 'undefined' || localStorage.getItem('token')) return null;

    return (
        <div className={styles.container}>
            <h1>Login</h1>
            <form action='' method='post' onSubmit={handleLogin}>
                <input
                    type='text'
                    name='username'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <div className={styles.passwordContainer}>
                    <div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type='button'
                            className={styles.showPassword}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <Image src={showPassword ? '/hide_password.svg' : '/show_password.svg'} alt='Show password' width={20} height={20}/>
                        </button>
                    </div>
                    <div className={styles.errorContainer}>
                        {error ? <div className={styles.error}>*{error}</div> : null}
                    </div>
                </div>
                <button
                    type='submit'
                    className={styles.submitButton}
                    disabled={isLoading || password.length < 3}
                >
                    LOGIN
                </button>
            </form>
            {isLoading && (
                <Spinner />
            )}
        </div>
    );
}