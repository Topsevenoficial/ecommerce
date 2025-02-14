// app/(routes)/garantia/page.tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

export default function GarantiaPage() {
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
              href="/garantia"
              className="text-sm font-medium text-primary"
            >
              Garantía
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-4">Garantía 3 Meses</h1>
      <p className="mb-4">
        Todos nuestros productos cuentan con una garantía de 3
        meses contra defectos de fabricación. La garantía aplica siempre y
        cuando el producto no haya sido usado y se presente la boleta de compra
        correspondiente.
      </p>
      <p className="mb-4">
        Si tienes algún inconveniente, contáctanos vía WhatsApp o por llamada.
        ¡Estamos para ayudarte!
      </p>
      <Button>
        <a href="/whatsapp">Iniciar Chat de Soporte</a>
      </Button>
    </main>
  );
}
