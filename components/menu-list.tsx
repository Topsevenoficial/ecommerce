"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export function MenuList() {
  return (
    <>
      {/* Versión Desktop */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList className="gap-2">
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent hover:bg-accent/50 font-medium"
                )}
              >
                Catálogo
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/whatsapp" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent hover:bg-accent/50 font-medium"
                )}
              >
                Contacto
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Versión Mobile */}
      <div className="md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border-border hover:bg-accent/50"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-screen max-w-[240px] p-4">
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-sm font-medium px-2 py-1 rounded-md hover:bg-accent"
              >
                Catálogo
              </Link>
              <Link
                href="/whatsapp"
                className="text-sm font-medium px-2 py-1 rounded-md hover:bg-accent"
              >
                Contacto
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
