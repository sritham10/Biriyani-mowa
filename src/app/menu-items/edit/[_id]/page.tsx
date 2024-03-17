/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import EditableForm from '@/components/EditableForm';
import ShimmerSpinner from '@/components/shimmer/ShimmerSpinner';
import useProfileCheck from '@/components/useProfileCheck';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

type PriorityType = {isPriority: boolean, priorityLabel: string};


type SizeType = {
    name: string,
    price: string,
    _id?: string
}

type MenuItemType = {
    _id: string, 
    itemName: string, 
    itemDesc: string, 
    itemPrice: string, 
    menuImg: string , 
    sizes?: SizeType[],
    category: string,
    priority: PriorityType
}

type Props = {
    params: {
        _id: String
    }
}

export default function EditMenuItem({params}: Props) {

    const {status} = useSession();
    const {loading, isAdmin} = useProfileCheck();
    const [fetchLoading, setFetchLoading] = useState(false);

    const [menuItem, setMenuItem] = useState<MenuItemType>();
    const [redirection, setRedirection] = useState(false);

    useEffect(() => {
        const fetchMenuItem = async() => {
            const res = await fetch(`/api/menu-items/${params._id}`);
            const data = await res.json();
            setMenuItem(data);
        }
        setFetchLoading(true);
        fetchMenuItem();
        setFetchLoading(false);
    }, [])



    const handleFormSubmit = async(itemName: string, itemDesc: string, itemPrice: string, menuImg: string, sizes: SizeType[], category: string, _priority: PriorityType) => {
        let newSizes:SizeType[] | [] = [];
        if(sizes.length > 0){
            newSizes = sizes.map(obj => {
                const {_id, ...newObj} = obj;
                return newObj;
            })
        }

        setRedirection(false);
        const saveMenuPromise = new Promise<string>(async(resolve, reject) => {
            try {
                const res = await fetch('/api/menu-items', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({_id: params._id, itemName, itemDesc, itemPrice, menuImg, sizes: newSizes, category, priority: _priority})
                });

                const data = await res.json();
                
                if(res.ok) {
                    setRedirection(true);
                    resolve(data);
                } else {
                    if(data.error.includes('E11000')){
                        reject(`${itemName} already exists!`);
                    }
                    reject('Something went wrong!');
                }
            }catch(err: any){
                reject(err.message);
            }
        });

        setFetchLoading(true);
        await toast.promise(saveMenuPromise, {
            loading: 'Updating Menu item...',
            success: (data) => `Updated ${data}`,
            error: (data) => data
        });
        setFetchLoading(false);
    }

    const handleFormDelete = async(_id: string) => {
        setRedirection(false);

        const deleteMenuItemPromise = new Promise(async(resolve, reject) => {
            const res = await fetch(`/api/menu-items/${params._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if(res.ok){
                setRedirection(true);
                resolve(data);
            } else {
                reject('Something went wrong!');
            }
        });

        setFetchLoading(true);
        await toast.promise(deleteMenuItemPromise, {
            loading: 'Deleting Menu item...',
            success: (data: any) => `Deleted ${data.itemName}`,
            error: (data) => data
        });
        setFetchLoading(false);
    }

    if(redirection){
        setRedirection(false);
        return redirect('/menu-items');
    }
    
    if(status === 'unauthenticated'){
        return redirect('/login');
    } else if(!isAdmin && loading) {
        return redirect('/profile');
    } else if(status === 'loading' || fetchLoading || !loading){
        return <ShimmerSpinner />
    }

    return (
        <>
            {menuItem !== undefined && (
                <EditableForm formType='EDIT_MENU' isAdmin={isAdmin} handleFormSubmit={handleFormSubmit} menuItem={menuItem} handleFormDelete={handleFormDelete} />
            )}
        </>
    )
}
