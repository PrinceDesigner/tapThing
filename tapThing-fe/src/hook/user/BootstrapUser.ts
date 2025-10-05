// hook/user/useBootstrapUser.ts
import { useEffect } from 'react';
import { useAuthClienteStore } from '@/store/auth/AuthClienteStore';
import { LoggerUtils } from '@/utils/logger/Logger';
import { useUserStore } from '@/store/user/user.store';
import { getCurrentUser } from '@/api/users/users.service';

export function useBootstrapUser() {
    const session = useAuthClienteStore((s) => s.session);
    const userId = useAuthClienteStore((s) => s.userId);
    const { setProfile, setReady, setError, reset } = useUserStore();

    useEffect(() => {
        let aborted = false;

        async function fetchProfile(uid: string) {
            try {
                setReady(false);
                setError(null);

                // Usa getCurrentUser dal servizio
                const user = await getCurrentUser();

                if (aborted) return;
                setProfile(user);
            } catch (e: any) {
                if (!aborted) {
                    LoggerUtils.error('Eccezione fetch profilo:', e);
                    setError(e ?? 'Unknown error');
                    setProfile(null);
                }
            } finally {
                if (!aborted) setReady(true);
            }
        }

        if (!session || !userId) {
            // Nessuna sessione: pulisci stato profilo
            reset();
            return;
        }

        // C'è sessione: fai bootstrap profilo
        fetchProfile(userId);


        return () => {
            aborted = true;
        };
    }, [session, userId, setProfile, setReady, setError, reset]);
}
