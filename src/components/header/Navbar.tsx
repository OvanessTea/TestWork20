'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/header/Navbar.module.scss';
import { useCategoryStore } from '@/store/product/useCategoryStore';
import { Category } from '@/types/category';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useUrlParams } from '@/hooks/useUrlParams';

const CategoryTabs = ({ 
    tabs, 
    activeTab, 
    onTabClick, 
    scrollRef, 
    categoryRefs 
}: { 
    tabs: Category[], 
    activeTab: Category | null, 
    onTabClick: (category: Category) => void,
    scrollRef: React.RefObject<HTMLDivElement>,
    categoryRefs: React.RefObject<Record<string, HTMLButtonElement | null>>
}) => {
    const scrollLeft = () => scrollRef.current?.scrollBy({ left: -850, behavior: 'smooth' });
    const scrollRight = () => scrollRef.current?.scrollBy({ left: 850, behavior: 'smooth' });

    return (
        <>
            {tabs.length > 10 && <button className={`${styles.scrollBtn} ${styles.left}`} onClick={scrollLeft}>‹</button>}
            <div ref={scrollRef} className={styles.tabs}>
                {tabs.map((tab) => (
                    <button 
                        onClick={() => onTabClick(tab)} 
                        key={tab.slug} 
                        className={`${activeTab?.slug === tab.slug ? styles.active : ''}`}
                        ref={(el) => {
                            categoryRefs.current[tab.slug] = el;
                        }}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>
            {tabs.length > 10 && <button className={`${styles.scrollBtn} ${styles.right}`} onClick={scrollRight}>›</button>}
        </>
    );
};

const SearchBar = ({ 
    search, 
    onSearch, 
    onSearchChange 
}: { 
    search: string, 
    onSearch: () => void, 
    onSearchChange: (value: string) => void 
}) => (
    <div className={styles.search}>
        <input
            type="text"
            placeholder="Search"
            value={search}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            onChange={(e) => onSearchChange(e.target.value)}
        />
        <button className={styles.searchBtn} onClick={onSearch}>
            <Image src="/search.svg" alt="Search" width={20} height={20} />
        </button>
    </div>
);

const Navbar = () => {
    const { categories, getCategories } = useCategoryStore((state) => state);
    const [tabs, setTabs] = useState<Category[]>(categories);
    const [activeTab, setActiveTab] = useState<Category | null>(null);
    const searchParams = useSearchParams();
    const [search, setSearch] = useState<string>(searchParams.get('search') || '');
    const { updateParams } = useUrlParams();
    const scrollRef = useRef<HTMLDivElement>(null);
    const categoryRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const toggleCategory = async (category: Category) => {
        setActiveTab(category);
        await updateParams({
            search: null,
            skip: null,
            category: category.slug === 'all' ? null : category.slug
        });
        setSearch('');
    };

    const handleSearch = async () => {
        await updateParams({
            category: null,
            skip: null,
            search: search || null
        });
        setActiveTab(null);
    };

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    useEffect(() => {
        setTabs([{ slug: 'all', name: 'All', url: '/' }, ...categories]);
        const currentTab = searchParams.get('category');
        if (currentTab) {
            setActiveTab(categories.find((category) => category.slug === currentTab) || null);
        }
    }, [categories, searchParams]);

    useEffect(() => {
        if (activeTab && categoryRefs.current[activeTab.slug]) {
            categoryRefs.current[activeTab.slug]?.scrollIntoView({ 
                behavior: 'smooth', 
                inline: 'center', 
                block: 'nearest' 
            });
        }
    }, [activeTab]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <CategoryTabs 
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabClick={toggleCategory}
                    scrollRef={scrollRef as React.RefObject<HTMLDivElement>}
                    categoryRefs={categoryRefs}
                />
                <SearchBar 
                    search={search}
                    onSearch={handleSearch}
                    onSearchChange={setSearch}
                />
            </div>
        </div>
    );
};

export default Navbar;
