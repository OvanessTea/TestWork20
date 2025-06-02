'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/header/Navbar.module.scss';
import { useCategoryStore } from '@/store/product/useCategoryStore';
import { Category } from '@/types/category';
import { useRouter } from 'next/navigation';
import { modifyUrl } from '@/utils/modifyUrl';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

const Navbar = () => {
    const router = useRouter();
    const { categories, getCategories } = useCategoryStore((state) => state);
    const [tabs, setTabs] = useState<Category[]>(categories);
    const [activeTab, setActiveTab] = useState<Category | null>(null);
    const searchParams = useSearchParams();
    const [search, setSearch] = useState<string>(searchParams.get('search') || '');

    const toggleCategory = async (category: Category) => {
        setActiveTab(category);
        await modifyUrl((params) => {
            // Have to delete search before setting the category
            // Otherwise, the search will return 404 error
            params.delete('search');
            // Need to delete skip to avoid pagination error
            params.delete('skip');
            setSearch('');
            if (category.slug === 'all') {
                params.delete('category');
            } else {
                params.set('category', category.slug);
            }
        }).then((url: string) => {
            router.push(url);
        });
    };

    const handleSearch = async () => {
        await modifyUrl((params) => {
            // Have to delete category before setting the search
            // Otherwise, the search will return 404 error
            params.delete('category');
            // Need to delete skip to avoid pagination error
            params.delete('skip');
            setActiveTab(null);
            if (search) {
                params.set('search', search);
            } else {
                params.delete('search');
            }
        }).then((url: string) => {
            router.push(url);
        });
    };

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        setTabs([{ slug: 'all', name: 'All', url: '/' }, ...categories]);
        const currentTab = searchParams.get('category');
        if (currentTab) {
            setActiveTab(categories.find((category) => category.slug === currentTab) || null);
        }
    }, [categories]);

    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -850, behavior: 'smooth' });
    };

    const scrollRight = () => {
        scrollRef.current?.scrollBy({ left: 850, behavior: 'smooth' });
    };

    const categoryRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    useEffect(() => {
        if (activeTab && categoryRefs.current[activeTab.slug]) {
            const el = categoryRefs.current[activeTab.slug];
            el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }, [activeTab]);

    return <div className={styles.wrapper}>
        <div className={styles.container}>
            {tabs.length > 10 && <button className={`${styles.scrollBtn} ${styles.left}`} onClick={scrollLeft}>‹</button>}
            <div ref={scrollRef} className={styles.tabs}>
                {tabs.map((tab) => (
                    <button 
                        onClick={() => toggleCategory(tab)} 
                        key={tab.slug} 
                        className={`${activeTab?.slug === tab.slug ? styles.active : ''}`}
                        ref={(el) => {
                            if (el) {
                                categoryRefs.current[tab.slug] = el;
                            }
                        }}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>
            {tabs.length > 10 && <button className={`${styles.scrollBtn} ${styles.right}`} onClick={scrollRight}>›</button>}
            <div className={styles.search}>
                <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className={styles.searchBtn} onClick={() => handleSearch()}>
                    <Image src="/search.svg" alt="Search" width={20} height={20} />
                </button>
            </div>
        </div>
    </div>;
};

export default Navbar;
