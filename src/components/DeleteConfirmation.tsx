'use client';
import React, { useState } from 'react'

type Props = {
    label: string,
    onDelete: () => void
}

export default function DeleteConfirmation({label, onDelete}: Props) {

    const [confirm, setConfirm] = useState(false);

    if(confirm) {
        return (
            <div className='mt-2 flex gap-2'>
                <button 
                    type='button'  
                    className='bg-slate-200 text-slate-500'
                    onClick={() => setConfirm(false)}
                >
                    Cancel
                </button>
                <button 
                    type='button'  
                    className='bg-red-500 text-white'
                    onClick={onDelete}
                >
                    Yes, Delete!
                </button>
            </div>
        )
    }

    return (
        <button 
            type='button'
            className='mt-2'    
            onClick={() => setConfirm(true)}
        >
            {label}
        </button>
    )
}
