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
import { Card } from "@/components/ui/card";
import { MessageSquare, CreditCard, Truck, Package, AlertTriangle, RefreshCw, Shield, ExternalLink, CheckCircle2, Lock } from "lucide-react";

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

      {/* Sección de Preguntas Frecuentes */}
      <section className="py-12 sm:py-16 bg-background border-t">
        <div className="container max-w-5xl px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Preguntas Frecuentes
            </h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Encuentra respuestas a las dudas más comunes sobre nuestros productos y servicios
            </p>
          </div>
          
          <div className="space-y-5 max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <Card className="overflow-hidden border border-border/50 bg-card/50 hover:bg-card/70 transition-all duration-200 hover:shadow-lg">
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/20 transition-colors">
                    <span className="text-left text-base sm:text-lg font-semibold">
                      <CreditCard className="h-5 w-5 mr-3 text-primary inline-block" />
                      ¿Cuáles son los métodos de pago disponibles?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pt-0 text-base text-muted-foreground bg-muted/10">
                    <div className="pt-4 space-y-3">
                      <p>Aceptamos múltiples métodos de pago para tu comodidad:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Tarjetas de crédito y débito</li>
                        <li>Transferencias bancarias</li>
                        <li>Yape / Plin</li>
                        <li>Pago contra entrega (solo en Cusco)</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Card>

              <Card className="overflow-hidden border border-border/50 bg-card/50 hover:bg-card/70 transition-all duration-200 hover:shadow-lg">
                <AccordionItem value="item-2" className="border-0">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/20 transition-colors">
                    <span className="text-left text-base sm:text-lg font-semibold">
                      <Truck className="h-5 w-5 mr-3 text-primary inline-block" />
                      ¿Cuánto tiempo tarda en llegar mi pedido?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pt-0 text-base text-muted-foreground bg-muted/10">
                    <div className="pt-4 space-y-3">
                      <p>Realizamos envíos a todo el Perú de lunes a sábado. El tiempo de entrega dependerá de la distancia desde Cusco.</p>
                      <p>Una vez procesado tu pedido, te enviaremos un mensaje con el código de seguimiento para que puedas monitorear tu envío en tiempo real.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Card>

              <Card className="overflow-hidden border border-border/50 bg-card/50 hover:bg-card/70 transition-all duration-200 hover:shadow-lg">
                <AccordionItem value="item-3" className="border-0">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/20 transition-colors">
                    <span className="text-left text-base sm:text-lg font-semibold">
                      <Package className="h-5 w-5 mr-3 text-primary inline-block" />
                      ¿Cómo puedo hacer seguimiento de mi pedido?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pt-0 text-base text-muted-foreground bg-muted/10">
                    <div className="pt-4 space-y-4">
                      <p>Puedes realizar el seguimiento de tu pedido de estas formas:</p>
                      <div className="space-y-4">
                        <a
                          href="https://rastrea.shalom.pe/"
                          className="flex items-center text-primary hover:underline font-medium"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          https://rastrea.shalom.pe/
                        </a>
                        <div className="pt-2">
                          <p className="font-medium mb-2">O contáctanos por WhatsApp:</p>
                          <a
                            href="https://wa.me/51984670999?text=Hola,%20necesito%20información%20sobre%20el%20seguimiento%20de%20mi%20pedido"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-medium py-2 px-4 rounded-lg transition-colors"
                          >
                            <MessageSquare className="h-4 w-4" />
                            +51 984 670 999
                          </a>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Card>

              <Card className="overflow-hidden border border-border/50 bg-card/50 hover:bg-card/70 transition-all duration-200 hover:shadow-lg">
                <AccordionItem value="item-4" className="border-0">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/20 transition-colors">
                    <span className="text-left text-base sm:text-lg font-semibold">
                      <AlertTriangle className="h-5 w-5 mr-3 text-primary inline-block" />
                      ¿Qué hago si mi producto tiene un defecto?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pt-0 text-base text-muted-foreground bg-muted/10">
                    <div className="pt-4 space-y-4">
                      <p>Si recibiste un producto con algún defecto de fábrica, sigue estos pasos:</p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Contáctanos dentro de las primeras 48 horas de recibido el producto</li>
                        <li>Envíanos fotos claras del defecto</li>
                        <li>Conserva el empaque y la boleta de compra original</li>
                        <li>Te indicaremos el proceso de cambio o devolución</li>
                      </ol>
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                        <p className="text-yellow-700 text-sm">
                          <strong>Importante:</strong> No aceptamos devoluciones de productos que presenten daños por mal uso o manipulación inadecuada.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Card>

              <Card className="overflow-hidden border border-border/50 bg-card/50 hover:bg-card/70 transition-all duration-200 hover:shadow-lg">
                <AccordionItem value="item-5" className="border-0">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/20 transition-colors">
                    <span className="text-left text-base sm:text-lg font-semibold">
                      <RefreshCw className="h-5 w-5 mr-3 text-primary inline-block" />
                      ¿Puedo devolver o cambiar mi producto?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pt-0 text-base text-muted-foreground bg-muted/10">
                    <div className="pt-4 space-y-4">
                      <p>Nuestra política de devoluciones es la siguiente:</p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-foreground mb-2">✅ Cambios</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Plazo: 15 días</li>
                            <li>• Producto en perfecto estado</li>
                            <li>• Con empaque original</li>
                            <li>• Con boleta de compra</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-foreground mb-2">🔄 Devoluciones</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Plazo: 30 días</li>
                            <li>• Reembolso en 3-5 días hábiles</li>
                            <li>• Aplican restricciones</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Card>

              <Card className="overflow-hidden border border-border/50 bg-card/50 hover:bg-card/70 transition-all duration-200 hover:shadow-lg">
                <AccordionItem value="item-6" className="border-0">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/20 transition-colors">
                    <span className="text-left text-base sm:text-lg font-semibold">
                      <Shield className="h-5 w-5 mr-3 text-primary inline-block" />
                      ¿Cómo se utilizan mis datos personales?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pt-0 text-base text-muted-foreground bg-muted/10">
                    <div className="pt-4 space-y-4">
                      <p>En nuestra tienda valoramos y protegemos tu privacidad:</p>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">Qué datos recopilamos</h4>
                            <p className="text-sm">Solo la información necesaria para procesar tu compra y entregarte el mejor servicio.</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <Lock className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">Cómo protegemos tus datos</h4>
                            <p className="text-sm">Utilizamos protocolos de seguridad avanzados y no compartimos tu información con terceros.</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground/80 pt-2">
                        Para más detalles, consulta nuestra <a href="/politica-privacidad" className="text-primary hover:underline">Política de Privacidad</a>.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Card>
            </Accordion>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                ¿No encontraste lo que buscabas?
              </p>
              <a 
                href="https://wa.me/51984670999?text=Hola,%20tengo%20una%20consulta%20sobre%20un%20producto" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                Contáctanos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
