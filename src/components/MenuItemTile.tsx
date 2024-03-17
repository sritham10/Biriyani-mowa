/* eslint-disable @next/next/no-img-element */
import React from 'react';

type SizeType = {
    name: string,
    price: string,
    _id: string
}

type PriorityType = {isPriority: boolean, priorityLabel: string};

type MenuItemType = {
    _id: string,
    itemName: string,
    itemDesc: string,
    itemPrice: number,
    menuImg: string,
    sizes?: SizeType[],
    category: string,
    priority: PriorityType
}

type Props = {
    item: MenuItemType,
    handleAddToCart: (item: MenuItemType, size: SizeType | null) => void
}

export default function MenuItem({item, handleAddToCart}: Props) {

    const {priority, menuImg, itemName, itemDesc, itemPrice, sizes} = item;

    return (
        <div className="bg-slate-100 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-white transition-all hover:shadow-md hover:shadow-black/25 relative">
                {priority.isPriority && (
                    <div className='absolute left-1 top-1 bg-black text-white px-4 py-1 rounded-lg'>
                        <span>{priority?.priorityLabel}</span>
                    </div>
                )}
                <div className='text-center'>
                    <img src={menuImg} alt={"DISH"} className='max-h-auto max-h-24 block mx-auto rounded-md object-fill' />
                </div>
                <h4 className='font-semibold text-lg my-3 text-wrap'>{itemName}</h4>
                <p className='text-slate-500 text-sm text-wrap line-clamp-3'>
                    {itemDesc}
                </p>
                <button 
                    type='button'
                    onClick={() => handleAddToCart(item, null)}
                    className="bg-primary text-white rounded-full px-4 py-2 mt-4"
                    >
                    {(sizes !== undefined && sizes.length > 0) ? (
                        <span>From &#8377;{itemPrice}/-</span>
                    ) : (
                        <span>Add to cart &#8377;{itemPrice}/-</span>
                    )}
                </button>
        </div>
    )
}
