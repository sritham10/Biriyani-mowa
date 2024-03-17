'use client';

import AdminTabs from '@/components/AdminTabs'
import Edit from '@/components/icons/Edit';
import Trash from '@/components/icons/Trash';
import ShimmerSpinner from '@/components/shimmer/ShimmerSpinner';
import useProfileCheck from '@/components/useProfileCheck';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

type Category = {_id: string, name: string};

export default function CategoriesPage() {

    const {status} = useSession();

    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [editCategory, setEditCategory] = useState<Category | null | undefined>(null);
    const [fetchLoading, setFetchLoading] = useState(false);
    const {loading, isAdmin} = useProfileCheck();

    const fetchCategories = async() => {
        try{
            const data = await fetch('/api/categories', {
                method: 'GET',
            });
            const res = await data.json();
            setCategories(res);
        }catch(err: any){
            toast.error(err.message);
        }
    }

    useEffect(() => {
        setFetchLoading(true);
        fetchCategories();
        setFetchLoading(false);
    }, []);

    if(status === 'unauthenticated'){
        return redirect('/login');
    } else if(!isAdmin && loading) {
        return redirect('/profile');
    } else if(status === 'loading' || fetchLoading){
        return <ShimmerSpinner />
    }
    
    const deleteCategory = async({_id, name}: Category) => {
        if(confirm(`Are you sure, you want to delete ${name} ?`)){
            const deleteCategoryPromise = new Promise(async(resolve, reject) => {
                const res = await fetch('/api/categories', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({_id})
                });
    
                const data = await res.json();
    
                if(res.ok) {
                    fetchCategories();
                    resolve(data?.name);
                } else {
                    reject(data?.error);
                }
    
            });
    
            await toast.promise(deleteCategoryPromise, {
                loading: 'Deleting a category...',
                success: (data) => `Deleted Category: "${data}".` ,
                error: (err) => err
            })
        } else {
            toast.success('This Category won\'t be deleted');
        }

        
    }  

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const body: {categoryName?: string, _id?: string} = {categoryName};
        if(editCategory !== null){
            body.categoryName = categoryName;
            body._id = editCategory?._id
        }
        
        const addOrEditCategoryPromise = new Promise(async(resolve, reject) => {  
            const res = await fetch('/api/categories', {
                method: editCategory !== null ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            setCategoryName('');
            if(editCategory !== null) setEditCategory(null);

            if(res.ok) {
                fetchCategories();
                resolve(data?.name);
            } else {
                reject(data?.error);
            }
        })

        await toast.promise(addOrEditCategoryPromise, {
            loading: editCategory !== null ? 'Updating category...' : 'Adding new category...',
            success: (data) => editCategory !== null ? `Updated: ${data}.` : `New Category: "${data}" is added.` ,
            error: (err) => err
        })
    }

    return (
        <section className='mt-8 mx-w-lg mx-auto'>
            <AdminTabs isAdmin={true} />

            <form className='mt-8 max-w-xl mx-auto' onSubmit={handleSubmit}>
                <div className="flex gap-2 items-center">
                    <div className='grow'>
                        {editCategory !== null && editCategory !== undefined ? (
                            <>
                                <label>Edit category name</label>
                                <input 
                                    type="text" 
                                    placeholder='Edit category name' 
                                    value={categoryName} 
                                    onChange={(e) => setCategoryName(e.target.value)} 
                                />
                            </>
                        ) : (
                            <>
                                <label>New category name</label>
                                <input 
                                    type="text" 
                                    placeholder='New category name' 
                                    value={categoryName} 
                                    onChange={(e) => setCategoryName(e.target.value)} 
                                />
                            </>
                        )}
                    </div>
                    <div className='mt-4 flex gap-1'>
                        <button type='submit'>
                            {editCategory !== null && editCategory !== undefined ? 'Update' : 'Create'}
                        </button>
                        {editCategory !== null && editCategory !== undefined && (
                            <button type='button' onClick={() => {setEditCategory(null); setCategoryName('')}}>
                                Cancel
                            </button>
                            )}
                    </div>
                </div>
            </form>

            <div className='max-w-md mx-auto mt-8'>
                {categories.length > 0 && <h2 className='mb-2 text-sm leading-3 text-slate-500'>Available categories: </h2>}
                {categories.length > 0 && (
                    categories.map((category: Category) => (
                        <div key={category._id as React.Key} className='bg-slate-200 mb-2 border border-slate-400 rounded-lg p-2 flex items-center justify-between'>
                            <div className='grow font-semibold'>{category.name}</div>
                            <div className='flex gap-2'>
                                <button 
                                    type='button'
                                    className='p-2 hover:bg-green-500 hover:text-white' 
                                    onClick={() => {setEditCategory(category); setCategoryName(category.name)}}
                                    >
                                    <Edit />
                                </button>
                                <button 
                                    type='button'
                                    className='p-2 hover:bg-red-500 hover:text-white' 
                                    onClick={() => {deleteCategory(category)}}
                                    >
                                    <Trash />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </section>
    )
}
