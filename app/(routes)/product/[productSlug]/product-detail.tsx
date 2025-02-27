"use client";

import React, { useState } from "react";
import { CarouselVertical } from "./components/carousel-vertical";
import { CarouselHorizontal } from "./components/carousel-horizontal";
import ProductInfo from "./components/product-info";
import InfoAdicional from "./components/info-adicional";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ProductType } from "@/types/product"; // Asegúrate de que la ruta sea correcta

interface ProductDetailProps {
  product: ProductType;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

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
              product={product}
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
              product={product}
              currentIndex={currentIndex}
              onChange={setCurrentIndex}
            />
          </div>
        </div>

        {/* Info del producto a la derecha en escritorio */}
        <div className="sm:col-span-4 lg:col-span-5 order-3">
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Sección de información adicional */}
      <div className="mt-6 sm:mt-8">
        <InfoAdicional product={product} />
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
