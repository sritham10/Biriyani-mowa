import React from 'react'

export default function ShimmerSpinner() {
    return (
        <div className="fixed z-10 inset-0 flex items-center justify-center  bg-black/80 h-screen">
            <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
            <img src={'/BRAND_LOGO.jpg'}  className="rounded-full h-28 w-28" />
        </div>
    )
}
