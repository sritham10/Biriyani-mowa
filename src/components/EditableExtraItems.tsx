'use client';
import React, { useState } from 'react'
import { v4 as uuid } from 'uuid'
import Trash from './icons/Trash'
import Plus from './icons/ChevronDown';
import Minus from './icons/ChevronUp';

type SizeType = {
    name: string,
    price: string,
    _id?: string
}

type Props = {
    items: SizeType[],
    setItems: React.Dispatch<React.SetStateAction<SizeType[]>>,
    formType: string,
    addBtnLabel: string
}

export default function EditableSize({items, setItems, formType, addBtnLabel}: Props) {

    const [isOpen, setIsOpen] = useState(false);

    function toggleView(){
        if(items.length > 0){
            setIsOpen(prev => !prev);
        }
    }

    function addItem() {
        setIsOpen(true);
        setItems(prev => [...prev, {name: '', price: '0', _id: uuid()}]);
    }

    function removeItem(item: SizeType) {
        setItems(prev => prev.filter(i => i._id !== item._id));
        if(items.length === 1) setIsOpen(false);
    }

    function editItem(val: string, id: string, field: 'name' | 'price'){
        setItems(prev => (
            prev.map(item => item._id === id ? {...item, [field]: val} :  item)
        ));
    }

    return (
        <div className="bg-slate-200 p-2 rounded-md mb-2">
            <div className='flex justify-between items-center pb-2 my-2 border-b border-black'>
                <h3 className='text-slate-700 font-semibold'>{formType} ({items.length})</h3>
                <span className='mr-1 cursor-pointer bg-white rounded-md p-1' onClick={toggleView}>
                    {isOpen ? (
                        <Minus />
                    ) : (
                        <Plus />
                    )}
                </span>
            </div>
            
            {items.length > 0 && isOpen && items.map((item) => (
                <main key={item._id} className='flex gap-2 items-end pt-1'>
                    <div>
                        <label>Name</label>
                        <input type="text" placeholder='Size name' value={item.name} onChange={(e) => editItem(e.target.value, item?._id!, 'name')} />
                    </div>
                    <div>
                        <label>Extra price</label>
                        <input type="text" placeholder='Extra price' value={item.price} onChange={(e) => editItem(e.target.value, item?._id!, 'price')} />
                    </div>
                    <div>
                        <button type='button' onClick={() => removeItem(item)} className='bg-white mb-2 px-2'>
                            <Trash />
                        </button>
                    </div>
                </main>
            ))}

            <button type='button' onClick={addItem} className='bg-white flex justify-center items-center gap-2'>
                <span className='text-2xl font-thin'>+ </span>
                {addBtnLabel}
            </button>
        </div>
    )
}
