// store/auth/AuthClienteStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandReactotron } from '@/config/reactotron';
import type { Session } from '@supabase/supabase-js';

type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  session: Session | null;
  userId: string | null;

  // setters consigliati
  setSession: (session: Session | null) => void;
  setToken: (token: string | null) => void; // legacy-friendly

  // alias legacy, mantiene la tua firma
  setSessionState: (token: string | null) => void;

  logout: () => void;
};

export const useAuthClienteStore = create<AuthState>()(
  persist(
    zustandReactotron(
      (set: (partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>),
        replace?: boolean,
        action?: string) => void,
        get: () => AuthState) => ({
          token: null,
          isAuthenticated: false,
          session: null,
          userId: null,

          // Setter principale: passa direttamente la sessione di Supabase
          setSession: (session: Session | null) =>
            set(
              {
                session,
                token: session?.access_token ?? null,
                userId: session?.user?.id ?? null,
                isAuthenticated: !!session,
              },
              false,
              'auth/setSession'
            ),

          // Per retrocompatibilità: imposta solo il token
          // Se vuoi forzare logout, passa null.
          setToken: (token: string | null) =>
            set(
              (state) => ({
                token,
                // non tocco session/userId se arriva un token "refresh" senza session
                // se token è null, sincronizzo anche lo stato
                ...(token === null
                  ? { session: null, userId: null, isAuthenticated: false }
                  : { isAuthenticated: true }),
              }),
              false,
              'auth/setToken'
            ),

          // Alias legacy al tuo nome esistente (deprecato): delega a setToken
          setSessionState: (token: string | null) =>
            get().setToken(token), // mantiene la compatibilità con il codice attuale

          logout: () =>
            set(
              { token: null, isAuthenticated: false, session: null, userId: null },
              false,
              'auth/logout'
            ),
        })
    ),
    {
      name: 'auth-cliente-storage',
    }
  )
);
