import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandReactotron } from '@/config/reactotron';


type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setSessionState: (token: string | null) => void;
  logout: () => void;
};

export const useAuthClienteStore = create<AuthState>()(
  persist(
    zustandReactotron(
      (
        set: (partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>),
          replace?: boolean, action?: string) => void,
        get: () => AuthState) => ({
          token: null,
          isAuthenticated: false,
          setToken: (token: string | null) => set({ token, isAuthenticated: !!token }, false, 'setToken'),
          logout: () => set({ token: null, isAuthenticated: false }, false, 'logout'),

        })
    ),
    {
      name: 'auth-cliente-storage',
    }
  )
);