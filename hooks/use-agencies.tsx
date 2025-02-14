// hooks/use-agencies.tsx
import { useState, useEffect } from "react";

export interface Agency {
  id: string;
  name: string;
  ubicacion: string;
  direction: string;
}

export function useAgencies() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAgencies() {
      try {
        let page = 1;
        let allAgencies: Agency[] = [];
        let totalPages = 1;

        do {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shaloms?populate=*&pagination[page]=${page}&pagination[pageSize]=100`
          );
          const json = await res.json();
          console.log("Agencies page " + page, json);

          const agencias: Agency[] = json.data.map((item: any) => ({
            id: item.id,
            name: item.attributes ? item.attributes.nombre : item.nombre,
            ubicacion: item.attributes
              ? item.attributes.ubicacion
              : item.ubicacion,
            direction: item.attributes
              ? item.attributes.direccion
              : item.direccion,
          }));

          allAgencies = allAgencies.concat(agencias);
          totalPages = json.meta.pagination.pageCount;
          page++;
        } while (page <= totalPages);

        setAgencies(allAgencies);
      } catch (error) {
        console.error("Error fetching agencies:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAgencies();
  }, []);

  return { agencies, isLoading };
}
