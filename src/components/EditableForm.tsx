import React, { useEffect, useState } from 'react'
import AdminTabs from './AdminTabs'
import Link from 'next/link'
import Left from './icons/Left'
import EditableImage from './EditableImage'
import EditableSize from './EditableExtraItems'
import DeleteConfirmation from './DeleteConfirmation'

type CategoryType = {_id: string, name: string};

type SizeType = {
    name: string,
    price: string,
    _id?: string
}

type PriorityType = {isPriority: boolean, priorityLabel: string};

type Props = {
    formType: 'ADD_MENU' | 'EDIT_MENU',
    isAdmin: boolean,
    handleFormSubmit: (itemName: string, itemDesc: string, itemPrice: string, menuImg: string, sizes: SizeType[], category: string, _priority: PriorityType) => Promise<void>,
    menuItem?: {_id: string, itemName: string, itemDesc: string, itemPrice: string, menuImg: string , sizes?: SizeType[], category: string, priority: PriorityType} | undefined,
    handleFormDelete?: (_id: string) => Promise<void>
}

export default function EditableForm({isAdmin, formType, handleFormSubmit, menuItem, handleFormDelete}: Props) {

    const [isPriority, setIsPriority] = useState<boolean>(menuItem?.priority.isPriority || false);
    const [priorityLabel, setPriorityLabel] = useState<string>(menuItem?.priority.priorityLabel || '');

    const [menuImg, setMenuImg] = useState(menuItem?.menuImg || '');
    const [itemName, setItemName] = useState(menuItem?.itemName || '');
    const [itemDesc, setItemDesc] = useState(menuItem?.itemDesc || '');
    const [itemPrice, setItemPrice] = useState(menuItem?.itemPrice || '');
     
    const [selectedCategory, setSelectedCategory] = useState(menuItem?.category || '');
    const [categories, setCategories] = useState<CategoryType[]>([]);
    
    const [sizes, setSizes] = useState<SizeType[]>(menuItem?.sizes || []);

    useEffect(() => {
        const fetchCategories = async() => {
            const res = await fetch('/api/categories');
            const data = await res.json();
            if(res.ok) setCategories(data);
        }
        fetchCategories();
    }, [])

    function handleDelete(_id: string){
        if(handleFormDelete){
            handleFormDelete(_id);
        }
    }

    function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        const _priority = {isPriority, priorityLabel};
        handleFormSubmit(itemName, itemDesc, itemPrice, menuImg, sizes, selectedCategory, _priority);
    }

    const handlePriorityChange = (value: boolean) => {
        setIsPriority(value);
        // Clear the text when priority changes to 'no'
        if (!value) {
          setPriorityLabel('');
        }
    };
    return (
        <section className='mt-8'>
            <AdminTabs isAdmin={isAdmin} />
            <div className='mt-8 flex justify-center'>
                <Link className='bg-primary hover:bg-white hover:text-primary text-white duration-300 px-4 py-2 border border-primary rounded-lg flex gap-2 items-center' href={'/menu-items'}>
                    <Left /> 
                    Go to Menu Items
                </Link>
            </div>
            <div className='mt-8 max-w-xl mx-auto'>
                <div className="md:flex gap-4 items-start">
                    <div className="w-1/2 md:w-1/5 mx-auto md:mx-0">
                        <EditableImage link={menuImg} setLink={setMenuImg} height={85} width={85} />
                    </div>
                    <div className='grow'>
                        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
                            <label>Item name</label>
                            <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} />

                            <label>Description</label>
                            <input type="text" value={itemDesc} onChange={(e) => setItemDesc(e.target.value)} />
                            
                            <label>Base Price</label>
                            <input type="text" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} />

                            {categories.length > 0 && (
                                <>
                                    <label>Category</label>
                                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                        {categories.map(cat => (
                                            <option key={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </>
                            )}

                            <label>Priority</label>
                            <div className='my-2 flex gap-2'>
                                <label className='flex gap-2'>
                                    <input
                                        type="radio"
                                        value="yes"
                                        checked={isPriority}
                                        onChange={() => handlePriorityChange(true)}
                                        />
                                    Yes
                                </label>
                                <label className='flex gap-2'>
                                    <input
                                        type="radio"
                                        value="no"
                                        checked={!isPriority}
                                        onChange={() => handlePriorityChange(false)}
                                        />
                                    No
                                </label>
                            </div>

                            {isPriority && (
                                <>
                                    <label>Priority Label</label>
                                    <input type="text" value={priorityLabel} onChange={(e) => setPriorityLabel(e.target.value)} />
                                </>
                            )}
                            

                            <EditableSize items={sizes} setItems={setSizes} formType='Sizes' addBtnLabel='Add new item size' />

                            <button type='submit'>{formType === 'ADD_MENU' ? 'Save' : 'Update'}</button>

                            {formType === 'EDIT_MENU' && (
                                <DeleteConfirmation label='Delete Menu Item' onDelete={() => handleDelete(menuItem?._id!)} />
                            )}                            
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
