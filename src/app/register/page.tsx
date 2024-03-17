'use client';

import {FormEvent, useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';


export default function Register() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [error, setError] = useState<string>('');
    const router = useRouter()

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        setError('');
        setButtonDisabled(false);

        e.preventDefault();
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify({email, password}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(res.ok) {
                router.push('/login');
            } else {
                const data = await res.json();
                setError(data.error)
            }
        }catch(err: any) {
            setError(err.message);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        if(email.length > 0 && password.length > 5){
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [email, password]);

    return (
        <section className='mt-8'>
            <h1 className='text-center text-primary text-4xl my-8'>Register</h1>
            {error.length > 0 && (
                <div className='my-4 p-2 text-center bg-red-700 text-white max-w-sm mx-auto rounded-md'>
                    <span className='text-yellow-400'>⚠</span><br />
                    An Error has occurred. Please try again <br />
                    Error: {error}
                </div>
            )}
            <form className='block max-w-xs mx-auto' onSubmit={handleFormSubmit}>
                <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                <button type="submit" disabled={isLoading || buttonDisabled}>REGISTER</button>
                <div className="my-4 text-center text-slate-500">
                    or Signup with other accounts
                </div>
                <button type='button' onClick={() => signIn('google', {callbackUrl: '/'})} disabled={true} className='flex items-center justify-center gap-4 bg-slate-100 oauth'><FontAwesomeIcon className='w-4' icon={faGoogle} /> Signup with Google </button>
                <div className='text-center my-8 border-t pt-4 border-slate-400'>
                    <h1>Already an user? <Link className='underline text-blue-600' href={'/login'}>Login</Link> here &raquo;.</h1>
                </div>
            </form>
            
        </section>
    )
}
