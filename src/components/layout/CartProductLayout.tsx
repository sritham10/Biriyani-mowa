'use client';

import Image from 'next/image';
import React, { useContext } from 'react'
import Trash from '../icons/Trash';
import { calcCartProductPrice } from '@/app/cart/page';
import { CartContext } from '../AppContext';

type SizeType = {
    name: string;
    price: string;
    _id: string;
};

type PriorityType = { isPriority: boolean; priorityLabel: string };

type MenuItemType = {
    _id: string;
    itemName: string;
    itemDesc: string;
    itemPrice: number;
    menuImg: string;
    sizes?: SizeType[];
    category: string;
    priority: PriorityType;
    cartId: string;
    updatedAt: string;
    createdAt: string;
};

type Props = {
    prod: MenuItemType,
    trashIcon?: boolean
}

type ContextType = {
    addToCart: (item: MenuItemType, size: SizeType | null) => void;
    cartProducts: MenuItemType[];
    removeCartProduct: (prodId: string) => void;
    clearCart: () => void;
};

export default function CartProductLayout({prod, trashIcon = true}: Props) {

    const { removeCartProduct }: ContextType = useContext<any>(CartContext);

    return (
        <div key={prod._id} className='flex items-start gap-4 py-4 my-2 border-b border-b-slate-400'>
            <div className='w-24'>
                {/* Left */}
                <Image className='rounded-lg' src={prod.menuImg} alt='DISH' width={240} height={240} />
            </div>
            <div className='flex flex-col grow'>
                {/* Right */}
                <h1 className='font-semibold'>
                    {prod.itemName}
                </h1>
                {prod.sizes && prod.sizes.map(size => (
                    <div key={size._id} className='text-sm text-slate-700'>
                        <h3>Size: <span>{size.name}</span></h3>
                    </div>
                ))}
            </div>
            <div className='flex flex-col items-center gap-2'>
                <h1 className='text-lg font-semibold'>&#8377;{calcCartProductPrice(prod)}</h1>
                {trashIcon && <div>
                    <button 
                        type='button'
                        onClick={() => removeCartProduct(prod.cartId)}
                        className='p-2 border-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white'>
                        <Trash />
                    </button>
                </div>}
            </div>
        </div>
    )
}
