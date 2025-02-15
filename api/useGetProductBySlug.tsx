"use client";

import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";

/**
 * Hook personalizado para obtener un producto por su slug desde el backend Strapi.
 *
 * - Asegúrate de que `NEXT_PUBLIC_BACKEND_URL` esté definido en tu archivo `.env` (por ejemplo, `http://localhost:1337`).
 * - Filtra por el `slug` proporcionado y usa `populate=*` para traer todas las relaciones necesarias.
 *
 * Este hook retorna un objeto con:
 * - `loading`: indica si la solicitud está en curso.
 * - `result`: contiene el producto obtenido o `null` si no se ha obtenido.
 * - `error`: contiene el error en caso de que ocurra alguno durante la solicitud.
 */
export default function useGetProductBySlug(slug: string) {
  const [result, setResult] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Construimos la URL con el filtro por slug y populate todas las relaciones
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?filters[slug][$eq]=${slug}&populate=*`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const jsonData = await response.json();

        // Verificamos si se ha obtenido al menos un producto
        if (jsonData.data && jsonData.data.length > 0) {
          setResult(jsonData.data[0]); // Tomamos el primer (y único) producto
        } else {
          setResult(null); // No se encontró el producto
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    // Solo realizamos la solicitud si el slug no está vacío
    if (slug) {
      fetchData();
    } else {
      setLoading(false);
      setResult(null);
    }
  }, [url, slug]);

  return {
    loading,
    result, // Producto obtenido o null
    error,
  };
}
