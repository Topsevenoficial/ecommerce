// app/(routes)/preguntas-frecuentes/page.tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function FAQPage() {
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
              href="/preguntas-frecuentes"
              className="text-sm font-medium text-primary"
            >
              Preguntas Frecuentes
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-4">Preguntas Frecuentes</h1>
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            ¿Cuáles son los métodos de pago disponibles?
          </AccordionTrigger>
          <AccordionContent>
            Aceptamos pagos con tarjeta de crédito, débito, transferencias
            bancarias e incluso pago contra entrega en la ciudad de Cusco.
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
            Si detectas un defecto de fabricación, contáctanos de inmediato vía
            WhatsApp o llamada, teniendo a la mano tu boleta de compra para
            iniciar el proceso de garantía.
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
            Solo recopilamos la información necesaria (correo, datos generales y
            DNI) para gestionar tus pedidos y envíos. Tus datos se mantienen
            seguros y se usan exclusivamente para estos fines.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}
