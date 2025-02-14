"use client";

import React, { useMemo } from "react";
import { ProductType } from "D:/Proyecto Ecommerce NextJS/frontend-ecommerce/types/product";
import ReactMarkdown from "react-markdown";

// Componentes ShadCN
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Iconos
import { Package, ShieldCheck, Info, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

// Hooks para el carrito y para controlar la visibilidad del sheet
import { useCart } from "@/hooks/use-cart";
import { useCartSheet } from "@/hooks/use-cart-sheet";

// Descripciones de materiales
const MATERIAL_DESCRIPTIONS = {
  montura: {
    TR90: "El TR90 es un polímero de gran ligereza y flexibilidad, ofreciendo mayor comodidad y resistencia a golpes.",
    Aluminio:
      "La montura de aluminio es liviana y duradera, brindando un aspecto moderno y resistente a la corrosión.",
  },
  lente: {
    Policarbonato:
      "El policarbonato es un material resistente a impactos, ligero y con buena claridad óptica.",
    TAC: "El TAC (Triacetato de Celulosa) ofrece nitidez y es eficaz en la reducción de reflejos.",
  },
  protecciones: {
    polarizado:
      "Las lentes polarizadas reducen el deslumbramiento y la fatiga visual, ofreciendo mayor comodidad en condiciones de mucha luz.",
    uv400:
      "La protección UV400 bloquea el 100% de los rayos UVA y UVB, ayudando a prevenir daños oculares a largo plazo.",
    visionHD:
      "Visión HD ofrece una claridad excepcional y nitidez mejorada para una experiencia visual superior.",
    antiImpacto:
      "Protección contra impactos, ideal para actividades deportivas o entornos exigentes.",
    barreraDeslumbramiento:
      "Reduce el deslumbramiento de luces intensas para mayor comodidad visual.",
    limpiaFacil:
      "Tratamiento repelente al agua y manchas que facilita la limpieza de los lentes.",
  },
};

interface ProductInfoProps {
  product: ProductType;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addItem } = useCart();
  const { setOpen } = useCartSheet();

  // Determinamos si existe descuento
  const hasDiscount = (product.discount ?? 0) > 0;
  const discountAmount = hasDiscount ? product.discount : 0;
  const discountedPrice = hasDiscount
    ? product.price - discountAmount
    : product.price;

  // Memorizar los valores formateados para evitar discrepancias en el renderizado
  const formattedOriginalPrice = useMemo(
    () => formatPrice(product.price),
    [product.price]
  );
  const formattedDiscountAmount = useMemo(
    () => (hasDiscount ? formatPrice(discountAmount) : ""),
    [discountAmount, hasDiscount]
  );
  const formattedDiscountedPrice = useMemo(
    () => formatPrice(discountedPrice),
    [discountedPrice]
  );

  const handleAddToCart = () => {
    addItem(product);
    setOpen(true);
  };

  return (
    <section className="space-y-6 sm:px-8">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2 flex-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            {product.productName}
          </h1>
          {product.marca && (
            <Badge variant="secondary" className="text-sm mt-1 sm:mt-0">
              {product.marca}®
            </Badge>
          )}

          {product.active && (
            <div className="relative flex items-center mt-1">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full animate-ping bg-gradient-to-r from-green-300 to-green-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <span className="ml-2 text-sm">En stock</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:items-end gap-1 sm:gap-2">
          {hasDiscount && (
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm text-muted-foreground line-through">
                {formattedOriginalPrice}
              </span>
              <Badge variant="destructive" className="text-xs flex-shrink-0">
                -{formattedDiscountAmount}
              </Badge>
            </div>
          )}
          <p className="text-2xl font-bold text-primary sm:text-3xl lg:text-4xl">
            {formattedDiscountedPrice}
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {product.materialMontura && (
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground leading-none">
                  Material de montura
                </p>
                <p className="text-sm font-medium leading-tight">
                  {product.materialMontura}
                </p>
              </div>
            </div>
          )}

          <Separator
            orientation="vertical"
            className="h-6 sm:block hidden bg-border/50"
          />
          <Separator orientation="horizontal" className="sm:hidden" />

          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground leading-none">
                Atributos
              </p>
              <div className="flex flex-wrap gap-1.5">
                {product.polarizado && (
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-1 rounded-md"
                  >
                    Polarizado
                  </Badge>
                )}
                {product.UV400 && (
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-1 rounded-md"
                  >
                    UV400
                  </Badge>
                )}
                {product.visionHD && (
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-1 rounded-md"
                  >
                    Visión HD
                  </Badge>
                )}
                {product.antiImpacto && (
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-1 rounded-md"
                  >
                    Anti-Impacto
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full gap-2 text-sm sm:text-base"
            >
              <Info className="h-4 w-4" />
              Ver especificaciones
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-full sm:max-w-[90vw] md:max-w-xl flex flex-col"
          >
            <SheetHeader className="mb-4 sm:mb-6">
              <SheetTitle className="text-xl sm:text-2xl font-bold">
                Detalles técnicos
              </SheetTitle>
              <SheetDescription className="text-sm sm:text-base">
                Características completas de {product.productName}
              </SheetDescription>
            </SheetHeader>

            <Tabs defaultValue="details" className="flex-1 overflow-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details" className="text-xs sm:text-sm">
                  Materiales
                </TabsTrigger>
                <TabsTrigger
                  value="measurements"
                  className="text-xs sm:text-sm"
                >
                  Medidas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="pt-4 sm:pt-6">
                <Accordion
                  type="single"
                  collapsible
                  className="space-y-2 sm:space-y-4"
                >
                  <AccordionItem value="materials">
                    <AccordionTrigger className="flex gap-3 [&>svg]:text-primary">
                      <Package className="h-5 w-5" />
                      <span className="text-base sm:text-lg">
                        Materiales de Fabricación
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-9 space-y-4 sm:space-y-6">
                      {product.materialMontura && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Montura:</span>
                            <Badge
                              variant="outline"
                              className="text-xs sm:text-sm"
                            >
                              {product.materialMontura}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {
                              MATERIAL_DESCRIPTIONS.montura[
                                product.materialMontura
                              ]
                            }
                          </p>
                        </div>
                      )}

                      {product.materialLente && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Lentes:</span>
                            <Badge
                              variant="outline"
                              className="text-xs sm:text-sm"
                            >
                              {product.materialLente}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {MATERIAL_DESCRIPTIONS.lente[product.materialLente]}
                          </p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="protection">
                    <AccordionTrigger className="flex gap-3 [&>svg]:text-primary">
                      <ShieldCheck className="h-5 w-5" />
                      <span className="text-base sm:text-lg">Protecciones</span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-9 space-y-4 sm:space-y-6">
                      {product.polarizado && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Polarizado:</span>
                            <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {MATERIAL_DESCRIPTIONS.protecciones.polarizado}
                          </p>
                        </div>
                      )}

                      {product.UV400 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">UV400:</span>
                            <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {MATERIAL_DESCRIPTIONS.protecciones.uv400}
                          </p>
                        </div>
                      )}

                      {product.visionHD && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Visión HD:</span>
                            <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {MATERIAL_DESCRIPTIONS.protecciones.visionHD}
                          </p>
                        </div>
                      )}

                      {product.antiImpacto && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Anti-Impacto:</span>
                            <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {MATERIAL_DESCRIPTIONS.protecciones.antiImpacto}
                          </p>
                        </div>
                      )}

                      {product.barreraDeslumbramiento && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              Barrera contra el Deslumbramiento:
                            </span>
                            <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {
                              MATERIAL_DESCRIPTIONS.protecciones
                                .barreraDeslumbramiento
                            }
                          </p>
                        </div>
                      )}

                      {product.limpiaFacil && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Limpieza Fácil:</span>
                            <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {MATERIAL_DESCRIPTIONS.protecciones.limpiaFacil}
                          </p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              <TabsContent value="measurements" className="pt-4 sm:pt-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {product.medidas ? (
                    <ReactMarkdown>{product.medidas}</ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground text-center py-4 sm:py-8">
                      No hay medidas disponibles para este producto
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>

        <Button
          size="lg"
          className="w-full text-sm sm:text-lg h-12 sm:h-14"
          onClick={handleAddToCart}
        >
          Agregar al carrito
        </Button>
      </div>
    </section>
  );
}
