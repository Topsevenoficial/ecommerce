"use client";

import React, { useState, useEffect } from "react";
import { CarouselVertical } from "./components/carousel-vertical";
import { CarouselHorizontal } from "./components/carousel-horizontal-enhanced";
import ProductInfo from "./components/product-info";
import InfoAdicional from "./components/info-adicional";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ProductType } from "@/types/product"; // Asegúrate de que la ruta sea correcta
import useSWR from 'swr';
import { Skeleton } from "@/components/ui/skeleton";

interface ProductDetailProps {
  product?: ProductType | null;
  fallbackSlug?: string;
}

// Function to fetch product data client-side
const fetchProduct = async (slug: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
  }
  const url = `${baseUrl}/api/products?filters[slug][$eq]=${slug}&populate=*`;
  
  const res = await fetch(url, { cache: 'force-cache' });
  if (!res.ok) {
    throw new Error(`Error HTTP: ${res.status}`);
  }
  const data = await res.json();
  return data.data && data.data.length > 0 ? data.data[0] : null;
};

// Function to retrieve cached product from localStorage
const getCachedProduct = (slug: string): ProductType | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Try different possible formats of the cache key
    let cached = localStorage.getItem(`product-${slug}`);
    
    // If not found, try alternative formats
    if (!cached) {
      // Look through all localStorage keys to find any that might match
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes(slug)) {
          cached = localStorage.getItem(key);
          break;
        }
      }
    }
    
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
};

// Function to save product to localStorage
const saveProductToCache = (product: ProductType, fallbackSlug?: string) => {
  if (typeof window === 'undefined' || !product) return;
  
  try {
    // Check if product has the expected structure
    const slug = product.slug || 
                (fallbackSlug ? fallbackSlug : 
                (typeof product === 'object' && 'id' in product ? `product-${product.id}` : 'unknown-product'));
    
    localStorage.setItem(`product-${slug}`, JSON.stringify(product));
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
};

export default function ProductDetail({ product, fallbackSlug }: ProductDetailProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cachedProduct, setCachedProduct] = useState<ProductType | null>(null);
  
  // If we have fallbackSlug but no product, try to use SWR to fetch it
  const { data: swrProduct } = useSWR(
    fallbackSlug && !product ? fallbackSlug : null,
    fetchProduct,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 3600000, // 1 hour
    }
  );
  
  // On initial load, check localStorage for the product
  useEffect(() => {
    if (fallbackSlug && !product) {
      const cached = getCachedProduct(fallbackSlug);
      if (cached) {
        setCachedProduct(cached);
      }
    }
  }, [fallbackSlug, product]);
  
  // When we get a product either from props or SWR, save it to cache
  useEffect(() => {
    const productToCache = product || swrProduct;
    if (productToCache) {
      saveProductToCache(productToCache, fallbackSlug);
    }
  }, [product, swrProduct, fallbackSlug]);
  
  // Determine which product data to use (prop, SWR, or cached)
  const displayProduct = product || swrProduct || cachedProduct;
  
  if (!displayProduct) {
    // Skeleton loading state
    return (
      <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6">
          <div className="sm:col-span-8 lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="order-1 sm:order-2 w-full max-w-lg">
              <Skeleton className="h-96 w-full rounded-md" />
            </div>
            <div className="order-2 sm:order-1 flex-shrink-0 w-full sm:w-auto">
              <div className="flex flex-row sm:flex-col gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-16 rounded-md" />
                ))}
              </div>
            </div>
          </div>
          <div className="sm:col-span-4 lg:col-span-5 order-3">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-8 w-1/4 mb-2" />
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
          </div>
        </div>
        <div className="mt-6">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
      {/* Sección superior con carruseles y datos del producto */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6">
        {/* Contenedor de ambos carruseles */}
        <div
          className="sm:col-span-8 lg:col-span-7 flex flex-col sm:flex-row 
                        items-center sm:items-start 
                        justify-center sm:justify-start
                        gap-4 sm:gap-6"
        >
          {/* Carrusel Horizontal (abajo en móvil, derecha en escritorio) */}
          <div className="order-1 sm:order-2 w-full max-w-lg">
            <CarouselHorizontal
              product={displayProduct}
              currentIndex={currentIndex}
              onChange={setCurrentIndex}
            />
          </div>

          {/* Carrusel Vertical (arriba en móvil, izquierda en escritorio) */}
          <div
            className="order-2 sm:order-1 flex-shrink-0 
                          w-full sm:w-auto"
          >
            <CarouselVertical
              product={displayProduct}
              currentIndex={currentIndex}
              onChange={setCurrentIndex}
            />
          </div>
        </div>

        {/* Info del producto a la derecha en escritorio */}
        <div className="sm:col-span-4 lg:col-span-5 order-3">
          <ProductInfo product={displayProduct} />
        </div>
      </div>

      {/* Sección de información adicional */}
      <div className="mt-6 sm:mt-8">
        <InfoAdicional product={displayProduct} />
      </div>

      {/* Sección de Preguntas Frecuentes centrada */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Preguntas Frecuentes
        </h2>
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              ¿Cuáles son los métodos de pago disponibles?
            </AccordionTrigger>
            <AccordionContent>
              Aceptamos pagos con tarjeta de crédito, débito, transferencias
              bancarias, yape/plin e incluso pago contra entrega en la ciudad de
              Cusco.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>¿Cuánto tiempo tarda el envío?</AccordionTrigger>
            <AccordionContent>
              Los envíos se realizan a través de Shalom y tienen un plazo de
              entrega de 2 a 5 días hábiles, dependiendo de la distancia desde
              Cusco.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              ¿Cómo puedo hacer seguimiento de mi pedido?
            </AccordionTrigger>
            <AccordionContent>
              Puedes hacer el seguimiento de tu pedido visitando la página de
              rastreo de Shalom en{" "}
              <a
                href="https://rastrea.shalom.pe/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://rastrea.shalom.pe/
              </a>
              .
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              ¿Qué hago si mi producto tiene un defecto?
            </AccordionTrigger>
            <AccordionContent>
              Si detectas un defecto de fabricación, contáctanos de inmediato
              vía WhatsApp o llamada, teniendo a la mano tu boleta de compra
              para iniciar el proceso de garantía.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>
              ¿Puedo devolver o cambiar mi producto?
            </AccordionTrigger>
            <AccordionContent>
              Sí, ofrecemos un plazo de 3 meses para devoluciones. El producto
              debe estar en perfectas condiciones, sin uso, y con su empaque
              original. Consulta la sección de Política de Devoluciones para más
              detalles.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>
              ¿Cómo se utilizan mis datos personales?
            </AccordionTrigger>
            <AccordionContent>
              Solo recopilamos la información necesaria para gestionar tus
              pedidos y envíos. Tus datos se mantienen seguros y se usan
              exclusivamente para estos fines.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
