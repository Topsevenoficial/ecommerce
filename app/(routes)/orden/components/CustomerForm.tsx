"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import AgenciasCombobox from "@/components/AgenciasCombobox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Store, Truck } from "lucide-react";

interface CustomerData {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  address_city: string;
  country_code: string;
  phone_number: string;
  dni: string;
}

export interface Agency {
  id: string;
  name: string;
  ubicacion: string;
  direction: string;
}

interface CustomerFormProps {
  customerData: CustomerData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDNIChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  agencies: Agency[];
  isLoading: boolean;
  selectedAgency: Agency | null;
  onSelectAgency: (agency: Agency) => void;
  shippingMethod: "shalom" | "olva";
  setShippingMethod: (value: "shalom" | "olva") => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customerData,
  handleChange,
  handleDNIChange,
  error,
  agencies,
  isLoading,
  selectedAgency,
  onSelectAgency,
  shippingMethod,
  setShippingMethod,
}) => {
  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  return (
    <div className="space-y-4">
      {/* Mensaje de error general */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Información de contacto */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="first_name"
            >
              Nombre
            </label>
            <Input
              id="first_name"
              type="text"
              name="first_name"
              value={customerData.first_name}
              onChange={handleChange}
              placeholder="Juan"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="last_name"
            >
              Apellido
            </label>
            <Input
              id="last_name"
              type="text"
              name="last_name"
              value={customerData.last_name}
              onChange={handleChange}
              placeholder="Pérez"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Correo
          </label>
          <Input
            id="email"
            type="email"
            name="email"
            value={customerData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="phone_number"
          >
            Teléfono
          </label>
          <Input
            id="phone_number"
            type="tel"
            name="phone_number"
            value={customerData.phone_number}
            onChange={handleChange}
            placeholder="987654321"
            required
          />
        </div>
      </div>

      <Separator />

      {/* Módulo de Envío */}
      <div className="p-4 border rounded-md bg-secondary/20 dark:bg-secondary/30">
        <h3 className="text-lg font-semibold mb-4">Método de Envío</h3>

        {/* Opciones de envío */}
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => setShippingMethod("shalom")}
            className={`flex items-center gap-1 px-3 py-2 border rounded-md transition-colors ${
              shippingMethod === "shalom"
                ? "bg-primary text-primary-foreground"
                : "bg-white text-foreground dark:bg-gray-800 dark:text-white"
            }`}
          >
            <Store className="w-4 h-4" />
            Agencia (Shalom)
            <span className="text-xs ml-1">(Gratis)</span>
          </button>
          <button
            type="button"
            onClick={() => setShippingMethod("olva")}
            className={`flex items-center gap-1 px-3 py-2 border rounded-md transition-colors ${
              shippingMethod === "olva"
                ? "bg-primary text-primary-foreground"
                : "bg-white text-foreground dark:bg-gray-800 dark:text-white"
            }`}
          >
            <Truck className="w-4 h-4" />
            Domicilio (Olva)
            <span className="text-xs ml-1">(S/20)</span>
          </button>
        </div>

        {/* Formulario según método de envío */}
        {shippingMethod === "shalom" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Columna 1: Combobox */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Busca tu agencia
                </label>
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">
                    Cargando agencias...
                  </p>
                ) : (
                  <AgenciasCombobox
                    agencies={agencies}
                    selectedAgency={selectedAgency}
                    onSelect={onSelectAgency}
                  />
                )}
              </div>
            </div>

            {/* Columna 2: Ciudad y DNI */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ciudad
                </label>
                <Input
                  type="text"
                  name="address_city"
                  value={customerData.address_city}
                  onChange={handleChange}
                  placeholder="Selecciona la agencia"
                  required
                  readOnly
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Se autocompleta al elegir agencia.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">DNI</label>
                <div className="flex items-center gap-1">
                  <Input
                    type="text"
                    name="dni"
                    value={customerData.dni}
                    onChange={handleDNIChange}
                    placeholder="12345678"
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
  <TooltipTrigger asChild>
    <span
      className="cursor-pointer"
      onClick={() => setTooltipOpen((prev) => !prev)}
    >
      <Info className="w-4 h-4 text-muted-foreground" />
    </span>
  </TooltipTrigger>
  <TooltipContent className="p-2">
    <p className="text-xs">
      Para registrar el envío y generar la boleta.
    </p>
  </TooltipContent>
</Tooltip>

                </div>
              </div>
            </div>
          </div>
        ) : (
          // Método de envío: Domicilio (Olva)
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Dirección
              </label>
              <Input
                type="text"
                name="address"
                value={customerData.address}
                onChange={handleChange}
                placeholder="Av. Principal N° 123"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Ciudad
              </label>
              <Input
                type="text"
                name="address_city"
                value={customerData.address_city}
                onChange={handleChange}
                placeholder="Cusco"
                required
              />
            </div>

            <div className="md:col-span-2 mt-4">
              <label className="block text-sm font-medium mb-1">DNI</label>
              <div className="flex items-center gap-1">
                <Input
                  type="text"
                  name="dni"
                  value={customerData.dni}
                  onChange={handleDNIChange}
                  placeholder="12345678"
                  required
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
               <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
  <TooltipTrigger asChild>
    <span
      className="cursor-pointer"
      onClick={() => setTooltipOpen((prev) => !prev)}
    >
      <Info className="w-4 h-4 text-muted-foreground" />
    </span>
  </TooltipTrigger>
  <TooltipContent className="p-2">
    <p className="text-xs">
      Para registrar el envío y generar la boleta.
    </p>
  </TooltipContent>
</Tooltip>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerForm;
