import React from 'react'

type Props = {
    subHeader?: string,
    mainHeader: string
}

export default function SectionHeaders({subHeader, mainHeader}: Props) {
    return (
        <>
            <h3 className='uppercase text-slate-500 font-semibold leading-4'>{subHeader}</h3>
            <h2 className='text-primary font-bold text-4xl italic'>{mainHeader}</h2>
        </>
    )
}
