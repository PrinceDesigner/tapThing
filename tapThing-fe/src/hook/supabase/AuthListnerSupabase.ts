import { supabase } from "@/libs/supabase/supabase.client";
import { useAuthClienteStore } from "@/store/auth/AuthClienteStore";
import { LoggerUtils } from "@/utils/logger/Logger";
// import { useAuthClienteStore } from "@store/auth/AuthClienteStore";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function AuthListenerCliente() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    const { setToken } = useAuthClienteStore.getState();

    // Qui andrebbe implementata la logica per ascoltare i cambiamenti di autenticazione
    useEffect(() => {
        const setInitialSession = (session: Session | null) => {
            if (session) {
                LoggerUtils.info('✅ setInitialSession: sessione attiva trovata');

                setSession(session);
                setToken(session.access_token);


            } else {
                LoggerUtils.info('⚠️ setInitialSession: nessuna sessione attiva');
                setToken(null);
            }
            setLoading(false);
        }

        const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                LoggerUtils.info(`🔄 Evento auth ricevuto: ${event}`);

                try {
                    switch (event) {
                        case 'INITIAL_SESSION':
                            LoggerUtils.info('🎬 INITIAL_SESSION ricevuto');
                            setInitialSession(session);
                            break;

                        case 'SIGNED_IN':
                        case 'TOKEN_REFRESHED':
                            setInitialSession(session);
                            break;

                        case 'SIGNED_OUT':
                            LoggerUtils.info('🚪 Logout effettuato');
                            setSession(null);
                            setLoading(false);
                            break;

                        case 'USER_UPDATED':
                            LoggerUtils.info('📝 Profilo utente aggiornato');
                            break;

                        default:
                            LoggerUtils.info(`ℹ️ Evento auth non gestito: ${event}`);
                            break;
                    }
                } catch (err) {
                    LoggerUtils.error(`❌ Errore in onAuthStateChange (${event}):`, err);
                    setLoading(false);
                }
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    console.log("AuthListenerCliente - session:", !!session);

    return {
        isAuthenticated: !!session,
        loading
    };
}