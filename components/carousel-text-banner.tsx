"use client";

import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import { Truck, Tag, RefreshCw, Gift } from "lucide-react";

// Declaramos el tipo de claves permitidas para el mapa de iconos
type IconKey =
  | "Envíos cada día"
  | "Consigue hasta un -25% en compras superiores a 40€"
  | "Devoluciones y entregas gratuitas"
  | "Comprar novedades";

// Definimos iconMap usando un Record para tipar sus claves
const iconMap: Record<IconKey, React.ComponentType> = {
  "Envíos cada día": Truck,
  "Consigue hasta un -25% en compras superiores a 40€": Tag,
  "Devoluciones y entregas gratuitas": RefreshCw,
  "Comprar novedades": Gift,
};

// Datos del carrusel actualizados para tu marca
export const dataCarouselTop = [
  {
    id: 1,
    title: "Envíos cada día",
    description: "Despachos en menos de 24h",
    link: "#",
    icon: "Envíos cada día",
  },
  {
    id: 2,
    title: "Descuentos cada semana",
    description: "Encuentra las mejores promociones",
    link: "#",
    icon: "Consigue hasta un -25% en compras superiores a 40€",
  },
  {
    id: 3,
    title: "Devoluciones Gratis",
    description: "30 días para cambiar o devolver tu KingSeven",
    link: "#",
    icon: "Devoluciones y entregas gratuitas",
  },
  {
    id: 4,
    title: "Nuevas Colecciones",
    description: "Ediciones limitadas con garantía oficial",
    link: "#",
    icon: "Comprar novedades",
  },
];

const CarouselTextBanner = () => {
  const router = useRouter();

  return (
    <div className="w-full border-b border-border bg-gradient-to-r from-secondary to-primary/20">
      <div className="container mx-auto px-6 py-3">
        <Carousel
          className="w-full"
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: false,
            }),
          ]}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {dataCarouselTop.map(({ id, title, link, description, icon }) => {
              // Usamos el tipo definido para iconMap
              const IconComponent = iconMap[icon as IconKey];
              return (
                <CarouselItem
                  key={id}
                  className="cursor-pointer"
                  onClick={() => router.push(link)}
                >
                  <Card className="shadow-none border-none bg-transparent hover:bg-background/10 transition-all duration-300 rounded-lg">
                    <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-3 p-3">
                      {IconComponent && (
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                          <IconComponent className="h-5 w-5" />
                        </div>
                      )}
                      <div className="text-center sm:text-left">
                        <p className="text-sm sm:text-base font-semibold text-primary">
                          {title}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default CarouselTextBanner;
