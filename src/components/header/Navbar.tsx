'use client';
import React, { useState } from 'react';
import styles from '@/styles/header/Navbar.module.scss';
// import { useCategoryStore } from '@/store/product/useCategoryStore';
import { Category } from '@/types/category';
import { useRouter } from 'next/navigation';
import categories from '@/__mocks__/categories.json';
import { modifyUrl } from '@/utils/modifyUrl';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

const Navbar = () => {
    const router = useRouter();
    // const { categories, getCategories } = useCategoryStore((state) => state);
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

    // Too many categories to be displayed in the navbar :(
    // Getting categories from the mock file
    // You can uncomment this (and useCategoryStore) to get the categories from the API
    // useEffect(() => {
    //     getCategories();
    // }, []);

    // useEffect(() => {
    //     setTabs([{ slug: 'all', name: 'All', url: '/' }, ...categories]);
    // }, [categories]);

    return <div className={styles.wrapper}>
        <div className={styles.container}>
            <div className={styles.tabs}>
                {tabs.map((tab) => (
                    <button onClick={() => toggleCategory(tab)} key={tab.slug} className={`${activeTab?.slug === tab.slug ? styles.active : ''}`}>
                        {tab.name}
                    </button>
                ))}
            </div>
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
