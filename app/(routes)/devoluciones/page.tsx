// app/(routes)/devoluciones/page.tsx
"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

export default function DevolucionesPage() {
  const handleWhatsApp = () => {
    // Abre WhatsApp con un mensaje predeterminado
    window.open(
      "https://api.whatsapp.com/send?phone=51984670999&text=Hola,%20tengo%20una%20solicitud%20de%20devolución",
      "_blank"
    );
  };

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb de navegación */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="text-sm font-medium hover:text-primary"
            >
              Inicio
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/devoluciones"
              className="text-sm font-medium text-primary"
            >
              Política de Devoluciones
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-4">Política de Devoluciones</h1>
      <p className="mb-4">
        Aceptamos devoluciones en un plazo de 3 meses desde la fecha de compra.
        Para que una devolución sea válida, el producto debe estar sin uso y en
        perfectas condiciones, conservando su empaque original y accesorios.
      </p>
      <p className="mb-8">
        Para iniciar el proceso de devolución, simplemente envíanos un mensaje
        de WhatsApp. Nos pondremos en contacto contigo lo antes posible.
      </p>

      <Button onClick={handleWhatsApp} className="w-full sm:w-auto">
        Solicitar devolución por WhatsApp
      </Button>
    </main>
  );
}
