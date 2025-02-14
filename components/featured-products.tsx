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
import useGetFeaturedProducts from "@/api/useGetFeaturedProducts";
import { ProductType, ProductVariantType } from "@/types/product";
import SkeletonSchema from "./skeletonSchema";

// Importamos la tarjeta "genérica"
import { ProductCard } from "./product-card";

const FeaturedProducts = () => {
  const { result, loading, error } = useGetFeaturedProducts();

  // Mostrar error si falla la API
  if (error) {
    console.error("Error al obtener productos destacados:", error);
    return (
      <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
        <p className="text-red-500">
          Ocurrió un error al cargar los productos destacados.
        </p>
      </div>
    );
  }

  // Mostrar Skeleton mientras carga
  if (loading) {
    return (
      <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
        <SkeletonSchema grid={3} />
      </div>
    );
  }

  // Mostrar mensaje si no hay productos
  if (!result || result.length === 0) {
    return (
      <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
        <p className="text-gray-500 text-center">
          No hay productos destacados disponibles en este momento.
        </p>
      </div>
    );
  }

  /**
   * Transformar productos para mostrar cada variante como un producto individual.
   */
  const flattenedProducts = result.flatMap((product: ProductType) => {
    if (product.product_variants?.length > 0) {
      // Si el producto tiene variantes, mostramos cada variante
      return product.product_variants.map((variant: ProductVariantType) => ({
        ...product,
        id: `${product.id}-variant-${variant.id}`, // Crear un ID único
        productName: `${product.productName} - ${variant.colorMontura}/${variant.colorLente}`,
        images: variant.images?.length ? variant.images : product.images,
        // Mantener el precio del producto principal (o ajustarlo si lo deseas)
        price: product.price,
        // Guardar el ID de la variante
        variantId: variant.id,
      }));
    }

    // Si no tiene variantes, devolver el producto tal cual
    return [product];
  });

  return (
    <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
      <h3 className="text-4xl font-extrabold tracking-tight mb-4 sm:mb-8 text-foreground dark:text-foreground">
        Productos Destacados
      </h3>

      <Carousel className="relative w-full">
        <CarouselContent className="space-x-4 scrollbar-hide">
          {flattenedProducts.map((product: ProductType) => (
            <CarouselItem
              key={product.id}
              className="md:basis-1/2 lg:basis-1/3"
            >
              {/* Usamos la tarjeta genérica */}
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Botones del carrusel */}
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

export default FeaturedProducts;
