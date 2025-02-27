"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  Truck,
  ArrowRight,
  HelpCircle,
  CreditCard,
  Smartphone,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { getStrapiMedia } from "@/lib/media";

interface CartItem {
  id: string;
  productName: string;
  price: number;
  discount?: number;
  images?: { url: string }[];
}

interface Agency {
  id: string;
  name: string;
  ubicacion: string;
  direction: string;
}

interface CustomerData {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  address_city: string;
  country_code: string;
  phone_number: string;
  dni: string;
}

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
  removeItem: (id: string) => void;
  selectedAgency: Agency | null;
  shippingMethod: "shalom" | "olva";
  customerData: CustomerData;
}

const PaymentMethodsList: React.FC = () => {
  const paymentMethods = [
    {
      label: "Tarjetas",
      Icon: CreditCard,
      bgColor: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-600 dark:text-blue-300",
    },
    {
      label: "Yape",
      Icon: Smartphone,
      bgColor: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-600 dark:text-green-300",
    },
  ];

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold mb-2">Medios de Pago</h3>
      <div className="grid grid-cols-2 gap-2">
        {paymentMethods.map(({ label, Icon, bgColor, textColor }, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center p-2 rounded-md shadow-sm ${bgColor} hover:shadow transition-shadow`}
          >
            <Icon className={`w-6 h-6 ${textColor}`} />
            <span className={`mt-1 text-xs font-medium ${textColor} text-center`}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  total,
  removeItem,
  selectedAgency,
  shippingMethod,
  customerData,
}) => {
  // Si el envío es "olva" cuesta 20; para "shalom" es 0.
  const shippingCost = shippingMethod === "olva" ? 20 : 0;
  const finalTotal = total + shippingCost;

  return (
    <Card className="bg-primary/5 border-t-4 border-primary rounded-lg shadow-sm p-6">
      {/* Título */}
      <h2 className="text-2xl font-bold mb-4 text-primary flex items-center">
        Resumen de tu Pedido
        <span className="ml-3 px-2 py-1 text-xs font-semibold bg-green-200 text-green-800 rounded">
          Último Paso
        </span>
      </h2>
      <Separator className="mb-6" />

      {/* Datos del Cliente */}
      <div className="mb-6 p-3 border rounded-md bg-secondary/30">
        <h3 className="text-lg font-semibold mb-2">Datos del Cliente</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            <span className="font-medium">Nombre:</span>{" "}
            {customerData.first_name} {customerData.last_name}
          </li>
          <li>
            <span className="font-medium">Correo:</span> {customerData.email}
          </li>
          <li>
            <span className="font-medium">Teléfono:</span> {customerData.phone_number}
          </li>
          <li>
            <span className="font-medium">DNI:</span> {customerData.dni}
          </li>
        </ul>
      </div>

      {/* Información de Envío */}
      {shippingMethod === "shalom" && selectedAgency ? (
        <div className="mb-6 p-3 border rounded-md bg-secondary/30">
          <h3 className="text-lg font-semibold mb-2">Envío por Agencia</h3>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Agencia:</span> {selectedAgency.name}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Ubicación:</span> {selectedAgency.ubicacion}
          </p>
          <Accordion type="single" collapsible className="mt-2">
            <AccordionItem value="agency-summary">
              <AccordionTrigger className="text-sm font-medium">
                {selectedAgency.direction.length > 20
                  ? `${selectedAgency.direction.slice(0, 20)}...`
                  : selectedAgency.direction}
              </AccordionTrigger>
              <AccordionContent className="text-sm">
                Dirección completa: {selectedAgency.direction}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <p className="text-xs text-muted-foreground mt-2">
            * El recojo en agencia Shalom no tiene costo adicional.
          </p>
        </div>
      ) : shippingMethod === "olva" ? (
        <div className="mb-6 p-3 border rounded-md bg-secondary/30">
          <h3 className="text-lg font-semibold mb-2">Dirección de Envío</h3>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Dirección:</span> {customerData.address},{" "}
            {customerData.address_city}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Costo de envío a domicilio: <span className="font-medium">S/20.00</span>
          </p>
        </div>
      ) : null}

      {/* Lista de productos */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Tu carrito está vacío.</p>
        ) : (
          items.map((item) => {
            const finalPrice = item.discount ? item.price - item.discount : item.price;
            return (
              <Card
                key={item.id}
                className="p-4 shadow-sm border rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 transition-shadow duration-200 ease-in-out hover:shadow-md"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                    <Image
                      src={
                        item.images && item.images[0]?.url
                          ? getStrapiMedia(item.images[0].url)
                          : "/placeholder.png"
                      }
                      alt={item.productName}
                      fill
                      sizes="100vw"
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{item.productName}</p>
                    {item.discount && item.discount > 0 ? (
                      <div className="flex items-center space-x-2 text-sm">
                        <Badge variant="secondary">Oferta</Badge>
                        <span className="font-medium">S/{finalPrice.toFixed(2)}</span>
                        <span className="line-through text-destructive">
                          S/{item.price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium">S/{item.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                <div className="self-end sm:self-auto">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[90vw] break-words p-2">
                      <p>Eliminar producto</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <Separator className="mt-6" />

      {/* Totales */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Subtotal</span>
          <span className="font-semibold text-lg">S/{total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-muted-foreground" />
            <span className="text-lg">Envío</span>
          </div>
          <span className="text-lg">S/{shippingCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center border-t pt-2">
          <span className="font-bold text-xl">Total</span>
          <span className="font-bold text-xl">S/{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col gap-4 mt-6">
        <Button
          type="submit"
          className="w-full py-4 text-xl font-bold bg-emerald-600 dark:bg-emerald-500 text-white shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
          disabled={items.length === 0}
        >
          <span className="flex items-center justify-center gap-2">
            Proceder al pago
            <ArrowRight className="w-6 h-6 transition-transform duration-300" />
          </span>
        </Button>
        <Button asChild variant="outline" className="w-full py-3 text-lg">
          <a
            href="https://wa.me/51984670999?text=Necesito%20ayuda%20con%20mi%20compra"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-5 h-5" />
            Soporte WhatsApp
          </a>
        </Button>
      </div>

      {/* Sección de medios de pago */}
      <PaymentMethodsList />

      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value="payment-info">
          <AccordionTrigger className="text-sm font-medium">
            ¿Por qué es seguro tu pago?
          </AccordionTrigger>
          <AccordionContent className="text-sm">
            <p>
              Al pagar con Culqi, disfrutas de una plataforma certificada PCI-DSS y con
              sistemas antifraude avanzados, lo que garantiza que tus datos están encriptados y protegidos. Además, el proceso de pago es simple, rápido y se adapta a tus preferencias.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default OrderSummary;
