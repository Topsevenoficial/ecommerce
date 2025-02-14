"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Star, ShoppingBag } from "lucide-react";
import { ProductType } from "@/types/product";
import { Badge } from "./ui/badge";
import { useCart } from "@/hooks/use-cart"; // Hook del carrito
import { useCartSheet } from "@/hooks/use-cart-sheet"; // Hook para controlar el Sheet
import { Button } from "@/components/ui/button";

interface IconLabelProps {
  icon: React.ReactElement;
  label: string;
}

const IconLabel: React.FC<IconLabelProps> = ({ icon, label }) => (
  <div className="flex items-center space-x-1 text-sm text-foreground/80">
    {icon}
    <span>{label}</span>
  </div>
);

interface ProductCardProps {
  product: ProductType;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { setOpen: openCartSheet } = useCartSheet();

  const [imageIndex, setImageIndex] = useState(0);
  const [hoveringMainImage, setHoveringMainImage] = useState(false);

  const {
    slug,
    productName,
    images = [],
    price,
    discount,
    offerType,
    isFeatured,
    active,
    category,
  } = product;

  const priceNumber = parseFloat(String(price));
  const discountNumber = discount ? parseFloat(String(discount)) : 0;
  const finalNumber = priceNumber - discountNumber;
  const finalPrice = finalNumber.toFixed(2);
  const originalPrice = priceNumber.toFixed(2);

  const handleMainImageMouseEnter = () => {
    setHoveringMainImage(true);
    if (!active) return;
    if (images.length < 2) return;
    setImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleMainImageMouseLeave = () => {
    setHoveringMainImage(false);
    setImageIndex(0);
  };

  const currentImageUrl = images?.[imageIndex]?.url
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${images[imageIndex].url}`
    : "/placeholder.png";

  // Opcional: Dividir el nombre para evitar duplicados en colores
  let baseName = productName;
  let leftover = "";
  if (productName.includes(" - ")) {
    const parts = productName.split(" - ");
    baseName = parts[0];
    leftover = parts.slice(1).join(" - ");
  }
  const displayedTitle = leftover ? `${baseName} - ${leftover}` : baseName;

  // Navegar a la página de detalles
  const handleViewDetails = () => {
    router.push(`/product/${slug}`);
  };

  // Agregar al carrito y abrir el CartSheet. Se detiene la propagación para no activar el click del contenedor.
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    openCartSheet(true);
  };

  return (
    <div className="p-1" onClick={handleViewDetails} role="button">
      <Card className="relative border rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 bg-background dark:bg-card border-border">
        {/* Etiqueta "Destacado" */}
        {isFeatured && (
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 z-20 shadow-md text-xs font-semibold px-2 py-1 flex items-center gap-1"
          >
            <Star size={14} className="text-yellow-400" />
            Destacado
          </Badge>
        )}

        {/* Overlay "AGOTADO" si el producto no está activo */}
        {!active && (
          <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center">
            <div className="text-white font-bold text-xl">AGOTADO</div>
          </div>
        )}

        {/* Imagen principal */}
        <div
          className="relative group"
          onMouseEnter={handleMainImageMouseEnter}
          onMouseLeave={handleMainImageMouseLeave}
        >
          <Image
            src={currentImageUrl}
            alt={`${productName} image`}
            width={500}
            height={500}
            priority
            className={`w-full h-auto object-cover transition-transform duration-300 ease-in-out ${
              hoveringMainImage && images.length > 1 ? "scale-105" : ""
            } ${!active ? "opacity-50" : ""}`}
          />

          {/* Botón para añadir al carrito */}
          {active && (
            <div
              className="
                absolute bottom-4 left-4
                transition duration-200 z-10
                /* Siempre visible en móvil (pantallas < md), solo aparece al hover en >= md */
                opacity-100
                md:opacity-0
                md:group-hover:opacity-100
              "
            >
              <Button
                onClick={handleAddToCart}
                variant="default"
                size="sm"
                aria-label="Añadir al carrito"
                className="font-semibold flex items-center gap-1"
              >
                <ShoppingCart size={18} />
                Añadir
              </Button>
            </div>
          )}

          {/* Etiqueta de oferta, si existe */}
          {offerType && offerType !== "nada" && (
            <Badge
              variant="destructive"
              className="absolute bottom-3 right-3 z-20 text-xs font-semibold px-2 py-1 rounded-md"
            >
              {offerType.charAt(0).toUpperCase() + offerType.slice(1)}
            </Badge>
          )}
        </div>

        {/* Información del producto */}
        <CardContent className="px-4 pb-3 flex flex-col gap-2">
          <h3 className="text-xl font-semibold text-foreground dark:text-foreground mt-2">
            {displayedTitle}
          </h3>
          {category && (
            <IconLabel
              icon={
                <ShoppingBag size={16} className="text-accent-foreground" />
              }
              label={category.categoryName}
            />
          )}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-foreground dark:text-foreground">
              S/{finalPrice}
            </span>
            {discountNumber > 0 && (
              <span className="text-sm text-red-600 dark:text-red-500 line-through">
                S/{originalPrice}
              </span>
            )}
          </div>
          {active && (
            <div className="relative flex items-center mt-1">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full animate-ping bg-gradient-to-r from-green-300 to-green-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <span className="ml-2 text-sm">En stock</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
