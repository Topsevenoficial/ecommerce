"use client";

import React from "react";
import useGetInStockProducts from "@/api/useGetInStockProducts";

// Definimos las props para permitir personalización
interface ProductCountProps {
  title?: string; // Permite personalizar el título
  showLoadingMessage?: boolean; // Mostrar o no el mensaje de carga
  showErrorMessage?: boolean; // Mostrar o no el mensaje de error
}

/**
 * Componente que muestra la cantidad de productos activos disponibles.
 * @param {string} title - Título personalizado para el componente.
 * @param {boolean} showLoadingMessage - Mostrar mensaje de carga.
 * @param {boolean} showErrorMessage - Mostrar mensaje de error.
 */
export default function ProductCount({
  title = "Cantidad de productos disponibles:",
  showLoadingMessage = true,
  showErrorMessage = true,
}: ProductCountProps) {
  const { result, loading, error } = useGetInStockProducts();

  if (loading && showLoadingMessage) {
    return <p>Cargando la cantidad de productos...</p>;
  }

  if (error && showErrorMessage) {
    return <p>Error al obtener los productos: {error.message}</p>;
  }

  return (
    <div>
      <h2>{title}</h2>
      <p>{result ? result.length : 0}</p>
    </div>
  );
}

/**
 * Hook reutilizable para obtener el número de productos activos.
 * Puede exportarse si es necesario para otros componentes.
 */
export { useGetInStockProducts };
