// components/PageTransitionWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingAnimation from "./LoadingAnimation";

interface Props {
  children: React.ReactNode;
}

export default function PageTransitionWrapper({ children }: Props) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Cuando cambia la ruta, activa el loader
    setIsLoading(true);

    /**
     * Aquí podrías:
     * - Esperar a que se resuelvan datos (si tienes un API global de carga)
     * - O simplemente mantener el loader durante un tiempo fijo
     *
     * En este ejemplo usamos un timeout fijo de 500ms.
     */
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Loader en overlay con animación */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50" // Asegura que se superponga al contenido
          >
            <LoadingAnimation />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Contenido de la página con transición suave */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </>
  );
}
