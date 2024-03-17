'use client';
import AdminTabs from '@/components/AdminTabs'
import Edit from '@/components/icons/Edit';
import ShimmerSpinner from '@/components/shimmer/ShimmerSpinner';
import useProfileCheck from '@/components/useProfileCheck';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type User = {
    name: string,
    email: string,
    _id: string,
    isAdmin: boolean
}

export default function UsersPage() {

    const {status} = useSession();
    const {loading, isAdmin} = useProfileCheck();
    const [fetchLoading, setFetchLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);

    const fetchAllUsers = async() => {
        const res = await fetch('/api/users');
        const data = await res.json();
        if(res.ok) setUsers(data);
    }

    useEffect(() => {
        setFetchLoading(true);
        fetchAllUsers();
        setFetchLoading(false);
    }, [])

    if(status === 'unauthenticated'){
        return redirect('/login');
    } else if(!isAdmin && loading) {
        return redirect('/profile');
    } else if(status === 'loading' || fetchLoading || users.length === 0){
        return <ShimmerSpinner />
    }

    async function changeUserStatus(userId: string, actionType: 'USER' | 'ADMIN'){
        const changeUserStatusPromise = new Promise(async(resolve, reject) => {
            const res = await fetch('/api/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userId, actionType})
            });

            const data = await res.json();

            if(res.ok) {
                fetchAllUsers();
                resolve(`${data?.name} has been made ${actionType}`)
            } else {
                reject(data?.error);
            }
        });

        await toast.promise(changeUserStatusPromise, {
            loading: 'Updating User\'s status...',
            success: (data: any) => data ,
            error: (err) => err
        })

    }

    return (
        <section className='mt-8 max-w-2xl mx-auto'>
            <AdminTabs isAdmin={isAdmin} />
            {users.length > 0 && (
                <div className='mt-8'>
                    {users.map(user => (
                        <div className='bg-slate-200 rounded-lg my-2 px-2 py-4 flex justify-between items-center' key={user._id}>
                            <div className='grow flex flex-col'>
                                <span>Name: <i> <b>{user.name || 'No name'}</b></i></span>
                                <span>Email: <b>{user.email}</b></span>
                                <span>Status: <b className={user.isAdmin ? 'text-red-600 uppercase': 'text-blue-600 uppercase'}>{user.isAdmin ? 'Admin' : 'User'}</b></span>
                            </div>
                            <div className={user.isAdmin ? 'hidden': 'block'}>
                                <button onClick={() => changeUserStatus(user._id, 'ADMIN')} className='px-2 hover:bg-green-500 hover:text-white'>
                                    Make Admin
                                </button>
                            </div>
                            <div className={!user.isAdmin ? 'hidden': 'block'}>
                                <button onClick={() => changeUserStatus(user._id, 'USER')} className='px-2 hover:bg-red-500 hover:text-white'>
                                    Revoke Access
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div>
                
            </div>
        </section>
    )
}
