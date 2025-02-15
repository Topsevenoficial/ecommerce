"use client";

import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";

/**
 * Hook personalizado para obtener un producto por su slug desde el backend Strapi.
 *
 * - Asegúrate de que NEXT_PUBLIC_BACKEND_URL esté definido correctamente.
 * - Filtra por el slug proporcionado y usa `populate=*` para traer todas las relaciones necesarias.
 */
export default function useGetProductBySlug(slug: string) {
  const [result, setResult] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Elimina la barra final de la URL base, si existe
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  const url = `${baseUrl}/api/products?filters[slug][$eq]=${slug}&populate=*`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const jsonData = await response.json();

        if (jsonData.data && jsonData.data.length > 0) {
          setResult(jsonData.data[0]);
        } else {
          setResult(null);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("Ocurrió un error inesperado"));
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    } else {
      setLoading(false);
      setResult(null);
    }
  }, [url, slug]);

  return {
    loading,
    result,
    error,
  };
}
