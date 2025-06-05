"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { getUser } from '../store/slices/userSlice';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, loading } = useSelector((state: RootState) => state.user);
    const getUserCalled = useRef(false);

    useEffect(() => {
        if (!getUserCalled.current) {
            getUserCalled.current = true;
            dispatch(getUser());
        }
    }, [dispatch]);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    // if (loading) {
    //     return (
    //         <Box
    //             sx={{
    //                 display: 'flex',
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //                 height: '100vh',
    //                 background: '#111322',
    //             }}
    //         >
    //             <CircularProgress sx={{ color: '#ffffff' }} />
    //         </Box>
    //     );
    // }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 