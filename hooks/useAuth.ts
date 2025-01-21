"use client"

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { UserRole, User } from '@/types/auth';
import { useRouter } from 'next/navigation';

interface JwtPayload {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUser({
          id: decoded.userId,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role
        });
      } catch (error) {
        console.error('Failed to decode token:', error);
        setUser(null);
      }
    
    setLoading(false);
  }, []);

  const isAdmin = user?.role === 'ADMIN';
  const isAuthenticated = !!user;

  return {
    user,
    isAdmin,
    isAuthenticated,
    loading
  };
} 