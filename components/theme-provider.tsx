"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      themes={["light", "dark"]} // Solo permitir estos temas
      defaultTheme="system"
      enableSystem={false} // Deshabilitar detección de sistema
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
