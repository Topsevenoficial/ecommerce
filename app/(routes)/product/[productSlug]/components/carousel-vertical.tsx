import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { ChevronUp, ChevronDown } from "lucide-react";
import { ProductType } from "@/types/product";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/media";

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
  product: ProductType;
  currentIndex: number;
  onChange: (index: number) => void;
}

export function CarouselVertical({
  product,
  currentIndex,
  onChange,
}: CarouselVerticalProps) {
  const images =
    product?.images?.map((image) => {
      const url = image.formats?.medium?.url || image.url;
      return getStrapiMedia(url);
    }) || [];

  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (!api) return;
    api.scrollTo(currentIndex);
    api.on("select", () => {
      const newIndex = api.selectedScrollSnap();
      onChange(newIndex);
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
        containScroll: "keepSnaps",
        dragFree: true,
      }}
      orientation={isMobile ? "horizontal" : "vertical"}
      setApi={setApi}
      className={isMobile ? "w-full relative" : "w-[120px] relative"}
    >
      {/* Controles para móvil */}
      {isMobile && (
        <>
          <CarouselPrevious className="left-2 h-8 w-8" />
          <CarouselNext className="right-2 h-8 w-8" />
        </>
      )}

      {/* Controles para escritorio */}
      {!isMobile && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-10 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() => api?.scrollPrev()}
        >
          <ChevronUp className="w-6 h-6" />
        </div>
      )}

      <CarouselContent
        className={
          isMobile
            ? "h-[120px] -ml-0"
            : "h-[480px] -mt-0"
        }
      >
        {images.map((imageUrl, index) => (
          <CarouselItem
            key={index}
            className={`${isMobile ? "basis-[120px]" : "basis-[25%]"} relative p-1 transition-transform duration-300 transform hover:scale-105`}
            onClick={() => {
              onChange(index);
              api?.scrollTo(index);
            }}
          >
            <div
              className={`relative aspect-square rounded-md overflow-hidden border-2 transition-colors duration-300 ${
                currentIndex === index ? "border-primary shadow-md" : "border-transparent"
              }`}
            >
              <Image
                src={imageUrl}
                alt={`Imagen ${index + 1}`}
                fill
                sizes="(max-width: 768px) 120px, 100px"
                className="object-cover cursor-pointer"
                priority={index === 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {!isMobile && (
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() => api?.scrollNext()}
        >
          <ChevronDown className="w-6 h-6" />
        </div>
      )}
    </Carousel>
  );
}
