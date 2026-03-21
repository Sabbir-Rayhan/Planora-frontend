'use client';

import { create } from 'zustand';
import Cookies from 'js-cookie';
import { IUser } from '@/types';

interface IAuthStore {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: IUser, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    Cookies.set('accessToken', token, { expires: 1 });
    set({ user, accessToken: token, isAuthenticated: true });
  },

  clearAuth: () => {
    Cookies.remove('accessToken');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));