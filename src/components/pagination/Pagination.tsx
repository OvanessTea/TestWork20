import { useProductStore } from '@/store/product/useProductStore';
import React from 'react';
import styles from '@/styles/pagination/Pagination.module.scss';
import { modifyUrl } from '@/utils/modifyUrl';
import { useRouter } from 'next/navigation';

const Pagination = () => {

    const { total, limit, skip } = useProductStore((state) => state);
    const router = useRouter();

    const currentPage = Math.floor(skip / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    const togglePage = async (page: number) => {
        await modifyUrl((params) => {
            params.set('skip', `${(Math.max(1, Math.min(page, totalPages)) - 1) * limit}`);
        }).then((url: string) => {
            router.push(url);
        });
    };

    return (
        <div className={styles.container}>
            {currentPage > 1 && (
                <>
                    <button className={styles.button} onClick={() => togglePage(1)}>1</button>
                    {currentPage > 3 && <span>…</span>}
                </>
            )}

            {currentPage > 2 && (
                <button className={styles.button} onClick={() => togglePage(currentPage - 1)}>
                    {currentPage - 1}
                </button>
            )}

            <span className={styles.currentPage}>{currentPage}</span>

            {currentPage < totalPages - 1 && (
                <button className={styles.button} onClick={() => togglePage(currentPage + 1)}>
                    {currentPage + 1}
                </button>
            )}

            {currentPage < totalPages - 2 && (
                <>
                    <span>…</span>
                    <button className={styles.button} onClick={() => togglePage(totalPages)}>{totalPages}</button>
                </>
            )}
        </div>
    );
};

export default Pagination;
