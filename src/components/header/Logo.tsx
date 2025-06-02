import React from 'react';
import styles from '@/styles/Logo.module.scss';

const Logo = () => {
    return <div className={styles.wrapper}>
        <div className={styles.container}>
            <h1>Abelohost Shop</h1>
            <div className={styles.image}/>
        </div>
    </div>;
};

export default Logo;
