import 'react-native-get-random-values';
import { useAuthClienteStore } from '@/store/auth/AuthClienteStore';
import { v4 as uuidv4 } from 'uuid';
import i18n from '@/i18n';
import { queryClient } from '@/libs/tanstackQuery.client';
import { PROMPT_KEYS } from '@/hook/prompt/prompt.keys';
import { logout } from './supabase/supabase.api';

const baseUrl = process.env.EXPO_PUBLIC_BFF_URL || 'http://localhost:3000/';

export const apiClient = {
  get: async <T = any>(url: string): Promise<T> => request<T>('GET', url),
  post: async <T = any>(url: string, body?: any): Promise<T> => request<T>('POST', url, body),
  put: async <T = any>(url: string, body?: any): Promise<T> => request<T>('PUT', url, body),
  patch: async <T = any>(url: string, body?: any): Promise<T> => request<T>('PATCH', url, body),
  delete: async <T = any>(url: string): Promise<T> => request<T>('DELETE', url),
};

function joinUrl(path: string) {
  // garantisce un join robusto
  return new URL(path.replace(/^\//, ''), baseUrl.endsWith('/') ? baseUrl : baseUrl + '/').toString();
}

async function request<T = any>(method: string, url: string, body?: any): Promise<T> {
  const accessToken = useAuthClienteStore.getState().token;
  if (!accessToken) {
    throw new Error('Access token mancante. Effettua di nuovo l’accesso.');
  }

  const traceId = uuidv4();

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept-Language': i18n.language ?? 'en',
    'x-trace-id': traceId,
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  // opzionale: timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  const options: RequestInit = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: controller.signal,
  };

  const fullUrl = joinUrl(url);

  try {
    const response = await fetch(fullUrl, options);
    clearTimeout(timeout);

    if (!response.ok) {
      if (__DEV__) {
        console.error({ traceId, url: response.url, status: response.status });
      } else {
        // Sentry.captureException({ traceId, url: response.url, status: response.status });
      }

      // Leggi come testo e poi prova a fare parse
      const cloned = response.clone();
      let errorMessage = `Errore API: ${response.status}`;
      let code = 'API_ERROR';

      let text = '';
      try { text = await cloned.text(); } catch { /* ignore */ }

      if (text) {
        try {
          const json = JSON.parse(text);
          const msg = Array.isArray(json?.message) ? json.message.join('\n') : json?.message;
          code = json?.code || code;

          // Gestione PROMPT_EXPIRED: invalidazione/refresh sincroni e poi throw
          if (code === 'PROMPT_EXPIRED') {

            console.log('API Client: PROMPT_EXPIRED detected, invalidating prompt queries...', { traceId });
            // meglio invalidare, lasciare che i componenti refetchino in autonomia
            await queryClient.invalidateQueries({ queryKey: PROMPT_KEYS.all });
            // se vuoi forzare il refetch subito (blocking), usa:
            // await queryClient.refetchQueries({ queryKey: PROMPT_KEYS.all });
            throw buildError(msg || 'Prompt non più valido.', code, traceId);
          }

          if (response.status === 401 && code === 'AUTH_INVALID_OR_EXPIRED') {
            logout();
            queryClient.clear();
            errorMessage = msg || 'Non sei autenticato. Effettua di nuovo l’accesso.';
            throw buildError(errorMessage, code, traceId);
          }

          if (msg) {
            switch (response.status) {
              case 400: errorMessage = msg || 'Richiesta non valida'; break;
              case 401: errorMessage = msg || 'Non sei autenticato'; break;
              case 403: errorMessage = msg || 'Accesso negato'; break;
              case 404: errorMessage = msg || 'Risorsa non trovata'; break;
              case 500: errorMessage = msg || 'Errore interno del server'; break;
              default: errorMessage = msg; break;
            }
          }
        } catch {
          // non-JSON: tieni text se c'è
          if (text) errorMessage = text;
        }
      }

      throw buildError(errorMessage, code, traceId);
    }

    // 204/205 o nessun body
    if (response.status === 204 || response.status === 205) {
      return null as unknown as T;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      // non JSON → ritorna null
      return null as unknown as T;
    }

    // JSON valido
    return (await response.json()) as T;

  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error('Richiesta scaduta. Riprova più tardi.');
    }
    if (typeof err?.message === 'string' && err.message.includes('Network request failed')) {
      throw new Error('Connessione assente. Riprova più tardi.');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

function buildError(message: string, code?: string, traceId?: string) {
  const e = new Error(message);
  (e as any).code = code;
  (e as any).traceId = traceId;
  return e;
}
