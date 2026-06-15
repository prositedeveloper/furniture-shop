import { createContext, useContext, useState, useEffect, Children } from "react";
import api from "../services/api";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    

    const isAuthenticated = !!user;

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (token) {
                    const response = await api.get('/auth/profile');
                    setUser(response.data);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.post('/auth/login/', credentials);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            const userResponse = await api.get('/auth/profile');
            setUser(userResponse.data);
            toast.success('Вы успешно вошли!');
            return response.data;
        } catch (error) {
            toast.error('Неверный логин или пароль!');
            throw error;
        }
    };

    const register = async (data) => {
        try {
            await api.post('/auth/register/', data);
            toast.success('Регистрация прошла успешно! Войдите в систему');
            navigate('/login');
        } catch (error) {
            toast.error('Ошибка регистрации ' + (error.response?.data?.username?.[0] || 'Попробуйте снова'));
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        toast.success('Вы вышли из системы');
        navigate('/login');
    };

    const updateProfile = async (formData) => {
        try {
            const response = await api.patch('/auth/profile/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUser(response.data);
            toast.success('Профиль успешно  обновлен!');
            return response.data;
        } catch (error) {
            toast.error('Ошибка обновления профиля!');
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);