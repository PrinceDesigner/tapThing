import { Author, PostDetail, ResponsePostPaginated } from '@/api/posts/model/post.model';
import { deletePost, getPostById, getPosts } from '@/api/posts/post.service';
import { useUpdatePromptCache } from '@/hook/prompt/useHookPrompts';
import { useLoadingStore } from '@/store/loaderStore/loaderGlobalStore';
import { useSnackbarStore } from '@/store/snackbar/snackbar.store';
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

/* =========================
   usePostQuery.ts
   ========================= */
export function usePostQuery(idPost: string, prompt_id: string) {
  const query = useQuery<PostDetail | null>({
    queryKey: ['post', idPost, prompt_id],
    queryFn: () => getPostById(idPost, prompt_id),
    enabled: !!idPost && !!prompt_id,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const post = query.data ?? null;

  return {
    post,
    isLoading: query.isLoading || query.isFetching,
    error: query.error ? (query.error as Error).message : null,
    hasPost: !!post,
    // utility:
    refetchPost: query.refetch,
  };
}

/* =========================
   usePostCacheActions.ts
   ========================= */
export function usePostCacheActions() {
  const qc = useQueryClient();

  const patchAuthorOptimistic = (id: string, patch: Partial<Author>, prompt_id: string) => {
    qc.setQueryData<PostDetail | null>(['post', id, prompt_id], (old) => {
      if (!old) return old;
      return { ...old, author: { ...old.author, ...patch } };
    });
  };

  return { patchAuthorOptimistic };
}

/* =========================
   usePostInfinite.ts
   ========================= */
export function usePostInfinite(
  prompt_id?: string,
  opts?: { pageSize?: number }
) {
  const pageSize = opts?.pageSize ?? 20;

  return useInfiniteQuery<ResponsePostPaginated, Error>({
    queryKey: ['posts', prompt_id, pageSize],
    enabled: !!prompt_id,
    // prima pagina: nessun cursor
    initialPageParam: null as { id: string | null; created_at: string | null } | null,
    queryFn: ({ pageParam }) =>
      getPosts(prompt_id!, pageSize, (pageParam as { id: string | null; created_at: string | null } | null) ?? null),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    // RN-friendly
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

/* =========================
   useResetAllPosts.ts
   ========================= */
export function useResetAllPosts() {
  const queryClient = useQueryClient();

  return async () => {
    // Rimuove TUTTE le varianti (infinite pages incluse) delle liste posts
    queryClient.removeQueries({ queryKey: ['posts'], exact: false });
    // opzionale: se lo screen è già montato, puoi forzare subito un nuovo fetch delle query attive
    // await queryClient.refetchQueries({ queryKey: ['posts'], type: 'active' })
  };
}

/* =========================
   useDeletePost.ts
   ========================= */
export function useDeletePost(prompt_id: string) {
  const qc = useQueryClient();
  const { setHasPostedOnPrompt, setPostedIdOnPrompt, setPostedAtOnPrompt } = useUpdatePromptCache();
  const resetAllPosts = useResetAllPosts();
  const { t } = useTranslation();

  return useMutation({
    mutationKey: ['deletePost', prompt_id],
    mutationFn: async (id: string) => {
      const res = await deletePost(id, prompt_id);
      return res;
    },

    onMutate: () => {
      useLoadingStore.getState().setLoading(true);
    },

    onSuccess: (_res, id) => {
      // 1) aggiorna lo stato del prompt attivo (coerenza UI)
      resetAllPosts();
      setHasPostedOnPrompt(false);
      setPostedIdOnPrompt(null);
      setPostedAtOnPrompt(null);

      // 2) rimuovi la cache del singolo post (chiave esatta usata in usePostQuery)
      qc.removeQueries({ queryKey: ['post', id, prompt_id], exact: true });

      // Nota: niente invalidazione / refetch aggiuntivo → "zero rete" come desiderato
      useSnackbarStore.getState().show('Delete successful', 'success');
    },

    onError: () => {
      const deleteError = t('POST_DELETE_ERROR');
      useSnackbarStore.getState().show(deleteError, 'error');
    },

    onSettled: () => {
      useLoadingStore.getState().setLoading(false);
    },
  });
}
