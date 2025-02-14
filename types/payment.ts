import { OrderItem } from "./order";

/**
 * Representa el body que envías en el POST a /api/process-payment
 */
export interface PaymentPayload {
  token: string;
  amount: number;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  address_city: string;
  country_code: string;
  phone_number: string;
  dni: number; // nuevo campo agregado
  metodo_envio: "shalom" | "olva"; // NUEVO campo agregado
  order_items: OrderItem[]; // NUEVO: detalles de la orden
  subtotal: number;         // NUEVO: subtotal de la orden en moneda
  shipping_cost: number;    // NUEVO: costo de envío en moneda
  total: number;            // NUEVO: total de la orden en moneda
}

/**
 * Datos que conforman un registro de Payment en Strapi
 */
export interface PaymentData {
  id: number;
  token: string;
  email: string;
  amount: number;
  payment_status: string | null;
  culqi_response: any;
  customer_id: string | null;
  customer_data: any;
  first_name: string;
  last_name: string;
  address: string;
  address_city: string;
  country_code: string;
  phone_number: string;
  dni: number;
  metodo_envio: "shalom" | "olva";
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

/**
 * Estructura final de la respuesta que envía Strapi cuando el pago se crea.
 */
export interface PaymentResponse {
  message: string;
  data: {
    payment: PaymentData;
    // Puedes definir un tipo para la orden si lo deseas, o dejarlo como any
    orden: any;
  };
}
