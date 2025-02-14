// app/(routes)/libro-reclamaciones/page.tsx
"use client";

import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function LibroReclamacionesPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    orden: "",
    reclamacion: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes integrar el envío de la reclamación a tu backend o API
    console.log("Reclamación enviada", formData);
    setFormData({ nombre: "", email: "", orden: "", reclamacion: "" });
  };

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
              href="/libro-reclamaciones"
              className="text-sm font-medium text-primary"
            >
              Libro de Reclamaciones
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-4">Libro de Reclamaciones</h1>
      <p className="mb-4">
        Si tienes alguna reclamación, por favor completa el siguiente
        formulario. Nuestro equipo se pondrá en contacto contigo a la brevedad
        para resolver tu inconveniente.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block mb-1 font-medium">
            Nombre Completo
          </label>
          <Input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Tu nombre"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Correo Electrónico
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tuemail@ejemplo.com"
            required
          />
        </div>
        <div>
          <label htmlFor="orden" className="block mb-1 font-medium">
            Número de Orden (si aplica)
          </label>
          <Input
            id="orden"
            name="orden"
            value={formData.orden}
            onChange={handleChange}
            placeholder="Ej: 123456"
          />
        </div>
        <div>
          <label htmlFor="reclamacion" className="block mb-1 font-medium">
            Detalle de la Reclamación
          </label>
          <Textarea
            id="reclamacion"
            name="reclamacion"
            value={formData.reclamacion}
            onChange={handleChange}
            placeholder="Describe tu reclamación"
            required
          />
        </div>
        <Button type="submit">Enviar Reclamación</Button>
      </form>
    </main>
  );
}
