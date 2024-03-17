import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useProfileCheck from '../useProfileCheck';
import { useSession } from 'next-auth/react';

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

type Props = {
    order: {
        cartProducts: MenuItem[],
        orderStatus: string,
        createdAt: Date,
        finalCartValue: number,
        paymentStatus: boolean
    }
}

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];

export default function OrderSlabs({ order }: Props) {
    const params = useSearchParams();
    const {status} = useSession();
    const {loading, isAdmin} = useProfileCheck();
    
    let orderDate:any = new Date(order.createdAt);
    orderDate = (monthNames[orderDate.getMonth()].slice(0,3)) + ' ' + (orderDate.getDate()+1) + ', ' + orderDate.getFullYear();

    return (
        <div className='flex flex-col md:grid grid-cols-12 gap-4 py-6 px-4 m-2 rounded-md bg-slate-300 text-slate-600'>
            <div className='col-span-5 flex items-center'>
                <h1>{order.cartProducts[0].itemName}{order.cartProducts.length > 1 ? `, ${order.cartProducts[1].itemName} ...(${order.cartProducts.length} items)` : ''}</h1>
            </div>
            <div className='col-span-3 text-center flex justify-between md:justify-around items-center'>
                <h1>&#8377;{order.finalCartValue}</h1>
                {isAdmin && (
                    <span className={`font-semibold block ${order.paymentStatus ? 'bg-green-600' : 'bg-red-600'} px-3 py-2 text-white rounded-md`}>{order.paymentStatus ? 'Paid' : 'Not Paid'}</span>
                )}
            </div>
            <div className='col-span-4 pr-4 flex md:justify-end items-center gap-2 font-semibold'>
                <span className={`w-2 h-2 block rounded-full ${order.orderStatus === 'DELIVERED' ? 'bg-green-600' : order.orderStatus === 'PLACED' ? 'bg-blue-600' : 'bg-red-600'}`}></span>
                <h1>{order.orderStatus} on {orderDate}</h1>
            </div>
        </div>
    )
}
