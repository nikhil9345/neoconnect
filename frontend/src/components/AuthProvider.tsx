'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/api';

type User = {
  _id: string;
  name: string;
  email: string;
  role: 'Staff' | 'Secretariat' | 'CaseManager' | 'Admin';
  department: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (userData: any, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        // Verify token with backend
        try {
          const res = await api.get('/auth/profile');
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch (error) {
          console.error("Token verification failed", error);
          Cookies.remove('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData: User, token: string) => {
    Cookies.set('token', token, { expires: 30 }); // 30 days
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    router.push('/dashboard');
  };

  const logout = () => {
    Cookies.remove('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
