// app/(routes)/terminos-condiciones/page.tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function TerminosPage() {
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
              href="/terminos-condiciones"
              className="text-sm font-medium text-primary"
            >
              Términos y Condiciones
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-4">Términos y Condiciones</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          1. Aceptación de los Términos
        </h2>
        <p>
          Al acceder y utilizar este sitio web, aceptas estar sujeto a estos
          términos y condiciones. Si no estás de acuerdo con alguno de ellos, te
          recomendamos que no utilices este sitio.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Uso del Sitio</h2>
        <p>
          Este sitio web es administrado por TopSeven Oficial y se utiliza para
          la venta de gafas de sol en el territorio peruano. Nos reservamos el
          derecho de modificar o actualizar estos términos en cualquier momento.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          3. Obligaciones del Cliente
        </h2>
        <p>
          El cliente se compromete a proporcionar información veraz y
          actualizada al momento de realizar una compra, y a mantener la
          confidencialidad de sus datos de acceso.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Condiciones de Venta</h2>
        <p>
          Todos los productos ofrecidos son de la marca KingSeven y cuentan con
          la garantía y políticas establecidas en nuestro sitio. Las
          devoluciones y cambios se regirán según lo estipulado en la Política
          de Devoluciones.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          5. Limitación de Responsabilidad
        </h2>
        <p>
          TopSeven Oficial no será responsable por daños o perjuicios derivados
          del uso incorrecto de nuestros productos o del sitio web, limitándose
          la responsabilidad al valor de la compra realizada.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Legislación Aplicable</h2>
        <p>
          Estos términos se regirán por las leyes vigentes en el Perú. Cualquier
          disputa se resolverá en los tribunales correspondientes de nuestra
          jurisdicción.
        </p>
      </section>
    </main>
  );
}
