import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";

/**
 * Hook personalizado para obtener los productos destacados
 * de nuestro backend Strapi.
 *
 * - Lee la URL base de tu archivo .env:
 *   NEXT_PUBLIC_BACKEND_URL (ej: https://e-backend-ncui.onrender.com)
 *
 * - Filtra por isFeatured = true y usa `populate=*` para obtener relaciones e imágenes.
 */
export default function useGetFeaturedProducts() {
  const [result, setResult] = useState<ProductType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Elimina la barra final, si existe
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  const url = `${baseUrl}/api/products?filters[isFeatured][$eq]=true&populate=*`;

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
