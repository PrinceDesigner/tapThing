
import { PostDetail, ResponsePostPaginated } from '@/api/posts/model/post.model';
import { getPostById, getPosts } from '@/api/posts/post.service';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';

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
    initialPageParam: 0, // offset iniziale
    queryFn: ({ pageParam }) =>
      getPosts(prompt_id!, pageSize, pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      // BE ci dà già il prossimo offset preciso
      return lastPage.nextOffset ?? undefined;
    },
    // RN-friendly
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}