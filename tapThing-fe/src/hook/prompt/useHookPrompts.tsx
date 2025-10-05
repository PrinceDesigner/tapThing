// hook/prompt/useActivePrompt.ts
import { useEffect } from 'react';
import { LoggerUtils } from '@/utils/logger/Logger';
import { Prompt } from '@/api/prompt/model/prompt.model';
import { usePromptStore } from '@/store/prompt/prompt.store';
import { getPromptByIdUser } from '@/api/prompt/prompt.service';

export function useActivePrompt() {
    const { prompt, isLoading, error, setPrompt, setLoading, setError, reset } = usePromptStore();

    useEffect(() => {
        let aborted = false;

        async function bootstrap() {
            try {
                setLoading(true);
                setError(null);

                const p: Prompt | null = await getPromptByIdUser();
                if (aborted) return;

                setPrompt(p ?? null);
            } catch (e: any) {
                if (!aborted) {
                    LoggerUtils.error('Errore fetch prompt attivo:', e);
                    setError(e?.message ?? 'Errore sconosciuto');
                    setPrompt(null);
                }
            } finally {
                if (!aborted) setLoading(false);
            }
        }

        bootstrap();

        return () => {
            aborted = true;
        };
    }, [setPrompt, setLoading, setError]);

    return {
        prompt,
        isLoading,
        error,
        hasActivePrompt: !!prompt, // prompt presente => attivo
        hasPostedOnPrompt: prompt?.has_posted ?? false, // valore già fornito dal backend
        reset,
    };
}
