import { QueryCache, QueryClient } from "@tanstack/react-query";

  // --- QueryClient & integrazioni rete/focus ---
  export const queryClient = new QueryClient({
    queryCache: new QueryCache(),
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnReconnect: true,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    },
  });