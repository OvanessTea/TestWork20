'use client';

import React from 'react';
import styles from '../../styles/modal/Modal.module.scss';
import useErrorStore from '@/store/error/useErrorStore';
import Image from 'next/image';

const Modal = () => {

    const { error, setError, code } = useErrorStore();

    if (!error) return null; 

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <Image src="/error.svg" alt="error" width={100} height={100} />
                <h2>{code}</h2>
                <p>{error}</p>
                <button onClick={() => setError(null)}>Close</button>
            </div>
        </div>
    );
};

export default Modal;
