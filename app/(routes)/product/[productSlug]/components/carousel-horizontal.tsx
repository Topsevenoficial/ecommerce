import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { ProductType } from "@/types/product";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/media";

interface CarouselHorizontalProps {
  product: ProductType;
  currentIndex: number;
  onChange: (index: number) => void;
}

export function CarouselHorizontal({
  product,
  currentIndex,
  onChange,
}: CarouselHorizontalProps) {
  // Mapeamos las imágenes del producto usando el helper getStrapiMedia.
  const images =
    product?.images?.map((image) => {
      // Se utiliza el formato "medium" si existe; de lo contrario, la URL original.
      const imagePath = image.formats?.medium?.url || image.url;
      return getStrapiMedia(imagePath);
    }) || [];

  const [api, setApi] = React.useState<CarouselApi | null>(null);

  // Estado para mostrar u ocultar el popup
  const [showPopup, setShowPopup] = React.useState(false);

  // Estados para zoom/arrastre dentro del popup
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [zoomScale, setZoomScale] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = React.useState(false);
  const [startPosition, setStartPosition] = React.useState({ x: 0, y: 0 });

  // Para pinch-to-zoom en mobile
  const [initialDistance, setInitialDistance] = React.useState<number | null>(null);

  // Estados para swipe horizontal (cambio de imagen) en popup
  const [swipeStartX, setSwipeStartX] = React.useState<number | null>(null);
  const [swipeDelta, setSwipeDelta] = React.useState(0);
  const SWIPE_THRESHOLD = 50; // píxeles mínimo para cambiar de imagen

  // Dirección de slide en el popup: "left" | "right" | ""
  const [slideDirection, setSlideDirection] = React.useState<"left" | "right" | "">("");

  React.useEffect(() => {
    if (!api) return;
    // Cuando tengamos la instancia de Embla, nos desplazamos al índice actual.
    api.scrollTo(currentIndex);
    // Al cambiar el slide en el carrusel, se actualiza el índice en el padre.
    api.on("select", () => {
      const newIndex = api.selectedScrollSnap();
      onChange(newIndex);
    });
  }, [api, currentIndex, onChange]);

  // Helpers para el zoom
  const resetZoom = () => {
    setIsZoomed(false);
    setZoomScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomToggle = () => {
    const newZoom = !isZoomed;
    setIsZoomed(newZoom);
    setZoomScale(newZoom ? 2 : 1);
    setPosition({ x: 0, y: 0 });
  };

  // Swipe / arrastre con mouse en el popup
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isZoomed) {
      setDragging(true);
      setStartPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    } else {
      setSwipeStartX(e.clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging && isZoomed) {
      const container = e.currentTarget.getBoundingClientRect();
      const maxOffsetX = (container.width / 2) * (zoomScale - 1);
      const maxOffsetY = (container.height / 2) * (zoomScale - 1);
      const newX = e.clientX - startPosition.x;
      const newY = e.clientY - startPosition.y;
      setPosition({
        x: Math.max(-maxOffsetX, Math.min(maxOffsetX, newX)),
        y: Math.max(-maxOffsetY, Math.min(maxOffsetY, newY)),
      });
    } else if (swipeStartX !== null) {
      const delta = e.clientX - swipeStartX;
      setSwipeDelta(delta);
    }
  };

  const handleMouseUp = () => {
    if (dragging) {
      setDragging(false);
    } else if (swipeStartX !== null) {
      if (swipeDelta > SWIPE_THRESHOLD) {
        goToPreviousImage();
      } else if (swipeDelta < -SWIPE_THRESHOLD) {
        goToNextImage();
      }
      setSwipeStartX(null);
      setSwipeDelta(0);
    }
  };

  // Pinch-to-zoom y swipe en dispositivos táctiles
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setSwipeStartX(e.touches[0].clientX);
    }
    if (e.touches.length === 2) {
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const distance = Math.hypot(t2.pageX - t1.pageX, t2.pageY - t1.pageY);
      setInitialDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && swipeStartX !== null) {
      const delta = e.touches[0].clientX - swipeStartX;
      setSwipeDelta(delta);
    }
    if (e.touches.length === 2 && initialDistance !== null) {
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const currentDistance = Math.hypot(t2.pageX - t1.pageX, t2.pageY - t1.pageY);
      const newScale = currentDistance / initialDistance;
      setZoomScale(newScale);
      setIsZoomed(newScale > 1);
    }
  };

  const handleTouchEnd = () => {
    if (swipeStartX !== null) {
      if (swipeDelta > SWIPE_THRESHOLD) {
        goToPreviousImage();
      } else if (swipeDelta < -SWIPE_THRESHOLD) {
        goToNextImage();
      }
      setSwipeStartX(null);
      setSwipeDelta(0);
    }
    setInitialDistance(null);
  };

  const goToPreviousImage = () => {
    setSlideDirection("left");
    if (currentIndex > 0) {
      onChange(currentIndex - 1);
    } else {
      onChange(images.length - 1);
    }
    resetZoom();
    setTimeout(() => setSlideDirection(""), 300);
  };

  const goToNextImage = () => {
    setSlideDirection("right");
    if (currentIndex < images.length - 1) {
      onChange(currentIndex + 1);
    } else {
      onChange(0);
    }
    resetZoom();
    setTimeout(() => setSlideDirection(""), 300);
  };

  if (images.length === 0) {
    return (
      <div className="text-center">
        <p>No se encontraron imágenes del producto.</p>
      </div>
    );
  }

  const progressValue = images.length > 1 ? (currentIndex / (images.length - 1)) * 100 : 100;

  return (
    <>
      {/* Carrusel principal */}
      <div className="mx-auto max-w-lg select-none relative">
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          className="w-full max-w-full aspect-square relative"
        >
          <CarouselContent>
            {images.map((imageUrl, index) => (
              <CarouselItem key={index} className="cursor-pointer">
                <div className="relative w-full aspect-square rounded-md overflow-hidden">
                  {/* Badges en la esquina superior izquierda */}
                  <div className="absolute top-2 left-2 z-20 flex flex-row-reverse items-center gap-2">
                    {product.UV400 && (
                      <Badge>
                        <Check className="w-3 h-3" />
                        UV400
                      </Badge>
                    )}
                    {product.polarizado && (
                      <Badge>
                        <Check className="w-3 h-3" />
                        Polarizado
                      </Badge>
                    )}
                  </div>
                  <div className="relative w-full h-full">
                    <Image
                      src={imageUrl}
                      alt={`Imagen ${index + 1}`}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      onClick={() => setShowPopup(true)}
                      style={{ cursor: "zoom-in" }}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Flechas laterales */}
          <CarouselPrevious className="hidden md:flex justify-center items-center cursor-pointer bg-white/50 dark:bg-gray-800/50 p-1 rounded-full shadow absolute left-2 top-1/2 -translate-y-1/2 z-10 hover:bg-white/60 dark:hover:bg-gray-700/60">
            <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-gray-200" />
          </CarouselPrevious>
          <CarouselNext className="hidden md:flex justify-center items-center cursor-pointer bg-white/50 dark:bg-gray-800/50 p-1 rounded-full shadow absolute right-2 top-1/2 -translate-y-1/2 z-10 hover:bg-white/60 dark:hover:bg-gray-700/60">
            <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-200" />
          </CarouselNext>
        </Carousel>
        <div className="py-2">
          <Progress value={progressValue} className="w-[60%] mx-auto" />
        </div>
      </div>

      {/* Popup para imagen ampliada */}
      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 sm:p-8"
          onClick={() => {
            setShowPopup(false);
            resetZoom();
          }}
        >
          <div
            className="relative max-w-screen-lg max-h-screen overflow-hidden transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button
              onClick={() => {
                setShowPopup(false);
                resetZoom();
              }}
              className="absolute top-3 right-3 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow cursor-pointer hover:bg-white/90 dark:hover:bg-gray-700/90 z-10"
            >
              ✕
            </button>
            <div
              className="flex justify-center items-center cursor-pointer bg-black/40 p-1 rounded-full shadow absolute left-2 top-1/2 -translate-y-1/2 z-10 hover:bg-black/50"
              onClick={goToPreviousImage}
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </div>
            <div
              className="flex justify-center items-center cursor-pointer bg-black/40 p-1 rounded-full shadow absolute right-2 top-1/2 -translate-y-1/2 z-10 hover:bg-black/50"
              onClick={goToNextImage}
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
            <div
              className={`relative ${isZoomed ? "cursor-grab" : "cursor-zoom-in"} transition-transform duration-300 ${
                slideDirection === "left"
                  ? "animate-in slide-in-from-left"
                  : slideDirection === "right"
                  ? "animate-in slide-in-from-right"
                  : ""
              }`}
              onDoubleClick={handleZoomToggle}
            >
              <p className="absolute bottom-3 left-3 text-white text-sm z-10 bg-black bg-opacity-50 px-2 py-1 rounded">
                {isZoomed ? "Arrastra para mover" : "Doble clic para zoom"}
              </p>
              <Image
                src={images[currentIndex]}
                alt={`Imagen ${currentIndex + 1}`}
                draggable={false}
                sizes="100vw"
                className="object-contain w-full h-auto max-h-screen"
                style={{
                  transform: isZoomed
                    ? `scale(${zoomScale}) translate(${position.x}px, ${position.y}px)`
                    : "scale(1)",
                  transition: dragging ? "none" : "transform 0.3s ease-in-out",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
