import React from 'react'

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
    header: string,
    cartProducts: MenuItemType[],
    totalCartPrice: number,
    discountedPrice: number,
    finalCartPrice: number
}

export default function BillDetails({header, cartProducts, totalCartPrice, discountedPrice, finalCartPrice}: Props) {
   
    return (
        <div>
            <h1 className='mb-2 uppercase w-full border-solid border-b-2 border-b-slate-600 font-semibold text-black text-xl'>{header}</h1>
            <div className='flex mb-3 justify-between text-sm'>
                <div>
                    <span className='block my-1'>Price ({cartProducts.length} item{cartProducts.length > 1 ? 's' : ''})</span>
                    <span className='block my-1'>Delivery Charges</span>
                    <span className='block my-1'>Discount</span>
                </div>
                <div className='text-right'>
                    <span className='block my-1'>&#8377;{totalCartPrice}</span>
                    <span className='text-green-600 block my-1'>FREE</span>
                    <span className='text-green-600 block my-1'>- &#8377;{discountedPrice.toFixed()}</span>
                </div>
            </div>
            <div className='text-lg flex justify-between border-dotted border-y-2 py-2 w-full border-y-slate-600 mb-4'>
                <span className='block'>Total Amount</span>
                <span className='block text-right'>&#8377;{finalCartPrice}</span>
            </div>
            {discountedPrice !== 0 && (
                <div className='pb-4 text-green-600'>
                    You will save &#8377;{discountedPrice.toFixed()} on this Order.
                </div>
            )}
        </div>
    )
}
