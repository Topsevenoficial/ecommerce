import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronUp, ChevronDown } from "lucide-react"; // Flechas necesarias para escritorio
import { ProductType } from "@/types/product";
import Image from "next/image";

// Hook para detectar pantalla móvil
const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
};

interface CarouselVerticalProps {
  product: ProductType; // Se espera que siempre haya un producto
  currentIndex: number; // Índice actual sincronizado
  onChange: (index: number) => void; // Callback para sincronización
}

export function CarouselVertical({
  product,
  currentIndex,
  onChange,
}: CarouselVerticalProps) {
  const images =
    product?.images?.map((image) => {
      const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
      return `${baseUrl}${image.formats?.medium?.url || image.url}`;
    }) || [];

  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const isMobile = useIsMobile();

  // Actualizamos el índice al seleccionar en el carrusel
  React.useEffect(() => {
    if (!api) return;

    api.scrollTo(currentIndex); // Sincroniza con el índice recibido

    api.on("select", () => {
      const newIndex = api.selectedScrollSnap();
      onChange(newIndex); // Actualiza el índice en el padre
    });
  }, [api, currentIndex, onChange]);

  if (images.length === 0) {
    return (
      <div className="text-center">
        <p>No se encontraron imágenes del producto.</p>
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      orientation={isMobile ? "horizontal" : "vertical"}
      setApi={setApi}
      className={`${isMobile ? "w-full max-w-full" : "w-[120px] max-w-[120px]"}`}
    >
      {/* Flecha Superior (visible solo en escritorio) */}
      {!isMobile && (
        <div
          className="flex justify-center items-center cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() => api?.scrollTo(currentIndex - 1)}
        >
          <ChevronUp className="w-6 h-6" />
        </div>
      )}

      <CarouselContent
        className={`flex ${isMobile ? "flex-row" : "flex-col"} ${
          isMobile ? "h-[140px]" : "h-[480px]"
        }`}
        style={{
          overflow: "visible", // El contenedor no debe ocultar contenido
        }}
      >
        {images.map((imageUrl, index) => (
          <CarouselItem
            key={index}
            className={`flex-shrink-0 ${isMobile ? "w-[25%]" : "h-[25%]"} px-2`}
            style={{
              flex: "0 0 calc(100% / 4)",
              maxHeight: isMobile ? "120px" : "120px",
              marginBottom: "4px",
            }}
            onClick={() => {
              onChange(index);
              api?.scrollTo(index);
            }}
          >
            <div
              className={`relative w-full aspect-square rounded-md overflow-hidden border ${
                currentIndex === index ? "ring-2 ring-primary" : ""
              }`}
              style={{
                margin: "4px",
              }}
            >
              <Image
                src={imageUrl}
                alt={`Imagen ${index + 1}`}
                fill
                className="object-cover w-full h-full cursor-pointer"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Flecha Inferior (visible solo en escritorio) */}
      {!isMobile && (
        <div
          className="flex justify-center items-center cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() => api?.scrollTo(currentIndex + 1)}
        >
          <ChevronDown className="w-6 h-6" />
        </div>
      )}
    </Carousel>
  );
}
