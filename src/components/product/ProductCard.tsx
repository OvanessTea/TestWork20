import React, { useState } from 'react';
import { Product } from '@/types/product';
import Image from 'next/image';
import styles from '@/styles/main/ProductCard.module.scss';
import useAuthStore from '@/store/user/useAuthStore';
import Spinner from '@/components/spinner/Spinner';
import classNames from 'classnames';
import { motion } from 'framer-motion';

const ProductCard = ({ product }: { product: Product }) => {
    const { user } = useAuthStore((state) => state);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleAddToCart = async (_product: Product) => {
        setIsLoading(true);

        await new Promise<void>((resolve) => {
            setTimeout(() => {
                setIsLoading(false);
                resolve();
            }, 1000);
        });

        setIsSuccess(true);

        await new Promise<void>((resolve) => {
            setTimeout(() => {
                setIsSuccess(false);
                resolve();
            }, 1000);
        });
    };

    return (
        <div className={classNames(styles.container, (isLoading || isSuccess) && styles.loading)}>
            <div className={styles.content}>
                <Image src={product.thumbnail} alt={product.title} width={200} height={200} />
                <h3>{product.title}</h3>
                <p className={styles.category}>{product.category}</p>
                <p className={styles.price}>${product.price}</p>
            </div>
            {user && (
                <button disabled={isLoading} className={styles.addCart} onClick={() => handleAddToCart(product)}>
                    <Image src="/cart.svg" alt="Cart" width={20} height={20} />
                    Add to Cart
                </button>
            )}
            {isLoading ? (
                <Spinner />
            ) : null}
            {isSuccess ? (
                <motion.div className={styles.success} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1.75 }} transition={{ duration: 0.2 }}>
                    <Image src="/check.svg" alt="Success" width={100} height={100} />
                </motion.div>
            ) : null}
        </div>
    );
};

export default ProductCard;
