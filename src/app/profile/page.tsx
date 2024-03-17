'use client';
import AdminTabs from '@/components/AdminTabs';
import EditableImage from '@/components/EditableImage';
import UserAddressInputs from '@/components/layout/UserAddressInputs';
import ShimmerSpinner from '@/components/shimmer/ShimmerSpinner';
import { useSession } from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

export default function ProfilePage() {

    const session = useSession();
    const {status} = session;
    
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [postal, setPostal] = useState('');
    const [country, setCountry] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [profileFetched, setProfileFetched] = useState(false);
    const [userImg, setUserImg] = useState('');

    const userInfo = async() => {
        setProfileFetched(false);
        const res = await fetch('/api/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();        
        
        if('error' in data){
            toast.error(data.error);
        }
        
        const {name, phone, streetAddress, city, postal, country, isAdmin} = data;
        setName(name);
        setPhone(phone);
        setStreetAddress(streetAddress);
        setCity(city);
        setPostal(postal);
        setCountry(country);
        setIsAdmin(isAdmin);
        setProfileFetched(true);
    }

    useEffect(() => {
        setUserImg('/user.png');
        userInfo();
    }, []);

    if(status === 'loading' || !profileFetched){
        return <ShimmerSpinner />;
    } else if(status === 'unauthenticated'){
        return redirect('/login');
    }

    async function handleProfileInfoUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try{
            const savingProfile = new Promise(async (resolve, reject) => {
                const res = await fetch('/api/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        phone,
                        streetAddress,
                        city,
                        postal,
                        country
                    })
                });

                if(res.ok) 
                    resolve('');
                else
                    reject();
            });

            await toast.promise(savingProfile, {
                loading: 'Saving...',
                success: 'Profile saved!',
                error: 'Some error occurred!'
            })

        }catch(err: any){
            toast.error(err.message);
        }
    }

    function handleAddressChange(type: 'phone'| 'streetAddress' | 'city' | 'postal' | 'country', val: string){
        if(type === 'phone'){
            setPhone(val);
        } else if(type === 'city'){
            setCity(val);
        } else if(type === 'country'){
            setCountry(val);
        } else if(type === 'postal'){
            setPostal(val);
        } else {
            setStreetAddress(val);
        }
    }

    return (
        <section className='mt-8'> 

            <AdminTabs isAdmin={isAdmin} />

            <div className='max-w-xl mx-auto mt-8'>
                <div className='md:flex gap-2'>
                    {/* <div>
                        <div className="p-2 rounded-lg relative">
                            <EditableImage link={userImg} setLink={setUserImg} height={100} width={100} />
                        </div>
                    </div> */}
                    <form className='grow' onSubmit={handleProfileInfoUpdate}>

                        <label>Your name</label>
                        <input type="text" placeholder='Your name' value={name} onChange={(e) => setName(e.target.value)} />

                        <label>Email</label>
                        <input type="email" value={session.data?.user?.email as string} disabled={true} />

                        <UserAddressInputs addressProps={{phone, streetAddress, city, postal, country}} setAddressProps={handleAddressChange} />

                        <button type='submit'>Save</button>
                    </form>
                </div>
            </div>
        </section>
    )
}
