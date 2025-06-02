import React from 'react';
import { Product } from '@/types/product';
import Image from 'next/image';
import styles from '@/styles/main/ProductCard.module.scss';

const ProductCard = ({ product }: { product: Product }) => {
    return (
        <div className={styles.container}>
            <Image src={product.thumbnail} alt={product.title} width={200} height={200} />
            <h3>{product.title}</h3>
            <p className={styles.category}>{product.category}</p>
            <p className={styles.price}>${product.price}</p>
        </div>
    );
};

export default ProductCard;
