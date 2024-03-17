'use client';
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const router = useRouter();

    const handleFormSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const loginData = {email, password, callbackUrl: '/profile', redirect: false};

        const login = await signIn('credentials', loginData);       

        setIsLoading(false);

        if(login?.ok){
            toast.success('Successfully logged you in!');
            router.push(login?.url!);
        } else {
            setEmail('');
            setPassword('');
            toast.error('Login failed.');
        }

    }
    
    useEffect(() => {
        if(email.length > 0 && password.length > 0){
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [email, password]);

    return (
        <section className='mt-8'>
            <h1 className='text-center text-primary text-4xl my-8'>Login</h1>
            {error.length > 0 && (
                <div className='my-4 p-2 text-center bg-red-700 text-white max-w-sm mx-auto rounded-md'>
                    <span className='text-yellow-400'>⚠</span><br />
                    An Error has occurred. Please try again <br />
                    Error: <span className='font-semibold'>{error}</span>
                </div>
            )}
            <form className='block max-w-xs mx-auto' onSubmit={handleFormSubmit}>
                <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                <button type="submit" disabled={isLoading || buttonDisabled}>LOGIN</button>
                <div className="my-4 text-center text-slate-500">
                    or Signup with other accounts
                </div>
                <button type='button' onClick={async() =>  await signIn('google', {callbackUrl: '/'})} disabled={true} className='flex items-center justify-center gap-4 bg-slate-100 oauth'>
                    <FontAwesomeIcon className='w-4' icon={faGoogle} /> Login with Google 
                </button>
                <div className='text-center my-8 border-t pt-4 border-slate-400'>
                    <h1>New here? <Link className='underline text-blue-600' href={'/register'}>Signup</Link> here &raquo;.</h1>
                </div>
            </form>
        </section>
    )
}
