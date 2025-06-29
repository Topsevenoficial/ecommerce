// D:/Proyecto Ecommerce NextJS/frontend-ecommerce/components/productList.tsx
"use client";

import React from "react";
import { FlattenedProductType, ProductType, ProductVariantType } from "@/types/product";
import { ProductCard } from "./product-card";
import { Badge } from "./ui/badge";

interface ProductListProps {
  products: ProductType[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="container px-6 py-4 mx-auto text-center">
        <p className="text-muted-foreground">
          No encontramos productos disponibles en este momento.
        </p>
      </div>
    );
  }

  // "Aplanamos" los productos y sus variantes
  const flattenedProducts: FlattenedProductType[] = products.flatMap(
    (product: ProductType) => {
      const variants = product.product_variants || [];
      const hasVariants = variants.length > 0;
      return hasVariants
        ? variants.map((variant: ProductVariantType) => ({
            ...product,
            combinedId: `${product.id}-${variant.id}`,
            productName: `${product.productName} - ${variant.colorMontura}/${variant.colorLente}`,
            images: variant.images?.length ? variant.images : product.images,
            variantId: variant.id,
            onSale: variant.onSale,
          }))
        : [
            {
              ...product,
              combinedId: `${product.id}`,
            },
          ];
    }
  );

  const sortedProducts = [...flattenedProducts].sort((a, b) => {
    const aStock = a.stock ?? 0;
    const bStock = b.stock ?? 0;
    
    // Primero, manejar el caso de productos agotados (siempre al final)
    if (aStock <= 0 && bStock > 0) return 1;  // a va al final
    if (aStock > 0 && bStock <= 0) return -1; // b va al final
    
    // Si ambos están agotados o ambos tienen stock, ordenar por destacado
    if (a.isFeatured && !b.isFeatured) return -1; // a primero si es destacado
    if (!a.isFeatured && b.isFeatured) return 1;  // b primero si es destacado
    
    return 0; // Mantener orden original en otros casos
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedProducts.map((prod) => (
          <ProductCard
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
