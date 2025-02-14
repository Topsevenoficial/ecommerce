/**
 * Representa un ítem dentro de la orden.
 */
export interface OrderItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
}

/**
 * Representa la estructura de una orden en Strapi.
 */
export interface OrderData {
  id: number;
  customer_first_name: string;
  customer_last_name: string;
  email: string;
  phone_number: string;
  dni: number;
  address: string;
  address_city: string;
  country_code: string;
  metodo_envio: "shalom" | "olva";
  order_items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  total: number;
  order_status: "pendiente" | "envío en preparación" | "enviado" | "completado" | "cancelado";
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}
