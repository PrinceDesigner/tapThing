// utils/date.ts
import { getCalendars } from "expo-localization";

function getDeviceTimeZone(): string {
  const cal = getCalendars()[0];
  if (cal && typeof (cal as any).timeZone === "string") {
    return (cal as any).timeZone;
  }
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return tz ?? "UTC";
}

/**
 * Converte una stringa ISO (UTC) in una Date "locale" del device.
 */
export function getLocalDateFromISO(isoString: string): Date {
  const utcDate = new Date(isoString);
  const tz = getDeviceTimeZone();

  // Forza la conversione nel fuso
  const localString = utcDate.toLocaleString("en-US", { timeZone: tz });
  return new Date(localString);
}

/**
 * Restituisce oggi alle 00:00 nel fuso locale del device.
 */
export function getTodayInLocalTZ(): Date {
  const tz = getDeviceTimeZone();

  const now = new Date();
  // Usa formato ISO “YYYY-MM-DD” localizzato nel fuso del device
  const localDateStr = now.toLocaleDateString("en-CA", { timeZone: tz });
  const localMidnight = new Date(`${localDateStr}T00:00:00`);
  return localMidnight;
}
