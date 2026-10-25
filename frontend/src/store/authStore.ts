import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  role: 'admin' | 'operator' | 'viewer';
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const defaultUser: User = {
  user_id: 'console_admin',
  email: 'operator@polartwin.gov.in',
  role: 'admin'
};

export const useAuthStore = create<AuthState>((set) => ({
  user: defaultUser,
  token: 'polartwin_open_access',
  role: 'admin',
  isAuthenticated: true,

  login: (token: string, user: User) => {
    localStorage.setItem('polartwin_token', token);
    localStorage.setItem('polartwin_user', JSON.stringify(user));
    set({ token, user, role: user.role, isAuthenticated: true });
  },

  logout: () => {
    // Keep authenticated in open access mode
    set({ user: defaultUser, token: 'polartwin_open_access', role: 'admin', isAuthenticated: true });
  }
}));
