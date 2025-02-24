import Link from 'next/link';
import React from 'react';
import useAuthentication from '@/lib/hooks/useAuthentication';
import { useRouter } from 'next/router';
import { Role } from '@/lib/types';
import ActionButton from './common/actionButton';
import { useAuth } from '@/AuthContext';

const Navbar = () => {
    const { logout } = useAuthentication();
    const { isAuthenticated, role } = useAuth();
    const router = useRouter();

    const { id } = router.query;

    const isDetailPage = (asPath: string, baseRoute: any) => {
        const regex = new RegExp(`^/${baseRoute}/[^/]+$`);
        return regex.test(asPath);
    };          

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

                        {isAuthenticated && role == Role.maintainer && router.pathname === '/' && (
                            <ActionButton
                                text='Add Location'
                                href='/garage/create'
                                customClasses='bg-brand text-white'
                            />
                        )}

                        {isAuthenticated && role == Role.user && isDetailPage(router.asPath, 'car') && id && (
                            <ActionButton
                                text='Rent Car'
                                href={`/car/${id}/rent`}
                                customClasses='bg-brand text-white'
                            />
                        )}

                        {isAuthenticated && role == Role.maintainer && isDetailPage(router.asPath, 'car') && id && (
                            <ActionButton
                                text='Edit Car'
                                href={`/car/${id}/edit`}
                                customClasses='bg-brand text-white'
                            />
                        )}

                        {isAuthenticated && role == Role.maintainer && isDetailPage(router.asPath, 'garage') && id && (
                            <ActionButton
                                text='Edit Garage'
                                href={`/garage/${id}/edit`}
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
