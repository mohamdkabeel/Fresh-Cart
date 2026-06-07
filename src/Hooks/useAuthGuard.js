import { useNavigate } from 'react-router-dom';

export function useAuthGuard() {
    const navigate = useNavigate();

    function handleExpiredToken(response) {
        if (response?.response?.data?.message === 'Expired Token. please login again') {
            localStorage.removeItem('userToken');
            navigate('/');
            return true;
        }
        return false;
    }

    function requireAuth() {
        const userToken = localStorage.getItem('usertoken');
        if (!userToken) {
            navigate('/Login');
            return false;
        }
        return true;
    }

    return { handleExpiredToken, requireAuth };
}
