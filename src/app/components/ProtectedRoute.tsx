"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const router = useRouter();
    const { isAuthenticated, loading } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    background: '#111322',
                }}
            >
                <CircularProgress sx={{ color: '#ffffff' }} />
            </Box>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 