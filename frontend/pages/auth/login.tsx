import Link from 'next/link';
import React, { useState } from 'react';
import Head from 'next/head';
import config from '@/lib/config';
import useAuthentication from '@/lib/hooks/useAuthentication';

const Login = () => {
    const { login, loading } = useAuthentication();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = e.target.value.toLowerCase();
        setIdentifier(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleLogin: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        login(identifier, password);
    };

    return (
        <>
            <Head>
                <title>Login{config.titleWithSeparator}</title>
                <meta name="description" content="Limitless Entertainment." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <section className='select-none'>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a className="flex items-center mb-4 text-2xl font-semibold text-gray-900 dark:text-white select-none">
                        <img className="w-8 h-8 mr-1 rounded" src="../favicon.svg" alt="logo" />
                        Rent a Car
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                <span className='text-brand'>
                                    Sign In
                                </span> 
                            </h1>
                            <form className="space-y-4 md:space-y-6">
                                <div>
                                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username or Email</label>
                                    <input type="identifier"
                                        name="identifier"
                                        id="identifier"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
                                        placeholder="username or email"
                                        required
                                        autoComplete='off'
                                        value={identifier}
                                        onChange={handleIdentifierChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input type="password"
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
                                        required
                                        autoComplete='off'
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                        <div className="text-sm">
                                            <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Not yet a member?</label>
                                        </div>
                                    </div>
                                    <Link href="/auth/register">
                                        <div className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Sign Up</div>
                                    </Link>
                                </div>
                                <button
                                    type="submit"
                                    className={`w-full justify-center inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-brand hover:bg-opacity-90
                                ${loading ? 'cursor-not-allowed bg-opacity-90' : 'cursor-pointer'
                                        }`}
                                    disabled={loading}
                                    onClick={handleLogin}
                                >
                                    {loading ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle className="opacity-50 stroke-current" cx="12" cy="12" r="10" strokeWidth={4}></circle>
                                                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Logging in...
                                        </>
                                    ) : (
                                        'Login'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>)
}
export default Login;