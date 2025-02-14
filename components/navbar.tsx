"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MenuList } from "./menu-list";
import { CartSheet } from "./CartSheet"; // ✅ Solo el carrito
import ToogleTheme from "./toogle-theme";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "shadow-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            : "bg-background/95"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo - Tu marca: TopSeven Oficial */}
          <Link href="/" className="whitespace-nowrap">
            <h1 className="text-xl font-bold cursor-pointer">
              <span className="text-primary">TopSeven</span> Oficial
            </h1>
          </Link>

          {/* Menú unificado responsive */}
          <MenuList />

          {/* Controles de usuario */}
          <div className="flex items-center space-x-2">
            <CartSheet />
            <ToogleTheme />
          </div>
        </div>
      </header>
      {/* Espaciador para que el contenido no quede oculto debajo del navbar */}
      <div className="h-16"></div>
    </>
  );
}
