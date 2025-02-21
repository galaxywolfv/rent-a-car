import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/AuthContext';
import useAuthentication from '@/lib/hooks/useAuthentication';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { checkAuth } = useAuthentication();

    useEffect(() => {
        if (!!!isAuthenticated) {
            checkAuth();
        }
        if (isAuthenticated !== null && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated]);

    return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
