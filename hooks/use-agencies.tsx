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
    async function fetchAgencies() {
      setIsLoading(true);
      setError(null);

      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backendUrl) {
          throw new Error('NEXT_PUBLIC_BACKEND_URL no está configurado');
        }
        console.log("Backend URL:", backendUrl);

        let page = 1;
        let allAgencies: Agency[] = [];
        let totalPages = 1;

        do {
          const url = `${backendUrl}/api/shaloms?pagination[page]=${page}&pagination[pageSize]=100`;
          console.log("Fetching agencies from:", url);

          const res = await fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store' // Para evitar caché en producción
          });

          if (!res.ok) {
            const errorData = await res.json();
            console.error('Error del API:', errorData);
            throw new Error(`Error ${res.status}: ${errorData.error?.message || 'Falló la solicitud'}`);
          }

          const json: ShalomResponse = await res.json();
          console.log("Agencies page " + page, json);

          const agencias: Agency[] = json.data.map((item: ShalomItemFromStrapi) => {
            console.log('Estructura completa de item:', JSON.stringify(item, null, 2));
            return ({
              id: String(item.id || ''),
              name: item.nombre || 'Nombre no disponible',
              ubicacion: item.ubicacion || 'Ubicación no especificada',
              direction: item.direccion || 'Dirección no proporcionada',
            });
          });

          allAgencies = [...allAgencies, ...agencias];
          totalPages = json.meta.pagination.pageCount;
          page++;
        } while (page <= totalPages);

        setAgencies(allAgencies);
      } catch (error) {
        console.error("Error fetching agencies:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAgencies();
  }, []);

  return { agencies, isLoading, error };
}