import { useState, useEffect } from "react";

/**
 * El tipo que ya tienes para tu arreglo final.
 * No lo modificamos.
 */
export interface Agency {
  id: string;
  name: string;
  ubicacion: string;
  direction: string;
}

/**
 * 1. Describimos cómo luce el objeto que viene en `json.data[]`.
 *    (Ajusta los campos si Strapi te manda algo diferente)
 */
interface ShalomItemFromStrapi {
  id: number; // o string, según tu Strapi
  attributes?: {
    nombre?: string;
    ubicacion?: string;
    direccion?: string;
  };
  nombre?: string;
  ubicacion?: string;
  direccion?: string;
}

/**
 * 2. Describimos la meta que te manda Strapi
 */
interface ShalomMeta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

/**
 * 3. Describimos la respuesta completa de tu fetch
 */
interface ShalomResponse {
  data: ShalomItemFromStrapi[];
  meta: ShalomMeta;
}

/**
 * 4. El hook que obtiene las agencias de Strapi
 */
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
          // Aquí tipamos la respuesta como ShalomResponse en vez de any
          const json: ShalomResponse = await res.json();
          console.log("Agencies page " + page, json);

          // Mapeamos sin usar `any`:
          const agencias: Agency[] = json.data.map(
            (item: ShalomItemFromStrapi) => ({
              // Convertimos el id a string, ya que `Agency` usa string
              id: String(item.id),
              name: item.attributes
                ? item.attributes.nombre ?? ""
                : item.nombre ?? "",
              ubicacion: item.attributes
                ? item.attributes.ubicacion ?? ""
                : item.ubicacion ?? "",
              direction: item.attributes
                ? item.attributes.direccion ?? ""
                : item.direccion ?? "",
            })
          );

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
