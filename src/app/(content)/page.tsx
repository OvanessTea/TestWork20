'use client';
import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProductStore } from '@/store/product/useProductStore';
import { formatParams } from '@/utils/formatParams';
import ProductCard from '@/components/product/ProductCard';
import { motion } from 'framer-motion';
import styles from '@/styles/main/App.module.scss';
import Link from 'next/link';

const App = () => {
    const { products, getProducts } = useProductStore((state) => state);
    const searchParams = useSearchParams();

    useEffect(() => {
        const formattedParams = formatParams(searchParams);
        getProducts(formattedParams);
    }, [searchParams, getProducts]);

    return (
        <div className={styles.container}>
            {products.length > 0 ? products.map((product) => (
                <motion.div
                    key={product.id}
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <ProductCard product={product} />
                </motion.div>
            )) : (
                <div data-widget="searchResultsError" className={styles.notfound}>
                    <div className={styles.notfound__icon}>
                        <img loading="lazy" src="https://ir.ozone.ru/mobileapp/static/wc1200/icons/not_found_error_icon.png"/>
                    </div>
                    <div>
                        <div className={styles.notfound__text}>
                            Простите, по вашему запросу товаров сейчас нет.
                        </div>
                        <div className={styles.notfound__link}>
                            <Link href="/">
                                На главную
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
