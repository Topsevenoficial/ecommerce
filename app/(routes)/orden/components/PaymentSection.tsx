"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CulqiCheckout from "@/components/CulqiCheckout";
import { OrderItem } from "@/types/order";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";

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

interface PaymentSectionProps {
  order: string;
  customerData: CustomerData;
  shippingMethod: "shalom" | "olva";
  orderItems: OrderItem[];
  subtotal: number;      // en moneda (por ejemplo, 100.00)
  shippingCost: number;  // en moneda (por ejemplo, 20.00)
  total: number;         // en moneda (subtotal + shippingCost)
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  order,
  customerData,
  shippingMethod,
  orderItems,
  subtotal,
  shippingCost,
  total,
}) => {
  return (
    <Card className="bg-card rounded-lg shadow-sm border p-6 mt-6">
      {/* Alerta de seguridad */}
      <Alert className="mb-4">
        <Shield className="w-4 h-4 mr-2" />
        <AlertDescription className="text-sm">
          Compra 100% segura con Culqi. Tus datos están protegidos mediante encriptación y sistemas antifraude.
        </AlertDescription>
      </Alert>
      
      <Separator className="my-4" />

      <CulqiCheckout
        order={order}
        customerData={customerData}
        shippingMethod={shippingMethod}
        orderItems={orderItems}
        subtotal={subtotal}
        shippingCost={shippingCost}
        total={total}
      />
    </Card>
  );
};

export default PaymentSection;
