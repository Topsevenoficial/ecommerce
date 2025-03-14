import { useState, useEffect } from "react";

export interface Agency {
  id: string;
  name: string;
  ubicacion: string;
  direction: string;
}

interface ShalomItemFromStrapi {
  id: number;
  nombre: string;
  ubicacion: string;
  direccion: string;
}

interface ShalomResponse {
  data: ShalomItemFromStrapi[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export function useAgencies() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const loadAgencies = async () => {
      const CACHE_KEY = 'agencies_cache';
      const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 semana en milisegundos

      try {
        // Verificar si hay datos en cache
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setAgencies(data);
            setIsLoading(false);
            return;
          }
        }

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backendUrl) {
          throw new Error('NEXT_PUBLIC_BACKEND_URL no está configurado');
        }

        let page = 1;
        let allAgencies: Agency[] = [];
        let totalPages = 1;

        do {
          const url = `${backendUrl}/api/shaloms?pagination[page]=${page}&pagination[pageSize]=100`;

          const res = await fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            cache: 'force-cache',
            next: { revalidate: 3600 },
            signal: abortController.signal
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`Error ${res.status}: ${errorData.error?.message || 'Falló la solicitud'}`);
          }

          const json: ShalomResponse = await res.json();

          const agencias: Agency[] = json.data.map((item: ShalomItemFromStrapi) => ({
            id: String(item.id || ''),
            name: item.nombre || 'Nombre no disponible',
            ubicacion: item.ubicacion || 'Ubicación no especificada',
            direction: item.direccion || 'Dirección no proporcionada',
          }));

          allAgencies = [...allAgencies, ...agencias];
          totalPages = json.meta.pagination.pageCount;
          page++;
        } while (page <= totalPages);

        // Almacenar los nuevos datos en cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: allAgencies,
          timestamp: Date.now()
        }));

        setAgencies(allAgencies);
        setIsLoading(false);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error loading agencies:', error);
          setError(error instanceof Error ? error.message : "An unknown error occurred");
        }
      }
    };

    loadAgencies();

    return () => {
      abortController.abort();
    };
  }, []);

  return { agencies, isLoading, error };
}