import Image from 'next/image'
import React from 'react'
import MAIN_DISH from '../../public/MAIN_DISH.png' 
import Right from './icons/Right'
import Link from 'next/link'

export default function Hero() {
    return (
        <section className='hero mt-4'>
            <div className='py-4 md:py-14'>
                <h1 className='text-4xl font-semibold'>We will make you start love affair in our <span className='text-primary'>Biryani</span></h1>
                <p className='my-6 text-slate-500 text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil dignissimos eveniet repudiandae possimus ut nam quasi aperiam animi repellat, at</p>
                <div className='flex gap-4 text-sm'>
                    <Link href={'/menu'} className='bg-primary text-white flex justify-center items-center w-full gap-2 px-6 py-2 rounded-full uppercase'>
                        <span className='grow'>Order now</span>
                        <Right />
                    </Link>
                    <button className='border-0 flex items-center gap-2 py-2 text-slate-600 font-semibold'>
                        Learn more 
                        <Right />
                    </button>
                </div>
            </div>
            <div className='w-22 h-22 relative hidden md:block'>
                <Image src={MAIN_DISH} alt='MAIN_DISH' width={400} height={400} className='ml-44' /> 
            </div>
        </section>
    )
}
