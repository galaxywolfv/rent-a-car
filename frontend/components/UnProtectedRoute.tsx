import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '@/AuthContext';
import useAuthentication from '@/lib/hooks/useAuthentication';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { checkAuth } = useAuthentication();
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    
    useEffect(() => {        
        checkAuth();
        if (isAuthenticated !== null && isAuthenticated) {
            router.push('/');
        } else if (isAuthenticated !== null && !isAuthenticated) {
            setIsAuth(true);
        }       
    }, [isAuthenticated]);

    return isAuth ? <>{children}</> : null;
};

export default ProtectedRoute;
