'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import React, { Dispatch, SetStateAction } from 'react'
import toast from 'react-hot-toast';

type Props = {
    link: string,
    setLink: Dispatch<SetStateAction<string>>,
    height?: number,
    width?: number,
}

export default function EditableImage({link, setLink, height=190, width=190}: Props) {

    const handleFileChange = async(e: React.ChangeEvent<HTMLInputElement>) => {        
        const files = e.target.files;
        if(files?.length === 1){
            const data = new FormData;
            data.set('file', files[0]);

            const uploadPromise = new Promise<string>(async(resolve, reject) => {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: data,
                });

                const r = await response.json();

                
                if(response.ok){
                    setLink('/user.png');
                    resolve('Image uploaded successfully!');
                } else {
                    setLink('');
                    reject('Something went wrong!');
                }

            });

            await toast.promise(uploadPromise, {
                loading: 'Image Uploading...',
                success: (data: string) => data,
                error: (data: string) => data
            })

        }
    }       

    return (
        <>  
            {link !== undefined && link !== '' ? (
                <Image className='rounded-lg w-full h-full mb-1' src={link} width={width} height={height} alt='user_avatar' />
            ) : (
                <div className='bg-slate-200 p-4 text-slate-500 rounded-lg mb-4 text-center'>
                    No Image
                </div>
            )}
            
            <form>
                <label>
                    <input type="file" name='file' className='hidden' onChange={handleFileChange} />
                    <span className='block rounded-lg p-2 border border-slate-400 text-center cursor-pointer'>Select Image</span>
                </label>
            </form>
        </>
    )
}
