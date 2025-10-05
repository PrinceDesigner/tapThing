// store/user/UserStore.ts
import { User } from '@/api/users/model/user.model';
import { zustandReactotron } from '@/config/reactotron';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserState = {
    profile: User | null;
    isProfileReady: boolean;
    error: string | null;
    setProfile: (p: User | null) => void;
    updateProfile: (patch: Partial<User>) => void;
    setReady: (ready: boolean) => void;
    setError: (e: string | null) => void;
    reset: () => void;
};

export const useUserStore = create<UserState>()(
    persist(
        zustandReactotron(
            (set: (
                partial: Partial<UserState> |
                    ((state: UserState) => Partial<UserState>),
                replace?: boolean) => void,
                get: () => UserState, api: any) => ({
                    profile: null,
                    isProfileReady: false,
                    error: null,
                    updateProfile: (patch: Partial<User>) => {
                        const current = get().profile;
                        if (!current) return;
                        const updated = { ...current, ...patch };
                        set({ profile: updated });
                    },
                    setProfile: (p: User | null) => set({ profile: p }),
                    setReady: (ready: boolean) => set({ isProfileReady: ready }),
                    setError: (e: string | null) => set({ error: e }),
                    reset: () => set({ profile: null, isProfileReady: false, error: null }),
                }),
        ),
        {
            name: 'user-store',
        }
    )
);
