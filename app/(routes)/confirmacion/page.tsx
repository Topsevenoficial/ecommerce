"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { Check, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OrderData, OrderItem } from "@/types/order";

export default function ConfirmacionPage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    // Recuperamos los datos de la orden almacenados en sessionStorage
    const orderDataString = sessionStorage.getItem("orderData");
    if (orderDataString) {
      try {
        const parsedData = JSON.parse(orderDataString) as OrderData;
        setOrderData(parsedData);
      } catch (error) {
        console.error("Error al parsear orderData:", error);
      }
    }
  }, []);

  const generatePDF = () => {
    if (!orderData) return;

    const doc = new jsPDF();
    const marginLeft = 14;
    let y = 20;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Encabezado de la Empresa
    doc.setFontSize(22);
    doc.setTextColor("#007bff");
    doc.text("TopSeven Oficial", pageWidth / 2, y, { align: "center" });
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("RUC: 1073602011", pageWidth / 2, y, { align: "center" });
    y += 6;
    doc.text("Av Prolongación Pera 650, Cusco", pageWidth / 2, y, { align: "center" });
    y += 12;

    // Título del Recibo
    doc.setFontSize(16);
    doc.setTextColor("#333333");
    doc.text("Recibo de Compra", pageWidth / 2, y, { align: "center" });
    y += 10;

    // Línea divisoria
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(marginLeft, y, pageWidth - marginLeft, y);
    y += 8;

    // Datos de la Orden
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Número de orden: ${orderData.orderNumber}`, marginLeft, y);
    y += 8;
    doc.text(`Fecha de compra: ${orderData.date}`, marginLeft, y);
    y += 8;
    doc.text(
      `Subtotal: S/ ${orderData.subtotal !== undefined ? orderData.subtotal.toFixed(2) : "0.00"}`,
      marginLeft,
      y
    );
    y += 8;
    doc.text(
      `Costo de envío: S/ ${orderData.shipping_cost !== undefined ? orderData.shipping_cost.toFixed(2) : "0.00"}`,
      marginLeft,
      y
    );
    y += 8;
    doc.text(
      `Total pagado: S/ ${orderData.total !== undefined ? orderData.total.toFixed(2) : "0.00"}`,
      marginLeft,
      y
    );
    y += 8;
    if (orderData.metodo_envio) {
      doc.text(`Método de envío: ${orderData.metodo_envio}`, marginLeft, y);
      y += 10;
    } else {
      y += 10;
    }

    // Datos del Cliente
    if (orderData.customer) {
      doc.setFontSize(12);
      doc.setTextColor("#007bff");
      doc.text("Datos del Cliente:", marginLeft, y);
      y += 8;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(
        `Nombre: ${orderData.customer.first_name} ${orderData.customer.last_name}`,
        marginLeft,
        y
      );
      y += 6;
      doc.text(`Email: ${orderData.customer.email}`, marginLeft, y);
      y += 6;
      doc.text(`Dirección: ${orderData.customer.address}`, marginLeft, y);
      y += 6;
      doc.text(`Ciudad: ${orderData.customer.address_city}`, marginLeft, y);
      y += 6;
      doc.text(`Teléfono: ${orderData.customer.phone_number}`, marginLeft, y);
      y += 6;
      doc.text(`DNI: ${orderData.customer.dni}`, marginLeft, y);
      y += 10;
    }

    // Sección de Productos
    doc.setFontSize(12);
    doc.setTextColor("#007bff");
    doc.text("Productos:", marginLeft, y);
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    (orderData.items ?? []).forEach((item: OrderItem) => {
      const itemText = `${item.name} (x${item.quantity}) - S/ ${(item.price * item.quantity).toFixed(2)}`;
      doc.text(itemText, marginLeft, y);
      y += 6;
    });
    y += 10;

    // Nota Final
    doc.setFontSize(12);
    doc.setTextColor("#333333");
    doc.text("Gracias por su compra.", marginLeft, y);
    y += 8;
    doc.text("Visite TopSeven Oficial para más productos.", marginLeft, y);

    doc.save(`recibo_${orderData.orderNumber}.pdf`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="max-w-2xl w-full p-8 shadow-lg rounded-lg">
        {/* Encabezado de confirmación */}
        <div className="text-center">
          <Check className="w-16 h-16 text-green-600 mx-auto" />
          <h1 className="mt-4 text-3xl font-bold text-green-600">¡Pago Exitoso!</h1>
          <p className="mt-4 text-lg text-muted-foreground">Tu pago ha sido procesado correctamente.</p>
          <p className="mt-2 text-md">
            Gracias por tu compra. En breve nos pondremos en contacto vía WhatsApp para coordinar el envío de tu pedido.
          </p>
        </div>

        <Separator className="my-6" />

        {/* Detalles de la orden */}
        {orderData ? (
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="orderDetails">
              <AccordionTrigger className="flex items-center justify-between text-lg font-medium">
                Detalles de tu compra
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div className="grid grid-cols-2 gap-4">
                    <p className="font-medium">Número de orden:</p>
                    <p>{orderData.orderNumber}</p>
                    <p className="font-medium">Fecha de compra:</p>
                    <p>{orderData.date}</p>
                    <p className="font-medium">Subtotal:</p>
                    <p>
                      S/ {orderData.subtotal !== undefined ? orderData.subtotal.toFixed(2) : "0.00"}
                    </p>
                    <p className="font-medium">Costo de envío:</p>
                    <p>
                      S/ {orderData.shipping_cost !== undefined ? orderData.shipping_cost.toFixed(2) : "0.00"}
                    </p>
                    <p className="font-medium">Total pagado:</p>
                    <p>
                      S/ {orderData.total !== undefined ? orderData.total.toFixed(2) : "0.00"}
                    </p>
                    {orderData.metodo_envio && (
                      <>
                        <p className="font-medium">Método de envío:</p>
                        <p>{orderData.metodo_envio}</p>
                      </>
                    )}
                  </div>

                  {/* Datos del Cliente */}
                  {orderData.customer && (
                    <div>
                      <p className="font-medium mb-2">Datos del Cliente:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <p>
                          <strong>Nombre:</strong> {orderData.customer.first_name} {orderData.customer.last_name}
                        </p>
                        <p>
                          <strong>Email:</strong> {orderData.customer.email}
                        </p>
                        <p>
                          <strong>Dirección:</strong> {orderData.customer.address}
                        </p>
                        <p>
                          <strong>Ciudad:</strong> {orderData.customer.address_city}
                        </p>
                        <p>
                          <strong>Teléfono:</strong> {orderData.customer.phone_number}
                        </p>
                        <p>
                          <strong>DNI:</strong> {orderData.customer.dni}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Productos */}
                  <div>
                    <p className="font-medium mb-2">Productos:</p>
                    <ul className="list-disc ml-6 space-y-1">
                      {(orderData.items ?? []).map((item: OrderItem) => (
                        <li key={item.id} className="break-words">
                          {item.name} (x{item.quantity}) - S/ {(item.price * item.quantity).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            No se encontraron detalles de la compra.
          </p>
        )}

        <Alert variant="info" className="mt-6">
          <Info className="w-5 h-5 mr-2" />
          <div>
            <AlertTitle className="font-medium">Coordinación de envío</AlertTitle>
            <AlertDescription className="text-sm">
              Nos pondremos en contacto contigo por WhatsApp en las próximas horas para confirmar la dirección y coordinar la entrega.
            </AlertDescription>
          </div>
        </Alert>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button variant="default" asChild className="w-full sm:w-auto">
            <a href="/">Volver a la tienda</a>
          </Button>
          <Button variant="outline" onClick={generatePDF} className="w-full sm:w-auto">
            Descargar Recibo
          </Button>
        </div>
      </Card>
    </div>
  );
}
