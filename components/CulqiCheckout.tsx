"use client";

import { useEffect, useState, useCallback } from "react";
import { PaymentPayload, PaymentResponse } from "@/types/payment";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { OrderItem } from "@/types/order";

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

export interface OrderItemLocal {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
}

// Usamos el type OrderData de "@/types/order" para la conversión
import { OrderData } from "@/types/order";

interface Props {
  order: string; // Asegúrate de pasar un Order ID válido
  customerData: CustomerData;
  shippingMethod: "shalom" | "olva";
  orderItems: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

const CulqiCheckout: React.FC<Props> = ({
  order,
  customerData,
  shippingMethod,
  orderItems,
  subtotal,
  shippingCost,
  total,
}) => {
  const { totalAmount, removeAll } = useCart();
  const baseTotal = totalAmount();
  const finalTotal = baseTotal + (shippingMethod === "olva" ? 20 : 0);
  const totalCentavos = Math.round(finalTotal * 100);
  const { toast } = useToast();

  const [isCulqiReady, setIsCulqiReady] = useState(false);
  const [checkoutOpened, setCheckoutOpened] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  // Función para enviar el token al backend
  const sendTokenToBackend = useCallback(
    async (token: string) => {
      try {
        const payload: PaymentPayload = {
          token,
          amount: totalCentavos,
          email: customerData.email,
          first_name: customerData.first_name,
          last_name: customerData.last_name,
          address: customerData.address,
          address_city: customerData.address_city,
          country_code: customerData.country_code,
          phone_number: customerData.phone_number,
          dni: Number(customerData.dni),
          metodo_envio: shippingMethod,
          order_items: orderItems,
          subtotal: subtotal,
          shipping_cost: shippingCost,
          total: total,
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/process-payment`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          console.error("❌ Error HTTP:", response.status);
          toast({
            variant: "destructive",
            title: "Error al procesar el pago",
            description: `Hubo un error al procesar el pago: ${response.status}`,
          });
          return;
        }

        const data: PaymentResponse = await response.json();
        console.log("✅ Respuesta del backend:", data);

        const { payment, orden } = data.data;

        // Mapeamos la respuesta al type OrderData
        const orderDataConverted: OrderData = {
          id: orden.id,
          customer_first_name: payment.first_name,
          customer_last_name: payment.last_name,
          email: payment.email,
          phone_number: payment.phone_number,
          dni: payment.dni,
          address: payment.address,
          address_city: payment.address_city,
          country_code: payment.country_code,
          metodo_envio: orden.metodo_envio,
          order_items: orden.order_items,
          subtotal: orden.subtotal / 100,
          shipping_cost: orden.shipping_cost / 100,
          total: orden.total / 100,
          order_status: orden.order_status || "pendiente",
          createdAt: orden.createdAt,
          updatedAt: orden.updatedAt,
          publishedAt: orden.publishedAt,
        };

        sessionStorage.setItem("orderData", JSON.stringify(orderDataConverted));
        toast({
          variant: "default",
          title: "Pago procesado correctamente",
          description: "Su pago ha sido procesado correctamente.",
        });
        removeAll();
        window.location.href = "/confirmacion";
      } catch (error) {
        console.error("❌ Error al enviar el token al backend:", error);
        toast({
          variant: "destructive",
          title: "Error al procesar el pago",
          description: "Hubo un error al procesar el pago.",
        });
      }
    },
    [
      totalCentavos,
      customerData,
      shippingMethod,
      orderItems,
      subtotal,
      shippingCost,
      total,
      toast,
      removeAll,
    ]
  );

  const openCheckout = useCallback(() => {
    if (typeof window !== "undefined" && window.Culqi) {
      window.Culqi.settings({
        title: "TopSeven Tienda Online",
        currency: "PEN",
        amount: totalCentavos,
        order: order, // Se envía el Order ID válido
        ...(process.env.NEXT_PUBLIC_ENVIRONMENT === "production" && {
          xculqirsaid: process.env.NEXT_PUBLIC_CULQI_XCULQIRSAID,
          rsapublickey: process.env.NEXT_PUBLIC_CULQI_RSA_PUBLIC_KEY,
        }),
      });

      window.Culqi.options({
        lang: "es",
        installments: false,
        paymentMethods: {
          tarjeta: true,
          yape: true,
          bancaMovil: true,
          agente: true,
          billetera: true,
          cuotealo: true,
        },
        style: {
          logo: "/images/mini-logo.png",
          bannerColor: "#000000",
          buttonBackground: "#007bff",
          menuColor: "#000000",
          linksColor: "#007bff",
          buttonText: "Pagar ahora",
          buttonTextColor: "#ffffff",
          priceColor: "#ff5733",
        },
      });

      window.culqi = async function () {
        if (window.Culqi.token) {
          const tokenId = window.Culqi.token.id;
          console.log("✅ Token creado:", tokenId);
          await sendTokenToBackend(tokenId);
        } else if (window.Culqi.order) {
          console.log("✅ Order creado:", window.Culqi.order);
        } else {
          console.error("❌ Error en Culqi:", window.Culqi.error);
          toast({
            variant: "destructive",
            title: "Error en Culqi",
            description: window.Culqi.error.user_message,
          });
        }
      };

      window.Culqi.open();
      setCheckoutOpened(true);
      setHasOpenedOnce(true);
    }
  }, [totalCentavos, order, toast, sendTokenToBackend]);

  useEffect(() => {
    const checkCulqiLoaded = setInterval(() => {
      if (typeof window !== "undefined" && window.Culqi) {
        clearInterval(checkCulqiLoaded);
        setIsCulqiReady(true);
        console.log("✅ Culqi inicializado correctamente");

        window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY || "";

        window.Culqi.settings({
          title: "TopSeven Tienda Online",
          currency: "PEN",
          amount: totalCentavos,
          order: order, // Se envía el Order ID válido
          ...(process.env.NEXT_PUBLIC_ENVIRONMENT === "production" && {
            xculqirsaid: process.env.NEXT_PUBLIC_CULQI_XCULQIRSAID,
            rsapublickey: process.env.NEXT_PUBLIC_CULQI_RSA_PUBLIC_KEY,
          }),
        });

        window.Culqi.options({
          lang: "es",
          installments: false,
          paymentMethods: {
            tarjeta: true,
            yape: true,
            bancaMovil: true,
            agente: true,
            billetera: true,
            cuotealo: true,
          },
          style: {
            logo: "https://res.cloudinary.com/duadc1ckw/image/upload/v1739650688/Icono_512_x_512_copia_3fd0741d95.png",
            bannerColor: "#000000",
            buttonBackground: "#007bff",
            menuColor: "#000000",
            linksColor: "#007bff",
            buttonText: "Pagar ahora",
            buttonTextColor: "#ffffff",
            priceColor: "#ff5733",
          },
        });

        if (window.Culqi) {
          window.Culqi.onclose = () => {
            console.log("❌ Culqi checkout cerrado");
            setCheckoutOpened(false);
            setHasOpenedOnce(false);
          };
        }

        if (!hasOpenedOnce) {
          openCheckout();
        }
      }
    }, 500);

    return () => clearInterval(checkCulqiLoaded);
  }, [totalCentavos, order, toast, hasOpenedOnce, openCheckout]);

  return (
    <>
      {isCulqiReady && !checkoutOpened && (
        <button className="btn btn-primary" onClick={() => openCheckout()}>
          Proceder al pago
        </button>
      )}
    </>
  );
};

export default CulqiCheckout;
