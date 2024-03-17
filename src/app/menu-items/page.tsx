'use client';
import AdminTabs from '@/components/AdminTabs';
import Right from '@/components/icons/Right';
import ShimmerSpinner from '@/components/shimmer/ShimmerSpinner';
import useProfileCheck from '@/components/useProfileCheck';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'

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

export default function MenuItems() {

    const {status} = useSession();
    const {loading, isAdmin} = useProfileCheck();
    const [fetchLoading, setFetchLoading] = useState(false);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const fetchMenuItems = async() => {
            const res = await fetch('/api/menu-items', {
                method: 'GET',
            }) 

            if(res.ok){
                const data = await res.json();
                setMenuItems(data);
            }

        }
        setFetchLoading(true);
        fetchMenuItems();
        setFetchLoading(false);
    }, [])

    if(status === 'unauthenticated'){
        return redirect('/login');
    } else if(!isAdmin && loading) {
        return redirect('/profile');
    } else if(status === 'loading' || fetchLoading || !loading){
        return <ShimmerSpinner />
    }

    return (
        <section className='mt-8 max-w-2xl mx-auto'>
            <AdminTabs isAdmin={isAdmin} />
            <div className="mt-8 flex justify-center">
                <Link className='bg-primary hover:bg-white hover:text-primary text-white duration-300 px-4 py-2 border border-primary rounded-lg flex gap-2 items-center' href={'/menu-items/new'}>Add new Menu Item <Right /></Link>
            </div>
            <div>
                {menuItems.length > 0 ? (
                    <h2 className='text-base text-center md:text-left md:text-sm text-slate-500 mt-8 mb-1'>Click to edit Menu Items:</h2>
                ) : (
                    <h2 className='text-center text-xl text-slate-500 mt-8 mb-1'>No Menu Items to display</h2>
                )}
                
                <div className='flex flex-wrap justify-center md:justify-start  gap-2'>
                    {menuItems.length > 0 && menuItems.map((item: MenuItem) => (
                        <Link href={`/menu-items/edit/${item._id}`} key={item._id}>
                            <div className='bg-slate-300 rounded-lg p-3 flex flex-col items-center gap-2 h-52 w-52'>
                                <div className='h-28 w-28 flex'>
                                    <Image className='rounded-lg mb-1 mx-auto' src={item.menuImg || '/MAIN_DISH.png'} width={120} height={150} alt='item_img' />
                                </div>
                                <div className='font-medium text-base text-center'>
                                    {item.itemName}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
