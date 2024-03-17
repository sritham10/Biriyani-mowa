'use client';
import MenuCard from '@/components/MenuCard';
import SectionHeaders from '@/components/SectionHeaders';
import ShimmerSpinner from '@/components/shimmer/ShimmerSpinner';
import React, { useEffect, useState } from 'react'

type CategoryType = {_id: string, name: string};

type SizeType = {
    name: string,
    price: string,
    _id: string
}

type PriorityType = {isPriority: boolean, priorityLabel: string};

type MenuItem = {
    _id: string,
    itemName: string,
    itemDesc: string,
    itemPrice: number,
    menuImg: string,
    sizes: SizeType[],
    category: string,
    priority: PriorityType
}

export default function MenuPage() {

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchCategories = async() => {
            const res = await fetch('/api/categories', {
                method: 'GET',
            });
            const data = await res.json();
            if(res.ok) setCategories(data);
        }

        const fetchMenuItems = async() => {
            const res = await fetch('/api/menu-items', {
                method: 'GET',
            }) 
            const data = await res.json();
            if(res.ok) setMenuItems(data);
        }

        fetchMenuItems();
        fetchCategories();
        setLoading(false);
    }, []);

    if(loading || categories.length === 0 || menuItems.length == 0){
        return <ShimmerSpinner />
    }

    return (
        <section className='mt-8'>
            {categories.length > 0 && categories.map(cat => (
                <div key={cat._id}>
                    <div className="text-center">
                        <SectionHeaders mainHeader={cat.name} />
                    </div>
                    <div className='grid sm:grid-cols-3 gap-4 mt-6 mb-12'>
                        {menuItems.filter(item => item.category === cat.name).map(item => (
                            <MenuCard key={item._id} item={item} />
                        ))}
                    </div>
                </div>
            ))}
        </section>
    )
}
