import Link from 'next/link';
import React, { useEffect } from 'react';
import useAuthentication from '@/lib/hooks/useAuthentication';
import { useRouter } from 'next/router';
import { Role } from '@/lib/types';
import config from '@/lib/config';
import ActionButton from './common/actionButton';
import { useAuth } from '@/AuthContext';

const Navbar = () => {
    const { logout } = useAuthentication();
    const { isAuthenticated } = useAuth();
    const role = config.role;
    const router = useRouter();

    const { id } = router.query;

    return (
        <>
            <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200">
                <div className="flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href={'/'} className="flex items-center select-none cursor-pointer">
                        <img src="\favicon.svg" className="h-8 mr-1 rounded" alt="rac logo" />
                        <div className="self-center text-2xl font-semibold whitespace-nowrap">
                            Rent a <span className="text-brand">Car</span>
                        </div>
                    </Link>
                    <div className="flex items-center space-x-2 md:order-2">
                        {isAuthenticated && router.pathname === '/' && (
                            <ActionButton
                                text='Create Garage'
                                href='/car/create'
                                customClasses='bg-brand text-white'
                            />
                        )}

                        {isAuthenticated && router.pathname.startsWith('/car/') && id && (
                            <ActionButton
                                text='Edit Car'
                                href={`/car/${id}/edit`} // Dynamically adds the extracted ID
                                customClasses='bg-brand text-white'
                            />
                        )}

                        <ActionButton
                            onClick={() => logout()}
                            text='Logout'
                            icon='M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9'
                        />
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
