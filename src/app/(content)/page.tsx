'use client';
import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProductStore } from '@/store/product/useProductStore';
import { formatParams } from '@/utils/formatParams';
import ProductCard from '@/components/product/ProductCard';
import { motion } from 'framer-motion';

const App = () => {
    const { products, getProducts } = useProductStore((state) => state);
    const searchParams = useSearchParams();

    useEffect(() => {
        const formattedParams = formatParams(searchParams);
        getProducts(formattedParams);
    }, [searchParams, getProducts]);

    return (
        <div>
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
            )) : <h1>No products found</h1>}
        </div>
    );
};

export default App;
