"use client";

import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";

/**
 * Hook personalizado para obtener todos los productos con active = true
 * de nuestro backend Strapi.
 *
 * - Revisa tu .env para que NEXT_PUBLIC_BACKEND_URL esté definido correctamente.
 * - Filtra por active=true y usa populate=* para traer las relaciones (imágenes, variantes, etc.).
 */
export default function useGetInStockProducts() {
  const [result, setResult] = useState<ProductType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Elimina la barra final de la URL base, si existe
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  const url = `${baseUrl}/api/products?filters[active][$eq]=true&populate=*`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const jsonData = await response.json();
        setResult(jsonData.data);
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

    fetchData();
  }, [url]);

  return {
    loading,
    result,
    error,
  };
}
