// app/(routes)/certificado-ssl/page.tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function CertificadoSSLPage() {
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
              href="/certificado-ssl"
              className="text-sm font-medium text-primary"
            >
              Certificado SSL
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-4">Certificado SSL</h1>
      <p className="mb-4">
        En TopSeven Oficial, tu seguridad es nuestra prioridad. Utilizamos un certificado SSL
        (Secure Sockets Layer) para proteger todas tus transacciones y datos personales.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">¿Qué es SSL?</h2>
        <p>
          SSL es un protocolo de seguridad estándar que establece un enlace cifrado entre
          nuestro servidor web y tu navegador. Esto garantiza que todos los datos que se
          transmiten entre ambos permanezcan privados y seguros.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">¿Cómo te protege?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Cifra la información sensible durante las transacciones</li>
          <li>Protege datos personales como información de pago y direcciones</li>
          <li>Verifica la autenticidad de nuestro sitio web</li>
          <li>Previene la interceptación de datos por terceros</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Cómo verificar nuestro SSL</h2>
        <p>
          Puedes verificar que estás en una conexión segura de las siguientes formas:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Busca el candado cerrado en la barra de direcciones de tu navegador</li>
          <li>La URL de nuestro sitio comienza con &quot;https://&quot;</li>
          <li>Puedes hacer clic en el candado para ver los detalles del certificado</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Nuestro Compromiso</h2>
        <p>
          Mantenemos nuestro certificado SSL actualizado y utilizamos los más altos
          estándares de seguridad para garantizar que tu experiencia de compra sea
          completamente segura y confiable.
        </p>
      </section>
    </main>
  );
}
