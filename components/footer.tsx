"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="mt-4 border-t bg-muted/50">
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-bold">TopSeven Oficial</h3>
            <p className="text-sm text-muted-foreground">
              &quot;Calidad garantizada a un precio justo&quot;
              <br />
              Distribuidores autorizados KingSeven
              <br />
              Lentes polarizados UV400
              <br />
              Registro SUNAT: 10736020110
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold">Servicio</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/garantia" className="hover:text-primary">
                  Garant&iacute;a 3 meses
                </Link>
              </li>
              <li>
                <Link href="/preguntas-frecuentes" className="hover:text-primary">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="hover:text-primary">
                  Pol&iacute;tica de Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/envios" className="hover:text-primary">
                  Seguimiento de Envíos
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terminos-condiciones" className="hover:text-primary">
                  T&eacute;rminos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidad" className="hover:text-primary">
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold">Contacto</h3>
            <div className="space-y-2 text-sm">
              <p>📞 +51 984 670 999</p>
              <p>📧 ventas@topsevenoficial.com</p>
              <p>📍 Av. Prolongaci&oacute;n Pera 650, Cusco</p>
              <Button variant="outline" size="sm" className="mt-2 w-full md:w-auto">
                <Link href="/whatsapp">Chat WhatsApp</Link>
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
          <div className="text-center md:text-left">
            &copy; 2025 TopSeven Oficial - Todos los derechos reservados
            <br />
            &quot;Protegiendo tu visi&oacute;n con calidad&quot;
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/terminos-condiciones" className="hover:text-primary">
              T&eacute;rminos
            </Link>
            <Link href="/politica-privacidad" className="hover:text-primary">
              Privacidad
            </Link>
          <Link href="/certificado-ssl" className="hover:text-primary">Certificado SSL</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
