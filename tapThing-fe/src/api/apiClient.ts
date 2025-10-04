import 'react-native-get-random-values'
import { useAuthClienteStore } from '@/store/auth/AuthClienteStore';
import { v4 as uuidv4 } from 'uuid';


export const apiClient = {
  get: async <T = any>(url: string): Promise<T> => request<T>('GET', url),
  post: async <T = any>(url: string, body?: any): Promise<T> => request<T>('POST', url, body),
  put: async <T = any>(url: string, body?: any): Promise<T> => request<T>('PUT', url, body),
  patch: async <T = any>(url: string, body?: any): Promise<T> => request<T>('PATCH', url, body),
  delete: async <T = any>(url: string): Promise<T> => request<T>('DELETE', url),
};

async function request<T = any>(method: string, url: string, body?: any): Promise<T> {
  const accessToken = useAuthClienteStore.getState().token;

  if (!accessToken) {
    throw new Error('Access token mancante. Effettua di nuovo l’accesso.');
  }

  const baseUrl = process.env.EXPO_PUBLIC_BFF_URL || 'http://localhost:3000';

  // ✅ Genera un traceId unico per la richiesta
  const traceId = uuidv4();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
    'x-trace-id': traceId, // ✅ lo aggiungiamo qui
  };


  const options: RequestInit = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  try {
    const response = await fetch(`${baseUrl}${url}`, options);

    if (!response.ok) {
      let errorMessage = `Errore API: ${response.status}`;

      if (!__DEV__) {
        // Sentry.captureException({
        //   traceId,
        //   url: response.url
        // })
      } else {
        console.error({
          traceId,
          url: response.url
        })
      }

      try {
        const json = await response.json();
        const msg = Array.isArray(json?.message)
          ? json.message.join('\n')
          : json?.message;

        // Override solo se `msg` esiste
        if (msg) {
            console.log('Errore API dettagliato:', msg);
          switch (response.status) {
            case 400:
              errorMessage = msg || 'Richiesta non valida';
              break;
            case 401:
              errorMessage = msg || 'Non sei autenticato';
              break;
            case 403:
              errorMessage = msg || 'Accesso negato';
              break;
            case 404:
              errorMessage = msg || 'Risorsa non trovata';
              break;
            case 500:
              errorMessage = msg || 'Errore interno del server';
              break;
            default:
              errorMessage = msg;
              break;
          }
        }
      } catch {
        const text = await response.text();
        if (text) errorMessage = text;
      }

      throw new Error(errorMessage);
    }

    // const contentLength = response.headers.get('content-length');
    // if (!contentLength || Number(contentLength) === 0) {
    //   return null as unknown as T;
    // }

    console.log('✅ Risposta API:', response.status, url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      traceId, // ✅ Log del traceId
    });
    try {
      return await response.json();
    } catch {
      return null as unknown as T;
    }
  } catch (err: any) {
    if (err.message?.includes('Network request failed')) {
      throw new Error('Connessione assente. Riprova più tardi.');
    }

    throw err;
  }
}