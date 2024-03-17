'use client';
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'

type Props = {
    isAdmin: Boolean
}

export default function AdminTabs({isAdmin}: Props) {

    const path = usePathname();
    const params = useSearchParams();

    return (
        <div className="flex flex-wrap gap-3 sm:gap-2 justify-center tabs">
            <Link className={path === '/profile' ? 'active': ''} href={'/profile'}>Profile</Link>
            <Link className={!params.get('admin') && path === '/orders' ? 'active': ''} href={'/orders'}>My Orders</Link>
            {isAdmin && (
                <>
                    <Link className={path === '/categories' ? 'active': ''} href={'/categories'}>Categories</Link>
                    <Link className={path.includes('menu-items') ? 'active': ''} href={'/menu-items'}>Menu Items</Link>
                    <Link className={path === '/users' ? 'active': ''} href={'/users'}>Users</Link>
                    <Link className={params.get('admin') && path === '/orders' ? 'active': ''} href={'/orders?admin=true'}>Orders</Link>
                </>
            )}    
        </div>  
    )
}
