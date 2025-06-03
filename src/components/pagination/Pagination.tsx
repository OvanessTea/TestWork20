import { useProductStore } from '@/store/product/useProductStore';
import React from 'react';
import styles from '@/styles/pagination/Pagination.module.scss';
import { useUrlParams } from '@/hooks/useUrlParams';

const Pagination = () => {
    const { total, limit, skip } = useProductStore((state) => state);
    const { updateParams } = useUrlParams();

    const safeTotal = Math.max(0, total);
    const safeLimit = Math.max(1, limit);
    const safeSkip = Math.max(0, skip);

    const currentPage = Math.floor(safeSkip / safeLimit) + 1;
    const totalPages = Math.max(1, Math.ceil(safeTotal / safeLimit));

    if (totalPages <= 1) {
        return null;
    }

    const togglePage = async (page: number) => {
        await updateParams({
            skip: `${(Math.max(1, Math.min(page, totalPages)) - 1) * safeLimit}`
        });
    };

    const getPageRange = (start: number, end: number) => {
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    let pages: (number | string)[] = [];
    
    if (totalPages <= 5) {
        pages = getPageRange(1, totalPages);
    } else {
        pages.push(1);
        
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        
        if (start > 2) {
            pages.push('...');
        }
        
        pages.push(...getPageRange(start, end));
        
        if (end < totalPages - 1) {
            pages.push('...');
        }
        
        pages.push(totalPages);
    }

    return (
        <div className={styles.container}>
            <button 
                className={styles.button} 
                onClick={() => togglePage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &lt;
            </button>

            {pages.map((page, index) => {
                if (page === '...') {
                    return <span key={`ellipsis-${index}`}>…</span>;
                }
                return (
                    <button
                        key={page}
                        className={`${styles.button} ${page === currentPage ? styles.currentPage : ''}`}
                        onClick={() => togglePage(page as number)}
                    >
                        {page}
                    </button>
                );
            })}

            <button 
                className={styles.button} 
                onClick={() => togglePage(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>
        </div>
    );
};

export default Pagination;