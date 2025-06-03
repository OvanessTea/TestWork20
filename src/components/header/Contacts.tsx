'use client';
import React from 'react';
import useAuthStore from '@/store/user/useAuthStore';
import { useRouter } from 'next/navigation';
import styles from '@/styles/header/Contacts.module.scss';
import Image from 'next/image';
import { CONTACT_INFO } from '@/constants/contact_info';

const Contacts = () => {
    const router = useRouter();
    const { user, logout } = useAuthStore((state) => state);

    return <div className={styles.container}>
        <div className={styles.content}>
            <div className={styles.contacts}>
                <div className={styles.section}>
                    <Image src='/phone.svg' alt='phone' width={20} height={20} />
                    <p>{CONTACT_INFO.phone}</p>
                </div>
                <div className={styles.section}>
                    <Image src='/mail.svg' alt='email' width={20} height={20} />
                    <p>{CONTACT_INFO.email}</p>
                </div>
                <div className={styles.section}>
                    <Image src='/location.svg' alt='location' width={20} height={20} />
                    <p>{CONTACT_INFO.address}</p>
                </div>
            </div>
            <div className={styles.user}>
                {user ? (
                    <>
                        <p>{user.firstName} {user.lastName}</p>
                        <button onClick={logout}>
                            <Image src='/user.svg' alt='user' width={20} height={20} />
                            <p>Logout</p>
                        </button>
                    </>
                ) : (
                    <button onClick={() => router.push('/login')}>
                        <Image src='/user.svg' alt='user' width={20} height={20} />
                        <p>Login</p>
                    </button>
                )}
            </div>
        </div>
    </div>;
};

export default Contacts;
