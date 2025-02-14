// app/(routes)/whatsapp/page.tsx
"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

export default function WhatsAppPage() {
  const phone = "51984670999";
  const message = encodeURIComponent("Hola necesito contactarme con alguien");
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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
              href="/whatsapp"
              className="text-sm font-medium text-primary"
            >
              WhatsApp
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-4">Contáctanos por WhatsApp</h1>
      <p className="mb-4">
        Estamos disponibles 24/7 para atender tus consultas. Haz clic en el
        botón de abajo para enviarnos un mensaje directo por WhatsApp.
      </p>

      <div>
        <Button asChild>
          <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            Abrir WhatsApp
          </Link>
        </Button>
      </div>
    </main>
  );
}
