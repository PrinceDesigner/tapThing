// hook/supabase/AuthListnerSupabase.ts
import { supabase } from "@/libs/supabase/supabase.client";
import { useAuthClienteStore } from "@/store/auth/AuthClienteStore";
import { LoggerUtils } from "@/utils/logger/Logger";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function AuthListenerCliente() {
  const [session, setLocalSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const { setSession } = useAuthClienteStore.getState();

  useEffect(() => {
    const setInitial = (s: Session | null) => {
      if (s) {
        LoggerUtils.info('✅ sessione attiva trovata');
        setLocalSession(s);
        setSession(s);            // <— aggiorna store centrale (token, userId…)
      } else {
        LoggerUtils.info('⚠️ nessuna sessione attiva');
        setLocalSession(null);
        setSession(null);         // <— pulisci store centrale
      }
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((event, s) => {
      LoggerUtils.info(`🔄 Evento auth: ${event}`);
      switch (event) {
        case 'INITIAL_SESSION':
        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED':
          setInitial(s);
          break;
        case 'SIGNED_OUT':
          setInitial(null);
          break;
        case 'USER_UPDATED':
          // Il profilo verrà ricaricato dal gate con useBootstrapUser
          break;
        default:
          setLoading(false);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { isAuthenticated: !!session, loading };
}
