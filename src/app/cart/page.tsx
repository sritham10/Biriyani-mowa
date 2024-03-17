'use client';
import { CartContext } from '@/components/AppContext';
import SectionHeaders from '@/components/SectionHeaders';
import Trash from '@/components/icons/Trash';
import BillDetails from '@/components/layout/BillDetails';
import CartProductLayout from '@/components/layout/CartProductLayout';
import UserAddressInputs from '@/components/layout/UserAddressInputs';
import ShimmerSpinner from '@/components/shimmer/ShimmerSpinner';
import useProfileCheck from '@/components/useProfileCheck';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'

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

type ContextType = {
    addToCart: (item: MenuItemType, size: SizeType | null) => void;
    cartProducts: MenuItemType[];
    removeCartProduct: (prodId: string) => void;
    clearCart: () => void;
};

type CouponType = {
    couponCode: string,
    couponCodeLabel: 'Apply' | 'Invalid' | 'Applied',
    couponApplyStatus: boolean,
    couponError: boolean,
    couponDetails: string
}

export function calcCartProductPrice(cartProd: MenuItemType): number {
    let price = Number(cartProd.itemPrice);
    if(cartProd.sizes !== undefined && cartProd.sizes.length > 0){
        let sizePrice = cartProd.sizes.reduce((acc, curr) => acc+Number(curr.price), 0);
        price += sizePrice;
    }
    return price;
}

export function calcCartProductsPrice(cartProds: MenuItemType[]): number {
    let totalPrice = 0;
    cartProds.forEach(prod => {
        totalPrice += calcCartProductPrice(prod);
    });
    return totalPrice;
}

export default function CartPage() {

    const {status} = useSession();
    const {userData, loading} = useProfileCheck();    
    const [fetchLoading, setFetchLoading] = useState(false);
    const [address, setAddress] = useState({
        phone: '', 
        streetAddress: '', 
        city: '', 
        postal: '', 
        country: ''
    });

    const [redirection, setRedirection] = useState(false);
    const [orderDetails, setOrderDetails] = useState({
        orderId: '',
        orderStatus: ''
    });

    const [totalCartPrice, setTotalCartPrice] = useState(0);
    const [discountedPrice, setDiscountedPrice] = useState(0);
    const [finalCartPrice, setFinalCartPrice] = useState(0);
    

    const couponInitialState: CouponType = {
        couponCode: '',
        couponCodeLabel: 'Apply',
        couponApplyStatus: false,
        couponError: false,
        couponDetails: ''
    };

    const [coupon, setCoupon] = useState<CouponType>(couponInitialState);

    const { cartProducts, clearCart }: ContextType = useContext<any>(CartContext);

    useEffect(() => {
        const totalCartValue = calcCartProductsPrice(cartProducts);
        setTotalCartPrice(totalCartValue);
        setFinalCartPrice(totalCartValue);
    }, [cartProducts])

    useEffect(() => {
        if(coupon.couponCode.length === 0){
            couponToInitialState();
        }
    }, [coupon.couponCode])

    useEffect(() => {
        if(userData){
            const {phone, streetAddress, city, postal, country} = userData;
            const addressFromProfile = {phone, streetAddress, city, postal, country};
            setAddress(addressFromProfile);
        }
    }, [userData]);

    async function placeOrder(ev: React.FormEvent<HTMLFormElement>) {
        setFetchLoading(true);
        
        ev.preventDefault();
        const filteredCartProducts = cartProducts.map(prod => {
            const {itemDesc, cartId, category, priority, createdAt, updatedAt, ...newObj} = prod;
            return newObj;
        })

        // save cartProducts[] and the address to be sent to STRIPE
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cartProducts: filteredCartProducts,
                address,
                cartValue: totalCartPrice,
                finalCartValue: finalCartPrice,
                discountValue: discountedPrice,
                couponApplied: coupon.couponCode
            })
        });
        const data = await res.json();
        // via backend, backend would send us a link for STRIPE ReDIRECTION
        if(res.ok){
            setOrderDetails({orderId: data.orderId, orderStatus: data.orderStatus});
            setRedirection(true);
        }

        setFetchLoading(false);
    }  

    function handleAddressChange(type: 'phone'| 'streetAddress' | 'city' | 'postal' | 'country', val: string) {
        setAddress(prev =>  ({...prev, [type]: val}))
    }

    function couponToInitialState() {
        setCoupon(couponInitialState);
        setDiscountedPrice(0);
        const totalCartValue = calcCartProductsPrice(cartProducts);
        setFinalCartPrice(totalCartValue);
    }

    function handleCoupon(){
        if(coupon.couponCode.length > 0){
            // validation check of coupon code.
            // if valid
            if(coupon.couponCode === 'MOWABRO5'){
                setCoupon(prev => ({...prev, couponApplyStatus: true}));
                setCoupon(prev => ({...prev, couponCodeLabel: 'Applied'}));
                setCoupon(prev => ({...prev, couponDetails: ''}));
                setCoupon(prev => ({...prev, couponError: false}));
                const discount = 5/100;
                const discountedPrice = (totalCartPrice*discount);
                setDiscountedPrice(Number(discountedPrice.toFixed()));
                const finalCartValue = totalCartPrice-discountedPrice;
                setFinalCartPrice(Number(finalCartValue.toFixed()));
            } else {
                setCoupon(prev => ({...prev, couponApplyStatus: true}));
                setCoupon(prev => ({...prev, couponCodeLabel: 'Invalid'}));
                setCoupon(prev => ({...prev, couponDetails: 'Invalid Coupon Code'}));
                setCoupon(prev => ({...prev, couponError: true}));
                setDiscountedPrice(0);
                setFinalCartPrice(Number(totalCartPrice.toFixed()));
            }
        }
    }
    
    if(redirection){
        clearCart();
        setRedirection(false);
        return redirect(`/checkout?orderId=${orderDetails.orderId}&orderStatus=${orderDetails.orderStatus}`);
    }

    if(status === 'unauthenticated'){
        return redirect('/login');
    } else if(status === 'loading' || fetchLoading || !loading){
        return <ShimmerSpinner />
    }

    return (
        <section className='mt-8'>
            <div className="text-center">
                <SectionHeaders mainHeader='Your cart' />
            </div>
                {cartProducts.length > 0 ? (
                    <div className='md:grid grid-cols-12 gap-7 mt-8'>
                        <div className='col-span-8'>
                            {cartProducts.map(prod => (
                                <CartProductLayout key={prod._id} prod={prod} />
                            ))}
                            <div className='py-4 text-right pr-3 text-xl'>
                                <span className='text-slate-500'>Subtotal: </span>
                                <span className='font-semibold'>&#8377;{totalCartPrice}</span>
                            </div>
                        </div>
                        <div className='col-span-4 mt-8 md:mt-0'>
                            <div className='bg-slate-300 p-4 rounded-lg '>
                                <h2 className='font-semibold text-black text-xl'>Order Summary</h2>
                                <form onSubmit={placeOrder}>
                                    <UserAddressInputs addressProps={address} setAddressProps={handleAddressChange} />
                                    
                                    
                                    <div className="grid grid-cols-12 items-center gap-2">
                                        <div className='col-span-9'>
                                            <label>Apply Coupon</label>
                                            <input type="text" placeholder='Coupon code' value={coupon.couponCode} onChange={e => setCoupon(prev => ({...prev, couponCode: e.target.value}))} />
                                        </div>
                                        
                                        <div className='mt-4 col-span-3'>
                                            <button 
                                                onClick={handleCoupon}
                                                className='pl-2 border-0 rounded' type='button'>
                                                    {coupon.couponCodeLabel}
                                            </button>
                                        </div>
                                    </div>
                                    {/* {couponApplyStatus && !couponError && (
                                        <div className='pb-2 text-green-700'>
                                            {couponDetails}
                                        </div>
                                    )} */}
                                    {coupon.couponApplyStatus && coupon.couponError && (
                                        <div className='pb-2 text-red-700'>
                                            {coupon.couponDetails}
                                        </div>
                                    )}

                                    <div>
                                        <h1 className='my-4 pt-4 uppercase border-solid border-t-2 w-full border-t-slate-600'>Bill Details</h1>
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
{/*                                     
                                    <div className='mt-3 border-solid border-t-2 w-full border-t-slate-600'>
                                        <BillDetails header='Bill Details' cartProducts={cartProducts} totalCartPrice={totalCartPrice} discountedPrice={discountedPrice} finalCartPrice={finalCartPrice} />
                                    </div> */}

                                    <button type="submit">Checkout</button>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='text-center mt-4'>
                        No Items in the Cart.
                    </div>
                )}
        </section>
    )
}
