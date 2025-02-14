// app/(routes)/envios/page.tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

export default function EnviosPage() {
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
              href="/envios"
              className="text-sm font-medium text-primary"
            >
              Seguimiento de Envíos
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-4">Seguimiento de Envíos</h1>
      <p className="mb-4">
        Realizamos envíos a todo el Perú a través de Shalom. El tiempo de
        entrega es de 2 a 5 días hábiles, dependiendo de la distancia desde
        Cusco.
      </p>
      <Button>
        <a
          href="https://rastrea.shalom.pe/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Rastrear mi Envío
        </a>
      </Button>
    </main>
  );
}
