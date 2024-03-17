/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import AdminTabs from '@/components/AdminTabs';
import SectionHeaders from '@/components/SectionHeaders';
import OrderSlabs from '@/components/layout/OrderSlabs';
import ShimmerSpinner from '@/components/shimmer/ShimmerSpinner';
import useProfileCheck from '@/components/useProfileCheck';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect, useSearchParams } from 'next/navigation';
import React, { useEffect, useState, Suspense } from 'react';

function ToBeSuspended() {

    const session = useSession();
    const {status} = session;
    const {isAdmin, loading} = useProfileCheck();
    const [orders, setOrders] = useState<any>([]);
    const [fetchLoading, setFetchLoading] = useState(false);
    const params = useSearchParams();   

    useEffect(() => {
        setOrders([]);
        setFetchLoading(true);
        async function getUsersAllOrders() {
            const res = await fetch('/api/orders', {
                method: 'GET'
            });
            const data = await res.json(); 
            if(res.ok) setOrders(data.reverse());
        }

        async function getAllOrders(){
            const res = await fetch('/api/orders?admin=true&orders=all', {
                method: 'GET'
            });
            const data = await res.json(); 
            if(res.ok) setOrders(data.reverse());
        }

        if(params.get('admin')){
            getAllOrders();
        } else {   
            getUsersAllOrders();
        }

        setFetchLoading(false);
    }, [params.get('admin')]);

    const notAnAdmin = params.get('admin') && params.get('admin') !== null && !isAdmin && loading;
    
    if(notAnAdmin){
        return redirect('/orders');
    }

    if(status === 'loading' || fetchLoading){
        return <ShimmerSpinner />;
    } else if(status === 'unauthenticated'){
        return redirect('/login');
    }

    return (
        <section className='mt-8'>
        <AdminTabs isAdmin={isAdmin} />
        <div className="text-center my-8">
            <SectionHeaders mainHeader={notAnAdmin === null ? 'Your Orders' : 'All Orders'} />
        </div>
        {orders.length > 0 ? (
            <div>
                {orders.map((order: any) => (
                    <Link key={order._id} href={`/orders/${order._id}`}>
                        <OrderSlabs order={order} />
                    </Link>
                ))}
            </div>
        ) : (
            <div className='text-center text-2xl font-semibold'>
                No Orders to show.
            </div>
        )}
        </section>
    )
}

export default function OrdersPage() {
    return (
        <Suspense>
            <ToBeSuspended />
        </Suspense>
    )
}
