"use client";

import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { X, ShoppingCart } from "lucide-react";
import { useCartSheet } from "@/hooks/use-cart-sheet";

// Componentes ShadCN adicionales
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { getStrapiMedia } from "@/lib/media";

export function CartSheet() {
  const pathname = usePathname();
  const { items, removeItem, removeAll, totalAmount } = useCart();
  const { open, setOpen } = useCartSheet();
  const router = useRouter();

  // Si estamos en la página de orden, no mostramos el carrito
  if (pathname === "/orden") {
    return null;
  }

  // Calcula el total aplicando descuentos
  const total = totalAmount();
  const getDisplayCount = (count: number) => (count > 99 ? "99+" : count);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {items.length > 0 && (
              <Badge className="absolute -top-1 -right-1 rounded-full h-4 w-4 flex items-center justify-center text-xs transition-all duration-300">
                {getDisplayCount(items.length)}
              </Badge>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-full max-w-md"
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <SheetHeader>
            <div className="flex items-center space-x-2">
              <SheetTitle>Carrito de Compras</SheetTitle>
              {items.length > 0 && (
                <Badge variant="secondary">
                  {items.length} {items.length === 1 ? "producto" : "productos"}
                </Badge>
              )}
            </div>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-[60vh] mt-4 pr-2">
            {items.length === 0 ? (
              <div className="text-center text-muted-foreground">
                Tu carrito está vacío.
              </div>
            ) : (
              items.map((item) => (
                <Card key={item.id} className="mb-4">
                  <div className="flex items-center p-4">
                    <div className="relative w-16 h-16 mr-4">
                      <Image
                        src={
                          item.images && item.images[0]?.url
                            ? getStrapiMedia(item.images[0].url)
                            : "/placeholder.png"
                        }
                        alt={item.productName}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {item.productName}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {item.discount && item.discount > 0 ? (
                          <>
                            <span className="text-lg font-bold text-foreground">
                              S/{(item.price - item.discount).toFixed(2)}
                            </span>
                            <span className="text-sm text-red-600 line-through">
                              S/{item.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-foreground">
                            S/{item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {item.offerType && item.offerType !== "nada" && (
                        <Badge variant="destructive" className="mt-1">
                          {item.offerType.charAt(0).toUpperCase() +
                            item.offerType.slice(1)}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </ScrollArea>

          {items.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Subtotal:</span>
                <span className="text-lg font-bold">S/{total.toFixed(2)}</span>
              </div>
              <div className="mt-4 flex justify-between">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">Limpiar Carrito</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar acción</AlertDialogTitle>
                      <AlertDialogDescription>
                        ¿Estás seguro de que deseas limpiar el carrito? Esta acción no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          removeAll();
                          setOpen(false);
                        }}
                      >
                        Sí, limpiar carrito
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  variant="default"
                  onClick={() => {
                    setOpen(false);
                    router.push("/orden");
                  }}
                >
                  Proceder a Pago
                </Button>
              </div>
            </>
          )}

          <SheetClose asChild />
        </SheetContent>
      </Sheet>
    </>
  );
}
