"use client";

import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";

/**
 * Hook personalizado para obtener todos los productos con active = true
 * de nuestro backend Strapi.
 *
 * - Revisa tu .env para que NEXT_PUBLIC_BACKEND_URL = http://localhost:1337
 *   (o tu dominio de Strapi en producción).
 * - Filtra por active=true y usa populate=* para traer las relaciones
 *   (imágenes, variantes, etc.).
 *
 * Esta función retorna un arreglo "crudo" de Strapi (jsonData.data),
 * pero tipado como ProductType[] para mayor comodidad.
 */
export default function useGetInStockProducts() {
  const [result, setResult] = useState<ProductType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Filtramos para active = true.
  // Nota: Si necesitas usar el filtro con `$and`, puedes volver a la versión anterior.
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?filters[active][$eq]=true&populate=*`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const jsonData = await response.json();
        // Strapi v4 con REST: el array de productos está en jsonData.data
        setResult(jsonData.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return {
    loading,
    result, // Array de ProductType[] o null
    error,
  };
}
