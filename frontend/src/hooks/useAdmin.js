import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

export const useAdmin = () => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
        try {
            const decoded = jwtDecode(token);
            if (decoded && decoded.role === 'admin') {
            setIsAdmin(true);
            }
        } catch (error) {
            console.error('Invalid token:', error);
        }
        }
    }, []);

    return isAdmin;
};

export default useAdmin;