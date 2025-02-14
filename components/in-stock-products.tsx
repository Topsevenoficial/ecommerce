"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useGetInStockProducts from "@/api/useGetInStockProducts";
import { ProductType, ProductVariantType } from "@/types/product";
import SkeletonSchema from "./skeletonSchema";

// Importa la misma tarjeta genérica
import { ProductCard } from "@/components/product-card";

/**
 * Módulo que muestra TODOS los productos con active = true.
 * (No filtra por isFeatured; solo filtra por active)
 */
const InStockProducts = () => {
  const { result: products, loading, error } = useGetInStockProducts();

  // 🔴 Manejo de error
  if (error) {
    console.error("Error al obtener productos en stock:", error);
    return (
      <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
        <p className="text-red-500">
          Ocurrió un error al cargar los productos en stock.
        </p>
      </div>
    );
  }

  // 🔄 Skeleton mientras carga
  if (loading) {
    return (
      <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
        <SkeletonSchema grid={3} />
      </div>
    );
  }

  // ⚪ Si no hay productos activos
  if (!products || products.length === 0) {
    return (
      <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
        <p className="text-gray-500 text-center">
          No hay productos en stock disponibles en este momento.
        </p>
      </div>
    );
  }

  // 🛠️ Aplanar productos & variantes
  const flattenedProducts = products.flatMap((product: ProductType) => {
    if (product.product_variants?.length) {
      return product.product_variants.map((variant: ProductVariantType) => ({
        ...product,
        id: `${product.id}-variant-${variant.id}`,
        productName: `${product.productName} - ${variant.colorMontura}/${variant.colorLente}`,
        images: variant.images?.length ? variant.images : product.images,
        variantId: variant.id,
      }));
    }
    // Si no tiene variantes, se retorna el producto tal cual
    return [product];
  });

  return (
    <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
      <h3 className="text-4xl font-extrabold tracking-tight mb-4 sm:mb-8 text-foreground dark:text-foreground">
        Productos en Stock
      </h3>

      {/* ✅ Carrusel de productos */}
      <Carousel className="relative w-full">
        <CarouselContent className="space-x-4 scrollbar-hide">
          {flattenedProducts.map((product: ProductType) => (
            <CarouselItem
              key={product.id}
              className="md:basis-1/2 lg:basis-1/3"
            >
              {/* Reutilizamos la tarjeta FeaturedProductCard */}
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Botones de navegación del carrusel */}
        <CarouselPrevious className="bg-white dark:bg-secondary p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-secondary-dark transition-colors z-10">
          <ChevronLeft size={24} />
        </CarouselPrevious>
        <CarouselNext className="bg-white dark:bg-secondary p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-secondary-dark transition-colors z-10">
          <ChevronRight size={24} />
        </CarouselNext>
      </Carousel>
    </div>
  );
};

export default InStockProducts;
