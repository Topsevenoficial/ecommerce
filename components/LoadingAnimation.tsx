"use client";

import React from "react";
import { FaGlasses } from "react-icons/fa";

export default function LoadingAnimation() {
  return (
    <>
      {/* Definición de keyframes para una animación de gradiente sutil */}
      <style jsx>{`
        @keyframes subtleGradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
      <div className="flex flex-col justify-center items-center h-screen w-screen relative overflow-hidden bg-background">
        {/* Fondo animado con un degradado sutil */}
        <div className="absolute inset-0 -z-10">
          <AnimatedSubtleGradientBackground />
        </div>
        {/* Ícono minimalista con animación de giro (más lenta para un efecto elegante) */}
        <div className="mb-4">
          <FaGlasses
            className="w-16 h-16 text-primary"
            style={{ animation: "spin 3s linear infinite" }}
          />
        </div>
        {/* Texto con animación sutil de pulso */}
        <h2 className="text-2xl font-medium text-foreground animate-pulse">
          Cargando...
        </h2>
      </div>
    </>
  );
}

function AnimatedSubtleGradientBackground() {
  return (
    <div
      className="w-full h-full"
      style={{
        background: "linear-gradient(270deg, hsl(var(--background)), hsl(var(--secondary)))",
        backgroundSize: "400% 400%",
        animation: "subtleGradient 8s ease infinite",
      }}
    />
  );
}
