// src/utils/Logger.ts

export const LoggerUtils = {
  log: (...args: any[]) => {
    if (__DEV__) console.log('[LOG]', ...args);
  },
  warn: (...args: any[]) => {
    if (__DEV__) console.warn('[WARN]', ...args);
  },
  error: (...args: any[]) => {
    if (__DEV__) console.error('[ERROR]', ...args);
  },
  info: (...args: any[]) => {
    if (__DEV__) console.info('[INFO]', ...args);
  },
};