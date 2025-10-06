import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type ReverseGeo = Location.LocationGeocodedAddress | null;

type UseCurrentLocationResult = {
  coords: Coordinates | null;
  address: ReverseGeo;
  loading: boolean;
  error: string | null;
};

export function useCurrentLocation(): UseCurrentLocationResult {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState<ReverseGeo>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function getCurrentLocation() {
      try {
        setLoading(true);

        // 🔹 Chiedi permessi
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (isMounted) {
            setError('Permesso posizione non concesso');
            setLoading(false);
          }
          return;
        }

        // 🔹 Ottieni posizione
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        if (!isMounted) return;
        setCoords({ latitude, longitude });

        // 🔹 Ottieni indirizzo inverso
        const reverseGeo = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (isMounted) {
          setAddress(reverseGeo[0] || null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Errore durante il recupero della posizione');
          setLoading(false);
        }
      }
    }

    getCurrentLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  return { coords, address, loading, error };
}
