// app/(routes)/politica-privacidad/page.tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function PoliticaPrivacidadPage() {
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
              href="/politica-privacidad"
              className="text-sm font-medium text-primary"
            >
              Política de Privacidad
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-4">Política de Privacidad</h1>
      <p className="mb-4">
        En TopSeven Oficial, nos comprometemos a proteger tu privacidad.
        Recopilamos únicamente la información necesaria para procesar tus
        pedidos, como tu correo electrónico, datos generales y número de DNI
        para los envíos.
      </p>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Uso de la Información</h2>
        <p>
          Los datos recopilados se utilizan exclusivamente para gestionar tus
          compras y envíos, y para mejorar tu experiencia en nuestro sitio. No
          compartimos tu información con terceros sin tu consentimiento, salvo
          para fines logísticos.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Protección de Datos</h2>
        <p>
          Implementamos medidas de seguridad adecuadas para proteger tus datos
          personales, almacenándolos en una base de datos segura y de acceso
          restringido.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Cookies y Tecnologías Similares
        </h2>
        <p>
          Utilizamos cookies y tecnologías similares para mejorar la experiencia
          de navegación, personalizar contenidos y analizar el tráfico web.
          Puedes ajustar la configuración de cookies desde tu navegador.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Cambios en la Política de Privacidad
        </h2>
        <p>
          Nos reservamos el derecho de actualizar esta política en cualquier
          momento. Las modificaciones serán publicadas en este mismo sitio.
        </p>
      </section>
    </main>
  );
}
