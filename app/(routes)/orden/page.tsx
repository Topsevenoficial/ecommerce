"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useAgencies, Agency } from "@/hooks/use-agencies";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TooltipProvider } from "@/components/ui/tooltip";
import CustomerForm from "./components/CustomerForm";
import PaymentSection from "./components/PaymentSection";
import OrderSummary from "./components/OrderSummary";

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

export default function OrdenPage() {
  const { toast } = useToast();
  const { totalAmount, items, removeItem } = useCart();
  const total = totalAmount();
  const orderId = "ord_live_0CjjdWhFpEAZlxlz";

  const [customerData, setCustomerData] = useState<CustomerData>({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    address_city: "",
    country_code: "PE",
    phone_number: "",
    dni: "",
  });

  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [error, setError] = useState("");
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<"shalom" | "olva">("shalom");

  const { agencies, isLoading } = useAgencies();

  useEffect(() => {
    if (shippingMethod === "olva") {
      setSelectedAgency(null);
      setCustomerData((prev) => ({
        ...prev,
        address: "",
        address_city: "",
      }));
    }
  }, [shippingMethod]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleDNIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, "");
    setCustomerData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
    setError("");
  };

  const handleAgencySelect = (agency: Agency) => {
    setSelectedAgency(agency);
    setCustomerData((prev) => ({
      ...prev,
      address: agency.ubicacion,
      address_city: agency.name,
    }));
  };

  const handlePay = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validar que todos los campos (excepto country_code) estén completos
    const isComplete = Object.entries(customerData).every(([key, val]) => {
      if (key === "country_code") return true;
      return val.trim() !== "";
    });
    if (!isComplete) {
      setError("Por favor, completa todos los campos.");
      setIsFormComplete(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(customerData.email)) {
      setError("Por favor, ingresa un correo electrónico válido. Ejemplo: usuario@dominio.com");
      setIsFormComplete(false);
      return;
    }
    setIsFormComplete(true);
    toast({
      title: "Datos guardados",
      description: "Procediendo al pago...",
    });
  };

  return (
    <TooltipProvider>
      <main className="w-full bg-background min-h-screen text-foreground">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-sm font-medium hover:text-primary">
                  Inicio
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/orden" className="text-sm font-medium text-primary">
                  Pedido
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-3xl font-bold mb-6 text-center">Finaliza tu Pedido</h1>

          {/* Form principal */}
          <form onSubmit={handlePay} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sección izquierda: formularios y pago */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    1. Información de Contacto y Envío
                  </h2>
                  <CustomerForm
                    customerData={customerData}
                    handleChange={handleChange}
                    handleDNIChange={handleDNIChange}
                    error={error}
                    agencies={agencies}
                    isLoading={isLoading}
                    selectedAgency={selectedAgency}
                    onSelectAgency={handleAgencySelect}
                    shippingMethod={shippingMethod}
                    setShippingMethod={setShippingMethod}
                  />
                </div>

                {/* Sección de pago: aparece cuando isFormComplete es true */}
                {isFormComplete && (
                  <PaymentSection
                    order={orderId}
                    customerData={customerData}
                    shippingMethod={shippingMethod}
                    orderItems={items.map((item) => ({
                      id: item.id.toString(), // Convertir id a string
                      name: item.productName,
                      price: item.discount ? item.price - item.discount : item.price,
                      quantity: 1,
                    }))}
                    subtotal={total}
                    shippingCost={shippingMethod === "olva" ? 20 : 0}
                    total={total + (shippingMethod === "olva" ? 20 : 0)}
                  />
                )}
              </div>

              {/* Sección derecha: resumen del pedido */}
              <div className="lg:sticky lg:top-8">
                <OrderSummary
                  items={items.map((item) => ({ ...item, id: item.id.toString() }))}
                  total={total}
                  removeItem={(id: string) => removeItem(Number(id))}  // Convertir id string a number
                  selectedAgency={selectedAgency}
                  shippingMethod={shippingMethod}
                  customerData={customerData}
                />
              </div>
            </div>
          </form>
        </div>
      </main>
    </TooltipProvider>
  );
}
