// hook/prompt/useActivePrompt.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPromptByIdUser } from '@/api/prompt/prompt.service';
import type { Prompt } from '@/api/prompt/model/prompt.model';
import { PROMPT_KEYS } from './prompt.keys';


export function useActivePrompt() {
  const qc = useQueryClient();

  const query = useQuery<Prompt | null>({
    queryKey: PROMPT_KEYS.all,
    queryFn: () => getPromptByIdUser(),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const prompt = query.data ?? null;

  return {
    prompt,
    isLoading: query.isLoading || query.isFetching,
    error: query.error ? (query.error as Error).message : null,
    hasActivePrompt: !!prompt,
    hasPostedOnPrompt: prompt?.has_posted ?? false,
    // utility:
    refetchActivePrompt: query.refetch,
    invalidateActivePrompt: () =>
      qc.invalidateQueries({ queryKey: PROMPT_KEYS.all }),
  };
}


// Aggiornamenti optimistici della cache del prompt attivo
export function useUpdatePromptCache() {
  const qc = useQueryClient();

  const setHasPostedOnPrompt = (value: boolean) => {
    qc.setQueryData<Prompt | null>(PROMPT_KEYS.all, (old) => {
      if (!old) return old; // se non c'è prompt attivo, non fare nulla
      return { ...old, has_posted: value };
    });
  };

  const setPostedIdOnPrompt = (postId: string) => {
    qc.setQueryData<Prompt | null>(PROMPT_KEYS.all, (old) => {
      if (!old) return old;
      return { ...old, posted_id: postId };
    });
  };

  const setPostedAtOnPrompt = (timestamp: string) => {
    qc.setQueryData<Prompt | null>(PROMPT_KEYS.all, (old) => {
      if (!old) return old;
      return { ...old, posted_at: timestamp };
    });
  };

  return { setHasPostedOnPrompt, setPostedIdOnPrompt, setPostedAtOnPrompt };
}
