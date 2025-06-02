'use client';
import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProductStore } from '@/store/product/useProductStore';
import { formatParams } from '@/utils/formatParams';
import ProductCard from '@/components/product/ProductCard';
import { motion } from 'framer-motion';
import styles from '@/styles/main/App.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import Pagination from '@/components/pagination/Pagination';
import Spinner from '@/components/spinner/Spinner';
const App = () => {
    const { products, getProducts, isLoading, isFetched, total } = useProductStore((state) => state);
    const searchParams = useSearchParams();

    useEffect(() => {
        const formattedParams = formatParams(searchParams);
        getProducts(formattedParams);
    }, [searchParams, getProducts]);

    if (!isFetched || isLoading) {
        return (
            <div className={styles.container}>
                <Spinner />
            </div>
        );
    }

    return (
        <div className={styles.container}>

            {products.length > 0 ? (
                <>
                    <div className={styles.container__products}>
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                animate={{ opacity: 1 }}
                                initial={{ opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                    {total > 12 && <Pagination />}
                </>
            ) : (
                <div data-widget="searchResultsError" className={styles.notfound}>
                    <div className={styles.notfound__icon}>
                        <Image
                            src="/not_found_error_icon.webp"
                            alt="not found"
                            width={48}
                            height={48}
                        />
                    </div>
                    <div>
                        <div className={styles.notfound__text}>
                            Sorry, there are no products matching your search right now.
                        </div>
                        <div className={styles.notfound__link}>
                            <Link href="/">
                                Back to home
                            </Link>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default App;
