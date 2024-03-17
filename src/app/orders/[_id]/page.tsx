'use client';
import React, { useEffect, useState } from 'react'
import SectionHeaders from '@/components/SectionHeaders'
import { redirect, useParams, useRouter } from 'next/navigation';
import UserAddressInputs from '@/components/layout/UserAddressInputs';
import CartProductLayout from '@/components/layout/CartProductLayout';
import BillDetails from '@/components/layout/BillDetails';
import useProfileCheck from '@/components/useProfileCheck';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import ShimmerSpinner from '@/components/shimmer/ShimmerSpinner';

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

type OrderType = {
    phone: string, 
    streetAddress: string, 
    city: string, 
    postal: string, 
    country: string,
    cartProducts: MenuItemType[],
    cartValue: number,
    finalCartValue: number,
    discountValue: number,
    orderStatus: string,
    paymentMode: string,
    userEmail: string,
    paymentStatus: boolean
}

export default function OrderPage() {

    const {status} = useSession();
    const {loading, isAdmin} = useProfileCheck();    
    const [fetchLoading, setFetchLoading] = useState(false);
    const {_id} = useParams();
    const router = useRouter();

    const [editToggle, setEditToggle] = useState(false);
    const [userDetails, setUserDetails] = useState<any>({});
    const [order, setOrder] = useState<OrderType | null>(null);
    const [redirection, setRedirection] = useState(false); 

    const orderStatuses = ['INITIATED', 'PLACED', 'CANCELED', 'ON THE WAY', 'DELIVERED'];
    const paymentTypes = ['COD', 'ONLINE'];
    const paymentStatus = ['PAID', 'NOT PAID'];
    const [selectedOrderStatus, setSelectedOrderStatus] = useState<any>(orderStatuses[0]);
    const [selectedPaymentType, setSelectedPaymentType] = useState<any>(paymentTypes[0]);
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<any>(paymentStatus[1]);
    
    useEffect(() => {
        async function getOrder() {
            const res = await fetch(`/api/orders/${_id}`, {
                method: 'GET'
            });
            const data = await res.json(); 
            if(res.ok){
                setOrder(data);
                setSelectedOrderStatus(data.orderStatus);
                setSelectedPaymentType(data.paymentMode);
                setSelectedPaymentStatus(data.paymentStatus ? paymentStatus[0] : paymentStatus[1]);
            } else {
                toast.error(data.error);
                setRedirection(true);
            }
        }
        setFetchLoading(true);
        getOrder();
        setFetchLoading(false);
    }, []);

    useEffect(() => {
        async function getUserDetails() {
            const res = await fetch('/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userEmail: order?.userEmail})
            });
            const data = await res.json();
            if(res.ok) setUserDetails(data);
        }

        if(order?.userEmail){
            setFetchLoading(true);
            getUserDetails();
            setFetchLoading(false);
        }
    }, [order]);

    async function changeOrder(orderStatus: string, paymentMode : 'COD' | 'ONLINE', paymentStatus: 'PAID' | 'NOT PAID'){
        setFetchLoading(true);
        const res = await fetch(`/api/orders/${_id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderStatus,
                paymentMode,
                paymentStatus: paymentStatus === 'PAID' ? true : false

            })
        });
        const data = await res.json();
        
        if(res.ok){
            toast.success('Order details updated')
        } else {
            toast.error(data.error)
        }
        
        setFetchLoading(false);
        router.push('/orders');
    }

    async function cancelOrder(orderStatus: string){
        setFetchLoading(true);
        const res = await fetch(`/api/orders/${_id}?cancelOrder=true`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderStatus,
            })
        });
        const data = await res.json();
        
        if(res.ok){
            toast.success('Order details updated')
        } else {
            toast.error(data.error)
        }
        
        setFetchLoading(false);
        router.push('/orders');
    }

    function handleEditToggle(){
        if(editToggle){
            changeOrder(selectedOrderStatus, selectedPaymentType, selectedPaymentStatus);
            setEditToggle(false);
        } else {
            setEditToggle(true);
        }
    }

    let obj: OrderType = {
        phone: '', 
        streetAddress: '', 
        city: '', 
        postal: '', 
        country: '',
        cartProducts: [],
        cartValue: 0,
        finalCartValue: 0,
        discountValue: 0,
        orderStatus: '',
        paymentMode: '',
        userEmail: '',
        paymentStatus: false
    };
    if(order!==null) obj = {...order};

    if(status === 'unauthenticated'){
        return redirect('/login');
    } else if(status === 'loading' || fetchLoading || !loading){
        return <ShimmerSpinner />
    } else if(redirection) {
        setRedirection(false);
        return redirect('/orders');
    }

    return (
        <section className='max-w-6xl mx-auto text-center mt-12'>
            <SectionHeaders mainHeader={isAdmin && userDetails && userDetails.name ? `${userDetails.name}'s Order` : 'Your Order'} />
            <div className="my-4">
                <p>Thanks for placing your Order.</p>
            </div>
            <div className='my-4 md:text-balance text-left flex flex-col gap-3'>
                <h1 className='text-xl font-semibold'>
                    Order Status: 
                    {editToggle ? (
                        <div className='max-w-xs text-sm'>
                            <select value={selectedOrderStatus} onChange={e => setSelectedOrderStatus(e.target.value)}>
                                {orderStatuses.map((status, i) => (
                                    <option key={i}>{status}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <span className={`${order?.orderStatus === 'DELIVERED' ? 'text-green-600' : order?.orderStatus === 'CANCELED' ? 'text-red-600' : 'text-blue-600'}`}> {order?.orderStatus}
                        </span>
                    )}
                    
                </h1>
                <h1 className='text-xl font-semibold'>
                    Payment Method: 
                    {editToggle ? (
                        <div className='max-w-xs text-sm'>
                            <select value={selectedPaymentType} onChange={(e) => setSelectedPaymentType(e.target.value)}>
                                {paymentTypes.map((payment, i) => (
                                    <option key={i}>{payment}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <span className='text-green-600'> {order?.paymentMode}</span>
                    )}
                </h1>
                {isAdmin && (
                    <>
                        <h1 className='text-lg font-semibold'>
                            Payment Status:
                            {editToggle ? (
                                <div className='max-w-xs text-sm'>
                                    <select value={selectedPaymentStatus} onChange={(e) => setSelectedPaymentStatus(e.target.value)}>
                                        {paymentStatus.map((payment, i) => (
                                            <option key={i}>{payment}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <span className={`ml-2 p-2 rounded-md text-white ${order?.paymentStatus ? 'bg-green-600' : 'bg-red-600'}`}>
                                    {order?.paymentStatus ? 'PAID' : 'NOT PAID'}
                                </span>
                            )}
                        </h1>
                        <button onClick={handleEditToggle} type='button' className='bg-primary text-white mx-auto md:mx-0 w-1/2 md:w-1/6'>
                            {editToggle ? 'Save' : 'Change'}
                        </button>
                    </>
                )}
                {order?.orderStatus !== 'CANCELED' && (
                    <button onClick={() => cancelOrder('CANCELED')} type='button' className='bg-red-600 text-white mx-auto w-1/2 md:mx-0 md:w-1/6'>
                        Cancel Order
                    </button>
                    )}
            </div>
            <div>
                {order !== null && (
                    <>
                        <div className='md:grid grid-cols-12 gap-8 mt-8'>
                            <div className='col-span-8 flex flex-col p-4'>
                                <h1 className='text-left font-semibold text-black text-xl'>Items in this order</h1>
                                {order.cartProducts !== undefined && order.cartProducts.map((item) => (
                                    <CartProductLayout trashIcon={false} key={item._id} prod={item} />
                                    ))}
                            </div>
                            
                            <div className='col-span-4'>
                                <div className="text-slate-300 p-4 rounded-md text-left">
                                    <h1 className='font-semibold text-black text-xl'>Delivery Address</h1>
                                    <UserAddressInputs setAddressProps={() => {}} addressProps={obj} disabled={true} />
                                </div>
                                <div className='text-left p-4'>
                                    <BillDetails header='BILLING' cartProducts={order.cartProducts} totalCartPrice={order.cartValue} finalCartPrice={order.finalCartValue} discountedPrice={order.discountValue} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}
