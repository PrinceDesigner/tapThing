
import { PostDetail, ResponsePostPaginated } from '@/api/posts/model/post.model';
import { deletePost, getPostById, getPosts } from '@/api/posts/post.service';
import { useUpdatePromptCache } from '@/hook/prompt/useHookPrompts';
import { useSnackbarStore } from '@/store/snackbar/snackbar.store';
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function usePostQuery(id: string) {
  const qc = useQueryClient();
  const query = useQuery<PostDetail | null>({
    queryKey: ['post', id],
    queryFn: () => getPostById(id),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    enabled: !!id,
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
    invalidatePost: () =>
      qc.invalidateQueries({ queryKey: ['post', id] }),
  };
}

export function usePostInfinite(
  prompt_id?: string,
  opts?: { pageSize?: number }
) {
  const pageSize = opts?.pageSize ?? 20;

  return useInfiniteQuery<ResponsePostPaginated, Error>({
    queryKey: ["posts", prompt_id, pageSize],
    enabled: !!prompt_id,
    // prima pagina: nessun cursor
    initialPageParam: null as { id: string | null; created_at: string | null } | null,
    queryFn: ({ pageParam, signal }) =>
      getPosts(prompt_id!, pageSize, (pageParam as { id: string | null; created_at: string | null } | null) ?? null),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    // RN-friendly
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  const { setHasPostedOnPrompt, setPostedIdOnPrompt, setPostedAtOnPrompt } =
    useUpdatePromptCache();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await deletePost(id);
      if (!res?.success) throw new Error('Delete failed');
      return res;
    },

    onSuccess: (_res, id) => {
      // 1) aggiorna il prompt attivo
      setHasPostedOnPrompt(false);
      setPostedIdOnPrompt(null);
      setPostedAtOnPrompt(null);

      // 2) rimuovi la cache del singolo post
      qc.removeQueries({ queryKey: ['post', id], exact: true });

      // 3) rimuovi il post da tutte le liste infinite ['posts', ...]
      const lists = qc.getQueriesData<InfiniteData<ResponsePostPaginated>>({
        queryKey: ['posts'],
      });

      for (const [key, data] of lists) {
        if (!data) continue;

        const newPages = data.pages.map((page) => ({
          ...page, // mantiene intatto nextCursor
          posts: page.posts.filter((pd: PostDetail) => pd.post.id !== id),
        }));

        qc.setQueryData<InfiniteData<ResponsePostPaginated>>(key, {
          ...data,
          pages: newPages,
        });
      }

      useSnackbarStore.getState().show('Delete successful', 'success');
      // nessuna invalidate: zero rete
    },

    // opzionale: feedback UI
    // onError: (e) => showToast(t('delete_failed')),
  });
}