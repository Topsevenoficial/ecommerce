"use client";

import { useEffect } from "react";

const CulqiScript = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Culqi) {
      const script = document.createElement("script");
      script.src = "https://checkout.culqi.com/js/v4";
      script.async = true;
      script.onload = () => {
        console.log("✅ Script de Culqi cargado correctamente");
      };
      script.onerror = () => {
        console.error("❌ Error cargando el script de Culqi");
      };
      document.body.appendChild(script);
    }
  }, []);

  return null; // No necesita renderizar nada
};

export default CulqiScript;
