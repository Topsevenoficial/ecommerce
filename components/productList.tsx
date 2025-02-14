"use client";

import * as React from "react";
import {
  ProductType,
  ProductVariantType,
  FlattenedProductType,
} from "@/types/product";
import useGetInStockProducts from "@/api/useGetInStockProducts";
import { ProductCard } from "./product-card";
import SkeletonSchema from "./skeletonSchema";
import { Badge } from "./ui/badge";

const ProductList = () => {
  const { result, loading, error } = useGetInStockProducts();

  if (error) {
    return (
      <div className="container px-6 py-4 mx-auto">
        <p className="text-red-500 font-medium">
          ⚠️ Error al cargar los productos. Por favor intente nuevamente.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container px-6 py-4 mx-auto">
        <SkeletonSchema grid={3} />
      </div>
    );
  }

  if (!result || result.length === 0) {
    return (
      <div className="container px-6 py-4 mx-auto text-center">
        <p className="text-muted-foreground">
          No encontramos productos disponibles en este momento.
        </p>
      </div>
    );
  }

  // "Aplanamos" los productos y sus variantes
  const flattenedProducts: FlattenedProductType[] = result.flatMap(
    (product: ProductType) => {
      const variants = product.product_variants || [];
      const hasVariants = variants.length > 0;

      return hasVariants
        ? variants.map((variant: ProductVariantType) => ({
            ...product,
            // Usamos "combinedId" en vez de pisar "id"
            combinedId: `${product.id}-${variant.id}`,
            productName: `${product.productName} - ${variant.colorMontura}/${variant.colorLente}`,
            images: variant.images?.length ? variant.images : product.images,
            variantId: variant.id,
            onSale: variant.onSale,
          }))
        : [
            {
              ...product,
              // Si no hay variantes, le das un combinedId basado en product
              combinedId: `${product.id}`,
            },
          ];
    }
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {flattenedProducts.map((prod) => (
          <ProductCard
            // Usamos "combinedId" para la key
            key={prod.combinedId}
            product={prod}
            badge={
              prod.onSale && (
                <Badge variant="destructive" className="absolute top-3 left-3">
                  30% OFF
                </Badge>
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
