"use client";

import React, { useMemo, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ProductType } from "@/types/product";

// Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";

// Icons
import { Package, ShieldCheck, CheckCircle, Truck, RefreshCw, CreditCard, Info, Ruler } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

// Hooks
import { useCart } from "@/hooks/use-cart";
import { useCartSheet } from "@/hooks/use-cart-sheet";

const FEATURES = [
  { icon: Truck, title: "Envío Gratis", description: "Para recojo en agencia Shalom" },
  { icon: ShieldCheck, title: "Garantía", description: "Calidad asegurada" },
  { icon: CreditCard, title: "Pago Seguro", description: "Protegido por encriptación SSL" },
];

const PROTECTION_FEATURES = {
  polarizado: { label: 'Polarizado', description: 'Reduce el deslumbramiento' },
  UV400: { label: 'UV400', description: 'Protección 100% UV' },
  visionHD: { label: 'Visión HD', description: 'Máxima claridad' },
  antiImpacto: { label: 'Anti-Impacto', description: 'Resistente a caídas' },
  barreraDeslumbramiento: { label: 'Anti-Reflejo', description: 'Mejor visión' },
  limpiaFacil: { label: 'Fácil Limpieza', description: 'Repele manchas' }
};

interface ProductInfoProps {
  product: ProductType;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addItem } = useCart();
  const { setOpen } = useCartSheet();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pathname = usePathname();

  // Handle browser back button to close the sheet
  useEffect(() => {
    if (!isSheetOpen) return;

    const handlePopState = () => {
      setIsSheetOpen(false);
    };

    // Add a new history entry when sheet opens
    window.history.pushState({ isMeasurementsOpen: true }, '');
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isSheetOpen, pathname]);

  const discountAmount = product.discount ?? 0;
  const hasDiscount = discountAmount > 0;
  const discountedPrice = product.price - discountAmount;

  const formattedPrice = useMemo(() => formatPrice(product.price), [product.price]);
  const formattedDiscount = useMemo(() => formatPrice(discountAmount), [discountAmount]);
  const formattedDiscountedPrice = useMemo(() => formatPrice(discountedPrice), [discountedPrice]);

  const activeFeatures = Object.entries(PROTECTION_FEATURES)
    .filter(([key]) => product[key as keyof typeof PROTECTION_FEATURES])
    .map(([_, value]) => value);

  const handleAddToCart = () => {
    addItem(product);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with Price */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {product.productName}
            </h1>
            {product.marca && (
              <div className="mt-1">
                <Badge variant="outline" className="text-sm font-normal">
                  {product.marca}®
                </Badge>
              </div>
            )}
          </div>
          
          <div className="text-right">
            {hasDiscount && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground line-through">
                  {formattedPrice}
                </span>
                <Badge variant="destructive" className="text-xs">
                  -{formattedDiscount}
                </Badge>
              </div>
            )}
            <p className="text-2xl font-bold text-primary sm:text-3xl">
              {formattedDiscountedPrice}
            </p>
          </div>
        </div>

        {product.active && (
        <div className="space-y-2">
          {product.stock === null || product.stock === undefined || product.stock === 0 ? (
            <div className="flex items-center text-sm text-red-600">
              <span className="relative flex h-3 w-3 mr-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Producto agotado
            </div>
          ) : product.stock < 5 ? (
            <div className="flex items-center text-sm text-amber-600">
              <span className="relative flex h-3 w-3 mr-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              ¡Quedan pocas unidades! ({product.stock} disponibles)
            </div>
          ) : (
            <div className="flex items-center text-sm text-green-600">
              <span className="relative flex h-3 w-3 mr-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              En stock - Listo para enviar
            </div>
          )}
        </div>
      )}
      </div>

      <Separator />



      {/* Features Grid */}
      {activeFeatures.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {activeFeatures.map((feature, index) => (
            <div key={index} className="relative group">
              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md cursor-pointer transition-colors hover:bg-muted/50">
                <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
              <div className="absolute z-10 w-full p-2 mt-1 text-sm text-center text-foreground bg-popover rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                {feature.description}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover rotate-45 -z-10"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Material Info */}
      {product.materialMontura && (
        <Card className="border-none bg-muted/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary flex-shrink-0" />
              <h3 className="font-medium">Material de montura</h3>
              <Badge variant="outline" className="text-sm font-normal">
                {product.materialMontura}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {product.materialMontura === 'TR90' 
                ? 'Material ultraligero y flexible para máxima comodidad durante todo el día.'
                : product.materialMontura === 'Aluminio'
                ? 'Durabilidad y estilo en un material ligero y resistente a la corrosión.'
                : 'Material de alta calidad para un uso diario cómodo.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Lens Material Info */}
      {product.materialLente && (
        <Card className="border-none bg-muted/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary flex-shrink-0" />
              <h3 className="font-medium">Material de lentes</h3>
              <Badge variant="outline" className="text-sm font-normal">
                {product.materialLente}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {product.materialLente === 'Policarbonato' 
                ? 'Material altamente resistente a impactos, ligero y con protección UV incorporada.'
                : product.materialLente === 'TAC'
                ? 'Lentes de alta calidad óptica con excelente resistencia a los arañazos y distorsión mínima.'
                : 'Material de lente de alta calidad para una visión clara y protección ocular.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Measurements Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setIsSheetOpen(true)}
          >
            <Ruler className="h-4 w-4" />
            Ver medidas exactas
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Medidas del producto</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {product.medidas ? (
              <div 
                className="prose prose-sm dark:prose-invert max-w-none text-foreground dark:text-foreground" 
                dangerouslySetInnerHTML={{ 
                  __html: product.medidas
                    .replace(/\n/g, '<br />')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground dark:text-foreground">$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em class="text-foreground dark:text-foreground">$1</em>')
                }} 
              />
            ) : (
              <p className="text-muted-foreground">No hay medidas disponibles para este producto.</p>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Action Buttons */}
      <div className="space-y-3">
        {(product.stock === 0 || product.stock === null || product.stock === undefined) ? (
          <div className="space-y-3">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
              <p className="text-red-600 dark:text-red-400 font-medium">
                Este producto está actualmente agotado
              </p>
              <p className="text-sm text-red-500 dark:text-red-400 mt-1 mb-3">
                Contáctanos para más información sobre la disponibilidad
              </p>
              <Button 
                asChild
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
              >
                <a 
                  href={`https://wa.me/51984670999?text=¡Hola! Estoy interesado en saber cuándo tendrán nuevamente disponible el producto: ${encodeURIComponent(product.productName)}. ${typeof window !== 'undefined' ? 'Enlace: ' + window.location.href : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.471-.148-.67.15-.197.297-.767.963-.94 1.16-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.795-1.48-1.775-1.653-2.075-.174-.297-.018-.458.13-.606.136-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.005-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.345m-5.446 7.443h-.016a9.375 9.375 0 01-5.19-1.574l-.366-.223-3.754 1.001.992-3.705-.24-.375a9.343 9.343 0 01-1.454-4.996 9.39 9.39 0 0116.15-6.62 9.29 9.29 0 012.734 6.616 9.39 9.39 0 01-9.386 9.086z"/>
                  </svg>
                  Consultar disponibilidad por WhatsApp
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleAddToCart}
              variant="outline"
              size="lg" 
              className="w-full h-14 text-base font-medium border-2 hover:bg-primary/10"
            >
              Añadir al carrito
            </Button>
            <Button 
              asChild
              size="lg" 
              className="w-full h-14 text-base font-medium bg-green-600 hover:bg-green-700 text-white"
            >
              <a 
                href={`https://wa.me/51984670999?text=¡Hola! Estoy interesado en este producto: ${encodeURIComponent(product.productName)} - ${typeof window !== 'undefined' ? window.location.href : ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.471-.148-.67.15-.197.297-.767.963-.94 1.16-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.795-1.48-1.775-1.653-2.075-.174-.297-.018-.458.13-.606.136-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.005-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.345m-5.446 7.443h-.016a9.375 9.375 0 01-5.19-1.574l-.366-.223-3.754 1.001.992-3.705-.24-.375a9.343 9.343 0 01-1.454-4.996 9.39 9.39 0 0116.15-6.62 9.29 9.29 0 012.734 6.616 9.39 9.39 0 01-9.386 9.086z"/>
                </svg>
                WhatsApp
              </a>
            </Button>
          </div>
        )}
        
        <Button 
          onClick={() => {
            if (product.stock === 0 || product.stock === null || product.stock === undefined) return;
            handleAddToCart();
            if (typeof window !== 'undefined') {
              window.location.href = '/orden';
            }
          }}
          size="lg" 
          disabled={product.stock === 0 || product.stock === null || product.stock === undefined}
          className={`w-full h-14 text-base font-bold ${
            (product.stock === 0 || product.stock === null || product.stock === undefined)
              ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl'
          } transition-all duration-200`}
        >
          {(product.stock === 0 || product.stock === null || product.stock === undefined) ? 'Producto agotado' : 'Comprar ahora'}
        </Button>
        
        <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs text-muted-foreground">
          {FEATURES.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <feature.icon className="h-5 w-5 mb-1 text-primary" />
              <p className="font-medium">{feature.title}</p>
              <p className="text-xs">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}
